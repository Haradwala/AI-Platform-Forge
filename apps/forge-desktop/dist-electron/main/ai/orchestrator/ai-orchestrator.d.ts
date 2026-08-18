import { PipelineExecutor } from '../pipeline/pipeline-executor';
import { PipelineRecorder } from '../pipeline/pipeline-recorder';
import type { IContextEngine, IRepositoryProvider, IPlanner, IExecutionEngine, IWorkspaceService, IDesktopLogger, IPlan } from '../../container/service-interfaces';
import { MemoryRegistry } from '../memory/memory-registry';
import { IntentDetector } from '../planner/intent-detector';
import { GoalExtractor } from '../planner/goal-extractor';
import { GoalTaskPlanner } from '../planner/task-planner';
import { ExecutionPlanner } from '../planner/execution-planner';
import { ReasoningEngine } from '../reasoning/reasoning-engine';
import { VerificationEngine } from '../verification/verification-engine';
import { RecoveryOrchestrator } from '../recovery/recovery-orchestrator';
import { ReflectionEngine } from '../reflection/reflection-engine';
import { OutcomeManager } from '../outcome/outcome-manager';
import { LearningEngine } from '../learning/learning-engine';
import { ResponseGenerationEngine } from '../response/response-generation-engine';
import type { AiExecutionResult } from '../response/response-types';
import { SessionContextManager } from '../session/session-context-manager';
import { ContextResolutionService } from '../memory/resolution/context-resolution-service';
import { ExecutionRouter } from '../execution/execution-router';
import { SemanticContextRetriever } from '../context/semantic-retriever';
import { EngineeringIntelligenceEngine } from '../intelligence/engineering-intelligence-engine';
export interface IAiRequest {
    readonly id: string;
    readonly prompt: string;
    readonly options?: Record<string, any>;
}
export declare class AiOrchestrator {
    private readonly contextEngine;
    private readonly memoryRegistry;
    private readonly repo;
    private readonly intentDetector;
    private readonly goalExtractor;
    private readonly corePlanner;
    private readonly strategyPlanner;
    private readonly taskPlanner;
    private readonly reasoningEngine;
    private readonly executionEngine;
    private readonly verificationEngine;
    private readonly recoveryOrchestrator;
    private readonly reflectionEngine;
    private readonly outcomeManager;
    private readonly learningEngine;
    private readonly pipelineExecutor;
    private readonly pipelineRecorder;
    private readonly workspaceService;
    private readonly logger;
    private readonly responseGenerationEngine;
    private readonly sessionManager;
    private readonly resolutionService;
    private readonly executionRouter?;
    private readonly semanticRetriever?;
    private readonly engineeringIntel?;
    private readonly stages;
    private readonly responseContextBuilder;
    private readonly activeFileGrounding;
    private readonly normalizer;
    private readonly validator;
    private readonly entityExtractor;
    constructor(contextEngine: IContextEngine, memoryRegistry: MemoryRegistry, repo: IRepositoryProvider, intentDetector: IntentDetector, goalExtractor: GoalExtractor, corePlanner: GoalTaskPlanner, strategyPlanner: ExecutionPlanner, taskPlanner: IPlanner, reasoningEngine: ReasoningEngine, executionEngine: IExecutionEngine, verificationEngine: VerificationEngine, recoveryOrchestrator: RecoveryOrchestrator, reflectionEngine: ReflectionEngine, outcomeManager: OutcomeManager, learningEngine: LearningEngine, pipelineExecutor: PipelineExecutor, pipelineRecorder: PipelineRecorder, workspaceService: IWorkspaceService, logger: IDesktopLogger, responseGenerationEngine: ResponseGenerationEngine, sessionManager?: SessionContextManager, resolutionService?: ContextResolutionService, executionRouter?: ExecutionRouter | undefined, semanticRetriever?: SemanticContextRetriever | undefined, engineeringIntel?: EngineeringIntelligenceEngine | undefined);
    executeRequest(req: IAiRequest): Promise<AiExecutionResult>;
    /**
     * Broadened Deterministic Fast-Path.
     * Returns an instant grounded text response for structured, complete tool outputs
     * (file counts, directory listings, workspace statistics) without LLM inference (<500ms).
     */
    private _tryDeterministicFastPath;
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
    private _tryCodeExplainGrounding;
    /**
     * Direct Deterministic Workspace File Query Handler.
     * Intercepts natural-language file operations (open, count, find, list, ordinals)
     * and executes them deterministically via repository/workspace intelligence without LLM (<100ms).
     */
    private _tryDirectDeterministicFileQuery;
    runOrchestration(plan: IPlan, workspaceRoot: string | null): Promise<void>;
    /**
     * Discovers subfolders in the workspace, respecting standard workspace exclusions.
     */
    private _getWorkspaceFolders;
}
