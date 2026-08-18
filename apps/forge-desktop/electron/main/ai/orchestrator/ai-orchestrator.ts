import { PipelineContext, PipelineContextHelper } from '../pipeline/pipeline-context';
import { PipelineExecutor } from '../pipeline/pipeline-executor';
import { PipelineRecorder } from '../pipeline/pipeline-recorder';
import {
  ContextCollectionStage,
  MemoryRetrievalStage,
  RepositoryScanStage,
  IntentDetectionStage,
  GoalExtractionStage,
  PlanningStage,
  ReasoningStage,
  ExecutionStage,
  VerificationStage,
  RecoveryStage,
  ReflectionStage,
  OutcomeStage,
  LearningStage,
  IAiPipelineStage,
} from '../pipeline/pipeline-stage';
import type {
  IContextEngine,
  IRepositoryProvider,
  IPlanner,
  IExecutionEngine,
  IWorkspaceService,
  IDesktopLogger,
  IPlan,
} from '../../container/service-interfaces';
import { MemoryRegistry } from '../memory/memory-registry';
import { IntentDetector } from '../planner/intent-detector';
import { GoalExtractor } from '../planner/goal-extractor';
import { GoalTaskPlanner } from '../planner/task-planner';
import { TaskPlanner } from '../planner/planner';
import { ExecutionPlanner } from '../planner/execution-planner';
import { ReasoningEngine } from '../reasoning/reasoning-engine';
import { VerificationEngine } from '../verification/verification-engine';
import { RecoveryOrchestrator } from '../recovery/recovery-orchestrator';
import { ReflectionEngine } from '../reflection/reflection-engine';
import { OutcomeManager } from '../outcome/outcome-manager';
import { LearningEngine } from '../learning/learning-engine';
import { ResponseContextBuilder } from '../response/response-context-builder';
import { ResponseGenerationEngine } from '../response/response-generation-engine';
import type { AiExecutionResult, GroundedContext, KnowledgeFact, FileContentFact } from '../response/response-types';
import { SessionContextManager } from '../session/session-context-manager';
import { ContextResolutionService } from '../memory/resolution/context-resolution-service';
import { generateExecutionEventId } from '../memory/events/execution-event';
import { ExecutionRouter } from '../execution/execution-router';
import { ExecutionGoal } from '../contracts/execution-goal';
import { ResultNormalizer } from '../pipeline/result-normalizer';
import { ResultValidator } from '../pipeline/result-validator';
import { ExecutionEntityExtractor } from '../memory/extraction/execution-entity-extractor';
import { QueryNormalizationEngine } from '../response/query-normalization-engine';
import { SemanticContextRetriever } from '../context/semantic-retriever';
import { EngineeringIntelligenceEngine } from '../intelligence/engineering-intelligence-engine';

import { ActiveFileGroundingService } from '../response/active-file-grounding';
import { FileQueryNormalizer, FolderQueryNormalizer } from '../response/file-query-normalizer';
import * as fs from 'fs';
import * as path from 'path';

export interface IAiRequest {
  readonly id: string;
  readonly prompt: string;
  readonly options?: Record<string, any>;
}

export class AiOrchestrator {
  private readonly stages: IAiPipelineStage[];
  private readonly responseContextBuilder: ResponseContextBuilder;
  private readonly activeFileGrounding: ActiveFileGroundingService;
  private readonly normalizer = new ResultNormalizer();
  private readonly validator = new ResultValidator();
  private readonly entityExtractor = new ExecutionEntityExtractor();
  constructor(
    private readonly contextEngine: IContextEngine,
    private readonly memoryRegistry: MemoryRegistry,
    private readonly repo: IRepositoryProvider,
    private readonly intentDetector: IntentDetector,
    private readonly goalExtractor: GoalExtractor,
    private readonly corePlanner: GoalTaskPlanner,
    private readonly strategyPlanner: ExecutionPlanner,
    private readonly taskPlanner: IPlanner,
    private readonly reasoningEngine: ReasoningEngine,
    private readonly executionEngine: IExecutionEngine,
    private readonly verificationEngine: VerificationEngine,
    private readonly recoveryOrchestrator: RecoveryOrchestrator,
    private readonly reflectionEngine: ReflectionEngine,
    private readonly outcomeManager: OutcomeManager,
    private readonly learningEngine: LearningEngine,
    private readonly pipelineExecutor: PipelineExecutor,
    private readonly pipelineRecorder: PipelineRecorder,
    private readonly workspaceService: IWorkspaceService,
    private readonly logger: IDesktopLogger,
    private readonly responseGenerationEngine: ResponseGenerationEngine,
    private readonly sessionManager: SessionContextManager = new SessionContextManager(),
    private readonly resolutionService: ContextResolutionService = new ContextResolutionService(),
    private readonly executionRouter?: ExecutionRouter,
    // Sprint 87: injected through DI — NOT created inside this class
    private readonly semanticRetriever?: SemanticContextRetriever,
    private readonly engineeringIntel?: EngineeringIntelligenceEngine
  ) {
    this.responseContextBuilder = new ResponseContextBuilder();
    this.activeFileGrounding = new ActiveFileGroundingService(this.workspaceService, this.logger);
    this.stages = [
      new ContextCollectionStage(this.contextEngine),
      new MemoryRetrievalStage(this.memoryRegistry),
      new RepositoryScanStage(this.repo),
      new IntentDetectionStage(this.intentDetector),
      new GoalExtractionStage(this.goalExtractor),
      new PlanningStage(this.corePlanner, this.strategyPlanner, this.taskPlanner),
      new ReasoningStage(this.reasoningEngine),
      new ExecutionStage(this.executionEngine),
      new VerificationStage(this.verificationEngine),
      new RecoveryStage(this.recoveryOrchestrator),
      new ReflectionStage(this.reflectionEngine),
      new OutcomeStage(this.outcomeManager),
      new LearningStage(this.learningEngine),
    ];
  }

