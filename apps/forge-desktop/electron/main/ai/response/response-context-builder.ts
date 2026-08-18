/**
 * response-context-builder.ts
 *
 * ResponseContextBuilder — assembles a structured, provider-agnostic
 * ResponseRequest from a completed PipelineContext.
 */

import type { PipelineContext } from '../pipeline/pipeline-context';
import type { ResponseRequest, GroundedContext, FileContentFact } from './response-types';
import { FactInterpreter } from './fact-interpreter';
import { ResultNormalizer } from '../pipeline/result-normalizer';

export class ResponseContextBuilder {
  constructor(
    private readonly factInterpreter: FactInterpreter = new FactInterpreter(),
    private readonly normalizer: ResultNormalizer = new ResultNormalizer()
  ) {}

  /**
   * Assembles a ResponseRequest from the pipeline's final context and user prompt.
   */
  build(
    context: PipelineContext,
    userPrompt: string,
    activeFileFact?: FileContentFact | null
  ): ResponseRequest {
    const goal =
      (context.generatedPlan as any)?.goal ||
      (context.generatedPlan as any)?.goalDescription ||
      userPrompt;

    const executionSuccess =
      context.executionOutcome?.success ??
      context.verificationReport?.success ??
      true;

    const verificationSuccess = context.verificationReport?.success ?? true;

    const recommendations: readonly string[] =
      context.reflectionReport?.recommendations ?? [];

    const contextSummary = this._buildContextSummary(context);

    // Pass results through ResultNormalizer before handing to FactInterpreter
    let groundedContext: GroundedContext | undefined;
    if (context.executionResults && context.executionResults.length > 0) {
      const normalizedResults = context.executionResults.map((exec) => {
        if (!exec.result) return exec;
        const normalized = this.normalizer.normalize(exec.result);
        return { ...exec, result: normalized };
      });
      groundedContext = this.factInterpreter.interpret(normalizedResults);
    }

    if (activeFileFact) {
      const existingFacts = groundedContext?.knowledgeFacts ?? [];
      const hasSamePath = existingFacts.some(
        (f) => f.kind === 'file_content' && (f as any).path === activeFileFact.path
      );
      if (!hasSamePath) {
        const knowledgeFacts = [activeFileFact, ...existingFacts];
        groundedContext = {
          executionResults: groundedContext?.executionResults ?? [],
          repositoryFacts: groundedContext?.repositoryFacts ?? [activeFileFact],
          terminalFacts: groundedContext?.terminalFacts ?? [],
          knowledgeFacts,
        };
      }
    }

    return {
      userPrompt,
      workspace: {
        root: context.workspaceRoot,
      },
      execution: {
        success: executionSuccess,
        goal,
      },
      verification: {
        success: verificationSuccess,
      },
      reflection: {
        recommendations,
      },
      context: {
        summary: contextSummary,
      },
      groundedContext,
    };
  }

  // ─── Private Helpers ────────────────────────────────────────────────────────

  private _buildContextSummary(context: PipelineContext): string {
    const parts: string[] = [];

    const collected = context.contextCollected as any;
    if (collected?.workspace?.rootPath) {
      parts.push(`Workspace: ${collected.workspace.rootPath}`);
    }
    if (collected?.workspace?.fileCount !== undefined) {
      parts.push(`Total files: ${collected.workspace.fileCount}`);
    }
    if (collected?.workspace?.languages?.length) {
      parts.push(`Languages: ${(collected.workspace.languages as string[]).join(', ')}`);
    }

    const memories = context.memoriesFetched;
    if (Array.isArray(memories) && memories.length > 0) {
      parts.push(`Relevant memories retrieved: ${memories.length}`);
    }

    return parts.length > 0 ? parts.join('\n') : '';
  }
}
