/**
 * response-generation-engine.ts
 *
 * ResponseGenerationEngine — invokes the active AI runtime and returns
 * the final natural-language assistant response.
 *
 * Delegates prompt composition to PromptComposer.
 */

import type { IRuntimeManager } from '../runtime/runtime-types';
import type { IDesktopLogger, IDesktopEventBus } from '../../container/service-interfaces';
import type { ResponseRequest, AiExecutionMetadata } from './response-types';
import { PromptComposer } from './prompt-composer';
import { ResponseModeClassifier } from './response-mode-classifier';
import { ResponseTemplates } from './response-templates';
import { FileQueryNormalizer } from './file-query-normalizer';
import * as fs from 'fs';
import * as path from 'path';

// ─── Internal Result ─────────────────────────────────────────────────────────

interface GenerationResult {
  readonly text: string;
  readonly metadata: AiExecutionMetadata;
}

// ─── Engine ──────────────────────────────────────────────────────────────────

export class ResponseGenerationEngine {
  constructor(
    private readonly runtimeManager: IRuntimeManager,
    private readonly eventBus: IDesktopEventBus | undefined,
    private readonly logger: IDesktopLogger,
    private readonly promptComposer: PromptComposer = new PromptComposer(),
    private readonly classifier: ResponseModeClassifier = new ResponseModeClassifier()
  ) {}

  /**
   * Generates a natural-language response for the given ResponseRequest.
   * Never throws — falls back to a readable summary on failure.
   */
  async generate(request: ResponseRequest): Promise<GenerationResult> {
    const startMs = Date.now();

    // 0. Signal classifying phase
    this._emit('response:phase.changed', { phase: 'classifying', userPrompt: request.userPrompt });

    // 1. Classify response mode
    const decision = this.classifier.classify(request.userPrompt);

    this.logger.info(
      `[ResponseGenerationEngine] Model routing: mode="${decision.mode}", suggestedRuntime="${decision.suggestedRuntime}"`
    );

    // 2. Skip LLM for deterministic actions
    if (!decision.requiresLlm) {
      const text = this._buildDeterministicResponse(request);
      const metadata: AiExecutionMetadata = {
        runtime: 'deterministic',
        model: 'deterministic',
        durationMs: 0,
        provider: 'deterministic',
        fallbackUsed: false,
        streaming: false,
      };

      this._emit('response:phase.changed', { phase: 'complete', durationMs: 0 });
      this._emit('response:generation.completed', {
        runtimeId: 'deterministic',
        durationMs: 0,
        fallbackUsed: false,
        responseLength: text.length,
      });

      this.logger.info(
        `[ResponseGenerationEngine] Skip LLM for deterministic action ("${request.userPrompt}"). Returning instant response.`
      );

      return { text, metadata };
    }

    const runtime = this.runtimeManager.resolveFallbackRuntime
      ? await this.runtimeManager.resolveFallbackRuntime()
      : this.runtimeManager.active();

    this._emit('response:generation.started', {
      runtimeId: runtime.id,
      runtimeName: runtime.name,
      userPrompt: request.userPrompt,
    });

    this.logger.info(
      `[ResponseGenerationEngine] Generating response via runtime "${runtime.id}" for prompt: "${request.userPrompt}"`
    );

    // Signal assembling phase
    this._emit('response:phase.changed', { phase: 'assembling' });
    const prompt = this.promptComposer.compose(request);

    // Prompt telemetry logging
    const promptStats = {
      promptCharacters: prompt.length,
      userPromptCharacters: request.userPrompt.length,
      groundedFactCount: request.groundedContext?.knowledgeFacts?.length ?? 0,
      contextSummaryCharacters: request.context.summary?.length ?? 0,
      estimatedTokens: Math.ceil(prompt.length / 4),
    };

    this.logger.info(
      `[ResponseGenerationEngine] Prompt telemetry: ${JSON.stringify(promptStats)}`
    );

    let rawText: string;
    let fallbackUsed = false;

    // Signal generating phase
    this._emit('response:phase.changed', { phase: 'generating' });

    try {
      rawText = await this._invokeRuntime(prompt, request, runtime);
    } catch (err: any) {
      this.logger.warn(
        `[ResponseGenerationEngine] Runtime "${runtime.id}" failed: ${err?.message || err}. Using fallback summary.`
      );
      rawText = this._buildFallbackSummary(request);
      fallbackUsed = true;

      this._emit('response:generation.failed', {
        runtimeId: runtime.id,
        error: err?.message || String(err),
      });
    }

    const response = this._sanitize(rawText);
    const durationMs = Date.now() - startMs;

    const metadata: AiExecutionMetadata = {
      runtime: runtime.id,
      model: runtime.name,
      durationMs,
      provider: runtime.id,
      fallbackUsed,
      streaming: true,
    };

    this._emit('response:phase.changed', { phase: 'complete', durationMs });
    this._emit('response:generation.completed', {
      runtimeId: runtime.id,
      durationMs,
      fallbackUsed,
      responseLength: response.length,
    });

    this.logger.info(
      `[ResponseGenerationEngine] Generation complete. Runtime: "${runtime.id}", duration: ${durationMs}ms, fallback: ${fallbackUsed}`
    );

    return { text: response, metadata };
  }