  async executeRequest(req: IAiRequest): Promise<AiExecutionResult> {
    const requestStartMs = Date.now();
    this.logger.info(`[AiOrchestrator] Initiating request: ${req.id} - Prompt: "${req.prompt}"`);

    const workspaceRoot = this.workspaceService.getRootPath();
    const session = this.sessionManager.getOrCreateSession('default_session', workspaceRoot || process.cwd());

    // Step 1: Resolve context and conversational pronouns before planning
    const contextResStart = Date.now();
    const resolvedContext = this.resolutionService.resolve(req.prompt, session);
    const contextResolutionMs = Date.now() - contextResStart;
    const targetPrompt = resolvedContext.resolvedPrompt;

    if (resolvedContext.hasResolvedReferences) {
      this.logger.info(`[AiOrchestrator] Resolved conversational prompt: "${targetPrompt}"`);
    }

    // Step 2: Record user message in ConversationDomain
    session.conversation.addMessage({
      messageId: `msg_user_${Date.now()}`,
      turnId: req.id,
      role: 'user',
      content: req.prompt,
      timestamp: new Date().toISOString(),
      resolvedBindings: resolvedContext.entityBindings as any[],
    });

    // ─── Canonical TRACE log (Sprint 87) ────────────────────────────────────────
    const normalized = QueryNormalizationEngine.normalize(targetPrompt);
    this.logger.info(`[TRACE] ${JSON.stringify({
      rawPrompt: req.prompt,
      resolvedIntent: normalized.intent,
      domain: normalized.domain,
      target: normalized.target,
      targetType: normalized.targetType,
      targetValidated: normalized.targetValidated,
      confidence: normalized.confidence,
      executionMode: normalized.executionMode,
    })}`);

    // ─── Direct Deterministic File Query Check (Bypasses LLM in <100ms) ─────────────
    const directFastPath = await this._tryDirectDeterministicFileQuery(req.prompt, targetPrompt, session, resolvedContext);
    if (directFastPath) {
      this.logger.info(`[TRACE] ${JSON.stringify({ route: 'file-query', groundingStatus: 'NOT_APPLICABLE', llmInvoked: false, responseRuntime: 'deterministic' })}`);
      this.logger.info(`[AiOrchestrator] Direct Deterministic File Query executed in ${Date.now() - requestStartMs}ms`);
      session.conversation.addMessage({
        messageId: `msg_assistant_${Date.now()}`,
        turnId: req.id,
        role: 'assistant',
        content: directFastPath,
        timestamp: new Date().toISOString(),
      });

      return {
        success: true,
        result: {
          response: directFastPath,
          metadata: {
            timing: {
              contextResolutionMs,
              pipelineMs: 0,
              responseGenerationMs: Date.now() - requestStartMs,
              totalMs: Date.now() - requestStartMs,
              fastPathUsed: true,
            },
            fallbackUsed: false,
          },
        },
        finalContext: PipelineContextHelper.create(req.id, targetPrompt, workspaceRoot),
      };
    }

    // ─── CODE_EXPLAIN: Route to engineering intelligence before pipeline (Sprint 87) ──────
    if (QueryNormalizationEngine.isCodeExplain(normalized) && this.semanticRetriever) {
      this.logger.info(`[TRACE] ${JSON.stringify({ route: 'code-explain', target: normalized.target, executionMode: 'engineering-intelligence' })}`);
      const activeFilePath = session.getState()?.activeDocument?.filePath;
      const explainResult = await this._tryCodeExplainGrounding(targetPrompt, normalized.target, activeFilePath);
      const evidenceCount = explainResult.evidenceCount;
      const groundingStatus = explainResult.sufficient ? 'SUFFICIENT' : 'INSUFFICIENT';

      this.logger.info(`[TRACE] ${JSON.stringify({ route: 'code-explain', evidenceCount, groundingStatus, llmInvoked: explainResult.sufficient, responseRuntime: explainResult.sufficient ? 'ollama' : 'deterministic' })}`);

      if (!explainResult.sufficient) {
        // Evidence policy failed — return explicit insufficient-context, do NOT invoke LLM
        const concept = normalized.target || targetPrompt;
        const insufficientResponse = `I don't have enough repository evidence to answer about "${concept}" accurately. ` +
          `Try asking about a specific file, class, or function name instead.`;
        session.conversation.addMessage({
          messageId: `msg_assistant_${Date.now()}`,
          turnId: req.id,
          role: 'assistant',
          content: insufficientResponse,
          timestamp: new Date().toISOString(),
        });
        return {
          success: true,
          result: {
            response: insufficientResponse,
            metadata: { timing: { contextResolutionMs, pipelineMs: 0, responseGenerationMs: 0, totalMs: Date.now() - requestStartMs, fastPathUsed: false }, fallbackUsed: false },
          },
          finalContext: PipelineContextHelper.create(req.id, targetPrompt, workspaceRoot),
        };
      }

      // Evidence sufficient — route to LLM with grounded context
      const explainContext = PipelineContextHelper.create(req.id, targetPrompt, workspaceRoot);
      const responseRequest = this.responseContextBuilder.build(explainContext, req.prompt, null);
      // Attach grounded evidence as knowledge facts
      const enrichedRequest = {
        ...responseRequest,
        groundedContext: explainResult.groundedContext,
      };
      const genResult = await this.responseGenerationEngine.generate(enrichedRequest);
      const explainResponse = genResult.text;

      session.conversation.addMessage({
        messageId: `msg_assistant_${Date.now()}`,
        turnId: req.id,
        role: 'assistant',
        content: explainResponse,
        timestamp: new Date().toISOString(),
      });
      return {
        success: true,
        result: {
          response: explainResponse,
          metadata: { timing: { contextResolutionMs, pipelineMs: 0, responseGenerationMs: Date.now() - requestStartMs, totalMs: Date.now() - requestStartMs, fastPathUsed: false }, fallbackUsed: genResult.metadata?.fallbackUsed ?? false },
        },
        finalContext: explainContext,
      };
    }

    // ─── Semantic Execution Source Router Check ──────────────────────────────────────
    const routerStart = Date.now();
    let memoryHit = false;
    let routerResponse: string | null = null;

    const classifiedIntent = this.corePlanner.classifyIntent(targetPrompt);
    const classifiedGoal = (classifiedIntent as any).goal || ExecutionGoal.UNKNOWN;

    if (this.executionRouter) {
      const routerResult = await this.executionRouter.resolveGoal(classifiedGoal, session);
      if (routerResult && routerResult.formattedResponse) {
        routerResponse = routerResult.formattedResponse;
        memoryHit = routerResult.source === 'memory';
        this.logger.info(`[AiOrchestrator] ExecutionRouter resolved goal "${classifiedGoal}" via source "${routerResult.source}" in ${Date.now() - routerStart}ms`);
      }
    }

    let finalContext: PipelineContext;
    let pipelineMs = 0;

    if (routerResponse) {
      finalContext = PipelineContextHelper.create(req.id, targetPrompt, workspaceRoot);
    } else {
      const pipelineStart = Date.now();
      const initialContext = PipelineContextHelper.create(req.id, targetPrompt, workspaceRoot);
      const structuredState = session.getState();
      (initialContext as any).session = session;
      (initialContext as any).entities = session.entities;
      (initialContext as any).conversationHistory = session.conversation.getMessages();
      (initialContext as any).state = structuredState;
      (initialContext as any).resolution = resolvedContext.resolution;
      (initialContext as any).contextCollected = {
        timestamp: new Date().toISOString(),
        workspace: { rootPath: workspaceRoot, root: workspaceRoot, recentCommands: [], activeThemeId: '', gitBranchPlaceholder: '' },
        editor: { activeFilePath: structuredState.activeDocument?.filePath || null, openFilePaths: [], currentSelection: null, cursorPosition: null },
        state: structuredState,
        session,
        entities: session.entities,
        conversationHistory: session.conversation.getMessages(),
      };

      finalContext = await this.pipelineExecutor.execute(initialContext, this.stages);
      pipelineMs = Date.now() - pipelineStart;

      // Process task execution results through Normalizer -> Validator -> Extractor -> EntityStore & ExecutionDomain
      if (finalContext.executionResults && finalContext.executionResults.length > 0) {
        for (const res of finalContext.executionResults) {
          const rawPayload = res.result || {};
          const normalizedEnvelope = this.normalizer.normalize(rawPayload);
          const validation = this.validator.validate(normalizedEnvelope);

          if (!validation.valid) {
            this.logger.warn(`[AiOrchestrator] Tool result contract validation failed: ${validation.errors.join(', ')}`);
          }

          const evtPayload = normalizedEnvelope.payload ? normalizedEnvelope : rawPayload;

          const event = {
            id: generateExecutionEventId(),
            sessionId: session.sessionId,
            turnId: req.id,
            taskId: res.taskId,
            toolId: res.toolId,
            type: (res.status === 'completed' ? 'tool_completed' : 'tool_failed') as any,
            timestamp: new Date().toISOString(),
            durationMs: res.durationMs || 0,
            success: res.status === 'completed',
            payload: evtPayload,
          };

          session.execution.emitEvent(event);

          // Extract typed entities and store into session.entities (IEntityStore)
          const extractedEntities = this.entityExtractor.extractEntities([event]);
          for (const entity of extractedEntities) {
            if (session.entities && entity.kind) {
              session.entities.set(entity.kind, entity);
            }
          }
        }
      }

      await this.pipelineRecorder.record(finalContext);
    }

    // ─── Response Generation & Deterministic Fast-Path ────────────────────────

    const responseGenStart = Date.now();
    let response: string;
    let fallbackUsed = false;

    // Check Router Response, then Deterministic Fast-Path
    const fastPathResponse = routerResponse || this._tryDeterministicFastPath(req.prompt, targetPrompt, finalContext);

    if (fastPathResponse) {
      response = fastPathResponse;
      fallbackUsed = false;
      this.logger.info(`[TRACE] ${JSON.stringify({ route: 'fast-path', groundingStatus: 'NOT_APPLICABLE', llmInvoked: false, responseRuntime: 'deterministic' })}`);
      this.logger.info(`[AiOrchestrator] Deterministic Fast-Path executed in ${Date.now() - responseGenStart}ms`);
    } else {
      const activeFilePath = session.getState()?.activeDocument?.filePath;
      const activeFileFact = await this.activeFileGrounding.tryGround(activeFilePath, req.prompt);
      const responseRequest = this.responseContextBuilder.build(finalContext, req.prompt, activeFileFact);
      const genResult = await this.responseGenerationEngine.generate(responseRequest);
      response = genResult.text;
      fallbackUsed = genResult.metadata?.fallbackUsed ?? false;
      this.logger.info(`[TRACE] ${JSON.stringify({ route: 'pipeline', groundingStatus: 'NOT_APPLICABLE', llmInvoked: true, responseRuntime: fallbackUsed ? 'fallback' : 'ollama' })}`);
    }

    const responseGenerationMs = Date.now() - responseGenStart;
    const totalMs = Date.now() - requestStartMs;

    const timingDiagnostics = {
      contextResolutionMs,
      pipelineMs,
      responseGenerationMs,
      totalMs,
      fastPathUsed: !!fastPathResponse,
    };

    this.logger.info(
      `[AiOrchestrator] Request complete in ${totalMs}ms (ContextRes: ${contextResolutionMs}ms, Pipeline: ${pipelineMs}ms, ResponseGen: ${responseGenerationMs}ms, FastPath: ${!!fastPathResponse})`
    );

    // Step 4: Record assistant response turn in ConversationDomain
    session.conversation.addMessage({
      messageId: `msg_assistant_${Date.now()}`,
      turnId: req.id,
      role: 'assistant',
      content: response,
      timestamp: new Date().toISOString(),
    });

    return {
      success: true,
      result: {
        response,
        metadata: {
          timing: timingDiagnostics,
          fallbackUsed,
        },
      },
      finalContext,
    };
  }

  /**
   * Broadened Deterministic Fast-Path.
   * Returns an instant grounded text response for structured, complete tool outputs
   * (file counts, directory listings, workspace statistics) without LLM inference (<500ms).
   */
  private _tryDeterministicFastPath(originalPrompt: string, resolvedPrompt: string, context: PipelineContext): string | null {
    if (!context.executionResults || context.executionResults.length === 0) {
      return null;
    }

    const promptLower = originalPrompt.toLowerCase().trim();

    for (const res of context.executionResults) {
      if (res.status !== 'completed' || !res.result) continue;
      const result = res.result;
      // Tools place their data under result.payload; fall back to top-level for legacy results.
      const payload = result.payload ?? result;

      // 1. Workspace Statistics File Count Fast-Path
      const filesCount = payload.filesCount ?? payload.stats?.filesCount;
      if (res.toolId === 'search_workspace' && filesCount !== undefined && (promptLower.includes('how many') || promptLower.includes('count'))) {
        return `There are ${filesCount} files in this workspace.`;
      }

      // 2. Directory Listing Fast-Path
      const dirItems = payload.items ?? result.items;
      if (res.toolId === 'list_dir' && Array.isArray(dirItems)) {
        if (dirItems.length === 0) return 'Directory is empty.';
        return `Project Directory Contents (${dirItems.length} items):\n` + dirItems.map((i: string) => `- ${i}`).join('\n');
      }

      // 3. File Search / List Fast-Path
      const searchResults = payload.results ?? payload.files ?? result.results;
      const isListingPrompt =
        promptLower.startsWith('list') ||
        promptLower.startsWith('find') ||
        promptLower.startsWith('name') ||
        promptLower.startsWith('show') ||
        promptLower.startsWith('get');
      if (res.toolId === 'search_workspace' && Array.isArray(searchResults) && isListingPrompt) {
        if (searchResults.length === 0) return 'No matching files found.';
        const files = searchResults.map((r: any) => typeof r === 'string' ? r : r.filePath || r.file).filter(Boolean);
        return `Matching files (${files.length}):\n` + files.slice(0, 100).map((f: string) => `- ${f}`).join('\n');
      }
    }

    return null;
  }