  // ─── Private: Runtime Invocation ────────────────────────────────────────────

  private _invokeRuntime(
    prompt: string,
    request: ResponseRequest,
    runtime: { id: string; name: string; generateStream: Function }
  ): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      const controller = new AbortController();
      const ctx = {
        workspace: { rootPath: request.workspace.root },
        userPrompt: request.userPrompt,
      };

      runtime
        .generateStream(prompt, ctx, controller.signal)
        .then((stream: any) => {
          stream
            .onToken((token: string) => {
              this._emit('response:generation.progress', { token });
            })
            .onComplete((fullText: string) => {
              resolve(fullText);
            })
            .onError((err: Error) => {
              reject(err);
            });
        })
        .catch(reject);
    });
  }

  // ─── Private: Sanitizer ─────────────────────────────────────────────────────

  private _sanitize(raw: string): string {
    if (!raw || !raw.trim()) {
      return 'The task completed, but no response was generated.';
    }
    return raw.trim().replace(/\n{3,}/g, '\n\n');
  }

  // ─── Private: Fast Deterministic Response Builder ───────────────────────────

  private _buildDeterministicResponse(request: ResponseRequest): string {
    const norm = FileQueryNormalizer.normalize(request.userPrompt);
    const promptLower = (request.userPrompt || '').trim().toLowerCase();

    if (norm.intent === 'open' || promptLower.startsWith('open ') || promptLower === 'open') {
      const fileFact = request.groundedContext?.knowledgeFacts?.find(
        (f) => f.kind === 'file_content'
      ) as { path?: string } | undefined;

      const rawTarget = norm.relativePath || norm.basename || request.userPrompt.slice(4).trim();
      const targetPath = fileFact?.path || rawTarget;

      if (targetPath) {
        const root = request.workspace.root || process.cwd();
        const fullPath = path.isAbsolute(targetPath) ? targetPath : path.join(root, targetPath);
        if (request.workspace.root && fs.existsSync(request.workspace.root) && !fs.existsSync(fullPath)) {
          return `Failed to open file: File "${targetPath}" does not exist.`;
        }

        console.log('[AI OPEN] emitting', fullPath);
        this._emit('ai:execute-command', {
          commandId: 'forge.workspace.openFile',
          args: [fullPath],
        });
        return ResponseTemplates.opened(targetPath);
      }
    }

    if (norm.intent === 'find' || promptLower.startsWith('find ') || promptLower === 'find') {
      const searchFact = request.groundedContext?.knowledgeFacts?.find(
        (f) => f.kind === 'workspace_search'
      ) as { totalMatches?: number; matches?: any[]; query?: string } | undefined;

      const query = norm.basename || norm.relativePath || searchFact?.query || request.userPrompt.slice(4).trim();
      const count = searchFact?.totalMatches ?? searchFact?.matches?.length ?? 0;
      if (query) {
        return ResponseTemplates.found(count, query);
      }
    }

    return request.executionSummary ?? 'Done.';
  }

  // ─── Private: Fallback ──────────────────────────────────────────────────────

  private _buildFallbackSummary(request: ResponseRequest): string {
    const lines: string[] = [];

    if (request.execution.success) {
      lines.push(`Task completed successfully.`);
    } else {
      lines.push(`Task encountered issues during execution.`);
    }

    if (request.execution.goal && request.execution.goal !== request.userPrompt) {
      lines.push(`\nGoal: ${request.execution.goal}`);
    }

    if (request.context.summary) {
      lines.push(`\n${request.context.summary}`);
    }

    if (request.reflection.recommendations.length > 0) {
      lines.push(`\nNotes:\n${request.reflection.recommendations.map((r) => `- ${r}`).join('\n')}`);
    }

    if (!request.verification.success) {
      lines.push(`\nSome verification checks did not pass. Review the pipeline timeline for details.`);
    }

    return lines.join('') || 'Task completed.';
  }

  // ─── Private: Event Emitter ─────────────────────────────────────────────────

  private _emit(topic: string, payload: Record<string, unknown>): void {
    try {
      this.eventBus?.emit(topic, payload);
    } catch {
      // Event bus is best-effort — never block generation
    }
  }
}