  /**
   * Sprint 87: CODE_EXPLAIN grounding pipeline.
   *
   * Uses SemanticContextRetriever (evidence discovery) and optionally
   * EngineeringIntelligenceEngine (evidence enrichment).
   *
   * Evidence policy (quality-based, not a magic threshold):
   *   sufficient = hasCandidates && (hasRelevantSource || hasSymbolMatch || isRepositoryRelevant)
   *
   * Returns sufficient=false when grounding would fail \u2014 LLM is NOT invoked.
   * Evidence flexibility: accepts repository-relevant evidence even when no
   * symbol name directly matches the concept (e.g. auth.ts for "authentication").
   */
  private async _tryCodeExplainGrounding(
    prompt: string,
    concept: string | undefined,
    activeFilePath?: string | null
  ): Promise<{ sufficient: boolean; evidenceCount: number; groundedContext?: GroundedContext }> {
    if (!this.semanticRetriever) {
      return { sufficient: false, evidenceCount: 0 };
    }

    const query = concept || prompt;

    let candidates: any[] = [];
    try {
      const result = await (this.semanticRetriever as any).retrieve({
        query,
        activeFilePath: activeFilePath ?? undefined,
        maxTokens: 4096,
      });
      candidates = result?.candidates ?? result?.chunks ?? (Array.isArray(result) ? result : []);
    } catch (err: any) {
      this.logger.warn(`[AiOrchestrator] SemanticContextRetriever failed for CODE_EXPLAIN: ${err?.message}`);
      return { sufficient: false, evidenceCount: 0 };
    }

    // Optionally enrich via EngineeringIntelligenceEngine (best-effort)
    if (this.engineeringIntel && candidates.length > 0) {
      try {
        const analysis = await (this.engineeringIntel as any).analyzeRepository?.({ concept, query });
        if (Array.isArray(analysis?.additionalContext)) {
          candidates = [...candidates, ...analysis.additionalContext];
        }
      } catch {
        // enrichment is best-effort \u2014 never block if it fails
      }
    }

    const evidenceCount = candidates.length;
    if (evidenceCount === 0) {
      return { sufficient: false, evidenceCount: 0 };
    }

    const root = this.workspaceService.getRootPath() ?? '';

    // Evidence policy \u2014 quality-based, accepts multiple evidence types
    // Evidence flexibility: accepts repository-relevant evidence even without
    // direct symbol-name match (e.g. auth.ts is relevant for "authentication")
    const hasRelevantSource = candidates.some((c: any) => {
      const filePath: string = c.filePath ?? c.file ?? c.path ?? '';
      const lc = filePath.toLowerCase();
      return filePath && !lc.includes('.test.') && !lc.includes('.spec.')
        && !lc.endsWith('.d.ts') && !lc.endsWith('.json') && !lc.endsWith('.yaml');
    });

    const hasSymbolMatch = candidates.some((c: any) => {
      const symbolName: string = c.symbol ?? c.name ?? c.identifier ?? '';
      return symbolName.length >= 3 && query.toLowerCase().includes(symbolName.toLowerCase().slice(0, 5));
    });

    const isRepositoryRelevant = candidates.some((c: any) => {
      const filePath: string = c.filePath ?? c.file ?? c.path ?? '';
      return filePath && (filePath.startsWith(root) || !path.isAbsolute(filePath));
    });

    const sufficient = hasRelevantSource || hasSymbolMatch || isRepositoryRelevant;

    if (!sufficient) {
      return { sufficient: false, evidenceCount };
    }

    // Build grounded context from candidates for PromptComposer
    const knowledgeFacts: FileContentFact[] = candidates.slice(0, 20).map((c: any) => ({
      kind: 'file_content' as const,
      path: c.filePath ?? c.file ?? c.path ?? '',
      content: c.content ?? c.text ?? c.snippet ?? '',
    }));

    const groundedContext: GroundedContext = {
      executionResults: [],
      repositoryFacts: knowledgeFacts,
      terminalFacts: [],
      knowledgeFacts,
    };

    return { sufficient: true, evidenceCount, groundedContext };
  }

  /**
   * Direct Deterministic Workspace File Query Handler.
   * Intercepts natural-language file operations (open, count, find, list, ordinals)
   * and executes them deterministically via repository/workspace intelligence without LLM (<100ms).
   */
  private async _tryDirectDeterministicFileQuery(
    originalPrompt: string,
    resolvedPrompt: string,
    session: any,
    resolvedContext?: any
  ): Promise<string | null> {
    const root = this.workspaceService.getRootPath() || process.cwd();
    const promptLower = originalPrompt.toLowerCase().trim();

    // 0a. Handle Deterministic Workspace Folder Query (e.g., "find all folders in forge-desktop")
    const folderNorm = FolderQueryNormalizer.normalize(originalPrompt);
    if (folderNorm.isFolderQuery) {
      const folders = await this._getWorkspaceFolders(root, folderNorm.inDirectory, folderNorm.folderName);

      if (folderNorm.intent === 'count') {
        const targetLabel = folderNorm.folderName
          ? `named "${folderNorm.folderName}"`
          : folderNorm.inDirectory
          ? `in ${folderNorm.inDirectory}`
          : 'in this workspace';
        return `There are ${folders.length} folder(s) ${targetLabel}.`;
      }

      if (folders.length === 0) {
        const targetLabel = folderNorm.folderName
          ? `named "${folderNorm.folderName}"`
          : folderNorm.inDirectory
          ? `in "${folderNorm.inDirectory}"`
          : 'in workspace';
        return `No matching folders found ${targetLabel}.`;
      }

      const targetLabel = folderNorm.folderName
        ? `named "${folderNorm.folderName}"`
        : folderNorm.inDirectory
        ? `in ${folderNorm.inDirectory}`
        : 'in workspace';

      return `Found ${folders.length} folder(s) ${targetLabel}:\n` +
        folders.slice(0, 50).map((f, i) => `${i + 1}. ${f}`).join('\n');
    }

    // 0b. Handle Ordinal / Pronoun Document Resolution (e.g., "open the third one")
    if (resolvedContext?.resolution?.type === 'document' && resolvedContext.resolution.path) {
      const targetPath = resolvedContext.resolution.path;
      let fullPath = path.isAbsolute(targetPath) ? targetPath : path.join(root, targetPath);
      const relPath = path.isAbsolute(targetPath) ? path.relative(root, targetPath) : targetPath;

      if (!fs.existsSync(fullPath) && !path.isAbsolute(targetPath)) {
        const cwdPath = path.join(process.cwd(), targetPath);
        const parentPath = path.join(root, '..', targetPath);
        if (fs.existsSync(cwdPath)) {
          fullPath = cwdPath;
        } else if (fs.existsSync(parentPath)) {
          fullPath = parentPath;
        }
      }

      const isKnownCandidate = session?.getState?.()?.candidateResults?.includes(targetPath);
      if (!fs.existsSync(fullPath) && !isKnownCandidate) {
        return `Failed to open file: File "${relPath}" does not exist.`;
      }

      try {
        const stat = fs.statSync(fullPath);
        if (stat.isDirectory()) {
          return `Failed to open file: Path "${relPath}" is a directory.`;
        }
      } catch (err: any) {
        return `Failed to open file "${relPath}": ${err?.message || String(err)}`;
      }

      // Emit open command
      try {
        const eventBus = (this.workspaceService as any).eventBus;
        eventBus?.emit('ai:execute-command', {
          commandId: 'forge.workspace.openFile',
          args: [fullPath],
        });
      } catch {
        // Event bus best effort
      }

      if (session.updateState) {
        session.updateState({ activeDocument: { filePath: relPath } });
      }

      return `Opened ${relPath}.`;
    }

    const norm = FileQueryNormalizer.normalize(originalPrompt);

    // If it's not a recognized file query or stats prompt, return null to proceed normally
    const isOrdinalOrRelative = /\b(first|second|third|fourth|fifth|sixth|seventh|eighth|ninth|tenth|1st|2nd|3rd|4th|5th|6th|7th|8th|9th|10th|last)\b/i.test(promptLower);
    const isFileQuery = norm.basename || norm.relativePath || norm.language || norm.isAllFiles || isOrdinalOrRelative;
    if (!isFileQuery) {
      return null;
    }

    // 1. All workspace files count query
    if (norm.isAllFiles && norm.intent === 'count') {
      const statsRes = await this.repo.query({ type: 'workspaceStatistics' });
      let filesCount = statsRes.success && statsRes.data ? statsRes.data.filesCount : 0;
      const filesRes = await this.repo.query({ type: 'findFile', query: '' });
      const allFiles = filesRes.success && Array.isArray(filesRes.data)
        ? filesRes.data.map((f: string) => path.isAbsolute(f) ? path.relative(root, f) : f)
        : [];
      if (!filesCount) {
        filesCount = allFiles.length;
      }

      if (session.updateState && allFiles.length > 0) {
        session.updateState({
          lastSearchResult: { results: allFiles.map((f) => ({ filePath: f })) },
          candidateResults: allFiles,
        });
      }

      if (session.entities) {
        session.entities.set('WORKSPACE_STATS', {
          kind: 'WORKSPACE_STATS',
          value: { filesCount },
          turnId: '',
        });
        if (allFiles.length > 0) {
          session.entities.set('SEARCH_RESULTS', {
            kind: 'SEARCH_RESULTS',
            value: allFiles,
            turnId: '',
          });
        }
      }

      if (session.execution) {
        session.execution.emitEvent({
          id: generateExecutionEventId(),
          sessionId: session.sessionId,
          turnId: '',
          taskId: 'task_fast_path',
          toolId: 'search_workspace',
          type: 'tool_completed' as any,
          timestamp: new Date().toISOString(),
          durationMs: 0,
          success: true,
          payload: { filesCount, files: allFiles },
        });
      }

      return `There are ${filesCount} files in this workspace.`;
    }

    // 2. Query workspace files for filename, path, or language
    let candidateFiles: string[] = [];
    if (norm.language) {
      const langRes = await this.repo.query({ type: 'findFilesByLanguage', language: norm.language });
      if (langRes.success && Array.isArray(langRes.data)) {
        candidateFiles = langRes.data.map((f: string) => path.isAbsolute(f) ? path.relative(root, f) : f);
      }
    } else {
      const searchTerm = norm.basename || norm.relativePath || '';
      const res = await this.repo.query({ type: 'findFile', query: searchTerm });
      if (res.success && Array.isArray(res.data)) {
        const all = res.data.map((f: string) => path.isAbsolute(f) ? path.relative(root, f) : f);
        if (norm.relativePath) {
          candidateFiles = all.filter((f) => f === norm.relativePath || f.endsWith(norm.relativePath!));
        } else if (norm.basename) {
          const targetBase = norm.basename.toLowerCase();
          candidateFiles = all.filter((f) => path.basename(f).toLowerCase() === targetBase || f.toLowerCase() === targetBase);
        } else {
          candidateFiles = all;
        }
      }
    }

    // If candidate list is empty, search all workspace files with fallback filter or previous turn candidates
    if (candidateFiles.length === 0 && session.getState?.()?.candidateResults?.length > 0) {
      candidateFiles = session.getState().candidateResults;
    }

    if (candidateFiles.length === 0 && (norm.basename || norm.relativePath)) {
      const allRes = await this.repo.query({ type: 'findFile', query: '' });
      if (allRes.success && Array.isArray(allRes.data)) {
        const all = allRes.data.map((f: string) => path.isAbsolute(f) ? path.relative(root, f) : f);
        const targetStr = (norm.basename || norm.relativePath || '').toLowerCase();
        candidateFiles = all.filter((f) => path.basename(f).toLowerCase() === targetStr || f.toLowerCase() === targetStr || f.toLowerCase().endsWith(targetStr));
      }
    }

    // Always preserve candidate files in session state & selectionContext for follow-up ordinals
    if (candidateFiles.length > 0) {
      if (session.updateState) {
        session.updateState({
          lastSearchResult: { results: candidateFiles.map((f) => ({ filePath: f })) },
          candidateResults: candidateFiles,
        });
      }
      if (session.setSelectionContext) {
        session.setSelectionContext({
          activeCollection: 'search_results',
          items: candidateFiles,
          selectedIndex: 0,
          selectedItem: candidateFiles[0],
        });
      }
      if (session.entities) {
        session.entities.set('SEARCH_RESULTS', {
          kind: 'SEARCH_RESULTS',
          value: candidateFiles,
          turnId: '',
        });
      }
    }

    // Process Intent
    if (norm.intent === 'count') {
      const targetLabel = norm.basename || norm.language || 'matching';
      if (candidateFiles.length === 0) {
        return `Found 0 ${targetLabel} files in this workspace.`;
      }
      return `There are ${candidateFiles.length} ${targetLabel} files in this workspace:\n` +
        candidateFiles.map((f, i) => `${i + 1}. ${f}`).join('\n');
    }

    if (norm.intent === 'find' || norm.intent === 'list') {
      const targetLabel = norm.basename || norm.language || 'workspace';
      if (candidateFiles.length === 0) {
        return `No matching files found for "${targetLabel}".`;
      }
      return `Found ${candidateFiles.length} matching file(s) for "${targetLabel}":\n` +
        candidateFiles.slice(0, 50).map((f, i) => `${i + 1}. ${f}`).join('\n');
    }

    if (norm.intent === 'open') {
      if (candidateFiles.length === 0) {
        const requestedPath = norm.relativePath || norm.basename || originalPrompt;
        return `Failed to open file: File "${requestedPath}" does not exist.`;
      }

      // Ambiguous files — NEVER GUESS! Return list of candidates
      if (candidateFiles.length > 1) {
        return `Multiple matching files found for "${norm.basename || norm.relativePath}" (${candidateFiles.length} candidates):\n` +
          candidateFiles.map((f, i) => `${i + 1}. ${f}`).join('\n') +
          `\n\nPlease specify which file you would like to open (e.g., 'open the 3rd one').`;
      }

      // Exactly 1 match — open directly after path validation
      const targetPath = candidateFiles[0];
      let fullPath = path.isAbsolute(targetPath) ? targetPath : path.join(root, targetPath);

      if (!fs.existsSync(fullPath) && !path.isAbsolute(targetPath)) {
        const cwdPath = path.join(process.cwd(), targetPath);
        const parentPath = path.join(root, '..', targetPath);
        if (fs.existsSync(cwdPath)) {
          fullPath = cwdPath;
        } else if (fs.existsSync(parentPath)) {
          fullPath = parentPath;
        }
      }

      if (!fs.existsSync(fullPath)) {
        return `Failed to open file: File "${targetPath}" does not exist.`;
      }

      try {
        const stat = fs.statSync(fullPath);
        if (stat.isDirectory()) {
          return `Failed to open file: Path "${targetPath}" is a directory.`;
        }
      } catch (err: any) {
        return `Failed to open file "${targetPath}": ${err?.message || String(err)}`;
      }

      // Emit open command
      try {
        const eventBus = (this.workspaceService as any).eventBus;
        eventBus?.emit('ai:execute-command', {
          commandId: 'forge.workspace.openFile',
          args: [fullPath],
        });
      } catch {
        // Event bus best effort
      }

      if (session.updateState) {
        session.updateState({ activeDocument: { filePath: targetPath } });
      }

      return `Opened ${targetPath}.`;
    }

    return null;
  }

  // Legacy entrypoint for execution/verification/reflection test runs compatibility
  async runOrchestration(plan: IPlan, workspaceRoot: string | null): Promise<void> {
    this.logger.info(`[AiOrchestrator] Starting AI legacy orchestration loop for plan: ${plan.id}`);

    this.logger.info('[AiOrchestrator] Running Execution Runtime...');
    await this.executionEngine.executePlan(plan);

    this.logger.info('[AiOrchestrator] Running Verification Runtime...');
    let verificationReport = await this.verificationEngine.verify('standard', workspaceRoot);

    let recoveryReport = null;
    if (!verificationReport.success) {
      this.logger.info('[AiOrchestrator] Verification failed. Initiating Recovery Runtime...');
      recoveryReport = await this.recoveryOrchestrator.recover(verificationReport, workspaceRoot);
      verificationReport = await this.verificationEngine.verify('standard', workspaceRoot);
    }

    this.logger.info('[AiOrchestrator] Running Reflection Runtime...');
    const reflectionReport = await this.reflectionEngine.reflect(
      plan,
      verificationReport,
      recoveryReport,
      workspaceRoot
    );

    this.logger.info('[AiOrchestrator] Running Outcome Runtime...');
    const outcome = await this.outcomeManager.processOutcome(
      plan,
      verificationReport,
      recoveryReport,
      reflectionReport
    );

    this.logger.info('[AiOrchestrator] Running Learning Runtime...');
    await this.learningEngine.learn(outcome);

    this.logger.info(`[AiOrchestrator] AI legacy orchestration loop completed for plan: ${plan.id}`);
  }

  /**
   * Discovers subfolders in the workspace, respecting standard workspace exclusions.
   */
  private async _getWorkspaceFolders(root: string, inDir?: string, folderName?: string): Promise<string[]> {
    const ignoredFolders = new Set([
      'node_modules',
      'dist',
      'build',
      'out',
      '.git',
      '.next',
      '.turbo',
      'coverage',
      '.gemini',
      '.vscode',
      '.idea',
      '.ds_store',
      'tmp',
      'temp',
      'target',
    ]);

    const isFolderIgnored = (dirPath: string): boolean => {
      const parts = dirPath.replace(/\\/g, '/').split('/');
      return parts.some((p) => ignoredFolders.has(p.toLowerCase()));
    };

    const discoveredFolders = new Set<string>();

    // 1. Filesystem scan from root
    const scanDir = (dirPath: string) => {
      try {
        const entries = fs.readdirSync(dirPath, { withFileTypes: true });
        for (const entry of entries) {
          if (entry.isDirectory()) {
            if (ignoredFolders.has(entry.name.toLowerCase())) {
              continue;
            }
            const fullSubDir = path.join(dirPath, entry.name);
            const relFromRoot = path.relative(root, fullSubDir).replace(/\\/g, '/');
            if (relFromRoot && !isFolderIgnored(relFromRoot)) {
              discoveredFolders.add(relFromRoot);
              scanDir(fullSubDir);
            }
          }
        }
      } catch {
        // Best effort
      }
    };

    if (fs.existsSync(root)) {
      scanDir(root);
    }

    // 2. Fallback / Supplement from Repository Index
    try {
      const res = await this.repo.query({ type: 'findFile', query: '' });
      if (res.success && Array.isArray(res.data)) {
        for (const f of res.data) {
          const relFile = path.isAbsolute(f) ? path.relative(root, f) : f;
          const normalized = relFile.replace(/\\/g, '/');
          const parts = normalized.split('/');

          let currentPath = '';
          for (let i = 0; i < parts.length - 1; i++) {
            currentPath = currentPath ? `${currentPath}/${parts[i]}` : parts[i];
            if (currentPath && !isFolderIgnored(currentPath)) {
              discoveredFolders.add(currentPath);
            }
          }
        }
      }
    } catch {
      // Best effort
    }

    let results = Array.from(discoveredFolders);

    // 3. Filter by inDir if specified (e.g. "forge-desktop" or "apps/forge-desktop")
    if (inDir) {
      const targetIn = inDir.toLowerCase().replace(/\\/g, '/');
      results = results.filter((f) => {
        const lower = f.toLowerCase();
        return (
          lower === targetIn ||
          lower.startsWith(`${targetIn}/`) ||
          lower.includes(`/${targetIn}/`) ||
          lower.endsWith(`/${targetIn}`)
        );
      });
    }

    // 4. Filter by folderName if specified (e.g. "components")
    if (folderName) {
      const targetName = folderName.toLowerCase();
      results = results.filter((f) => path.basename(f).toLowerCase() === targetName);
    }

    return results.sort((a, b) => a.localeCompare(b));
  }
}
