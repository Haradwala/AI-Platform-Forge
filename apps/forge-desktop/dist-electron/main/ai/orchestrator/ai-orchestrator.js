"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.AiOrchestrator = void 0;
const pipeline_context_1 = require("../pipeline/pipeline-context");
const pipeline_stage_1 = require("../pipeline/pipeline-stage");
const response_context_builder_1 = require("../response/response-context-builder");
const session_context_manager_1 = require("../session/session-context-manager");
const context_resolution_service_1 = require("../memory/resolution/context-resolution-service");
const execution_event_1 = require("../memory/events/execution-event");
const execution_goal_1 = require("../contracts/execution-goal");
const result_normalizer_1 = require("../pipeline/result-normalizer");
const result_validator_1 = require("../pipeline/result-validator");
const execution_entity_extractor_1 = require("../memory/extraction/execution-entity-extractor");
const query_normalization_engine_1 = require("../response/query-normalization-engine");
const active_file_grounding_1 = require("../response/active-file-grounding");
const file_query_normalizer_1 = require("../response/file-query-normalizer");
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
class AiOrchestrator {
    contextEngine;
    memoryRegistry;
    repo;
    intentDetector;
    goalExtractor;
    corePlanner;
    strategyPlanner;
    taskPlanner;
    reasoningEngine;
    executionEngine;
    verificationEngine;
    recoveryOrchestrator;
    reflectionEngine;
    outcomeManager;
    learningEngine;
    pipelineExecutor;
    pipelineRecorder;
    workspaceService;
    logger;
    responseGenerationEngine;
    sessionManager;
    resolutionService;
    executionRouter;
    semanticRetriever;
    engineeringIntel;
    stages;
    responseContextBuilder;
    activeFileGrounding;
    normalizer = new result_normalizer_1.ResultNormalizer();
    validator = new result_validator_1.ResultValidator();
    entityExtractor = new execution_entity_extractor_1.ExecutionEntityExtractor();
    constructor(contextEngine, memoryRegistry, repo, intentDetector, goalExtractor, corePlanner, strategyPlanner, taskPlanner, reasoningEngine, executionEngine, verificationEngine, recoveryOrchestrator, reflectionEngine, outcomeManager, learningEngine, pipelineExecutor, pipelineRecorder, workspaceService, logger, responseGenerationEngine, sessionManager = new session_context_manager_1.SessionContextManager(), resolutionService = new context_resolution_service_1.ContextResolutionService(), executionRouter, 
    // Sprint 87: injected through DI — NOT created inside this class
    semanticRetriever, engineeringIntel) {
        this.contextEngine = contextEngine;
        this.memoryRegistry = memoryRegistry;
        this.repo = repo;
        this.intentDetector = intentDetector;
        this.goalExtractor = goalExtractor;
        this.corePlanner = corePlanner;
        this.strategyPlanner = strategyPlanner;
        this.taskPlanner = taskPlanner;
        this.reasoningEngine = reasoningEngine;
        this.executionEngine = executionEngine;
        this.verificationEngine = verificationEngine;
        this.recoveryOrchestrator = recoveryOrchestrator;
        this.reflectionEngine = reflectionEngine;
        this.outcomeManager = outcomeManager;
        this.learningEngine = learningEngine;
        this.pipelineExecutor = pipelineExecutor;
        this.pipelineRecorder = pipelineRecorder;
        this.workspaceService = workspaceService;
        this.logger = logger;
        this.responseGenerationEngine = responseGenerationEngine;
        this.sessionManager = sessionManager;
        this.resolutionService = resolutionService;
        this.executionRouter = executionRouter;
        this.semanticRetriever = semanticRetriever;
        this.engineeringIntel = engineeringIntel;
        this.responseContextBuilder = new response_context_builder_1.ResponseContextBuilder();
        this.activeFileGrounding = new active_file_grounding_1.ActiveFileGroundingService(this.workspaceService, this.logger);
        this.stages = [
            new pipeline_stage_1.ContextCollectionStage(this.contextEngine),
            new pipeline_stage_1.MemoryRetrievalStage(this.memoryRegistry),
            new pipeline_stage_1.RepositoryScanStage(this.repo),
            new pipeline_stage_1.IntentDetectionStage(this.intentDetector),
            new pipeline_stage_1.GoalExtractionStage(this.goalExtractor),
            new pipeline_stage_1.PlanningStage(this.corePlanner, this.strategyPlanner, this.taskPlanner),
            new pipeline_stage_1.ReasoningStage(this.reasoningEngine),
            new pipeline_stage_1.ExecutionStage(this.executionEngine),
            new pipeline_stage_1.VerificationStage(this.verificationEngine),
            new pipeline_stage_1.RecoveryStage(this.recoveryOrchestrator),
            new pipeline_stage_1.ReflectionStage(this.reflectionEngine),
            new pipeline_stage_1.OutcomeStage(this.outcomeManager),
            new pipeline_stage_1.LearningStage(this.learningEngine),
        ];
    }
    async executeRequest(req) {
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
            resolvedBindings: resolvedContext.entityBindings,
        });
        // ─── Canonical TRACE log (Sprint 87) ────────────────────────────────────────
        const normalized = query_normalization_engine_1.QueryNormalizationEngine.normalize(targetPrompt);
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
                finalContext: pipeline_context_1.PipelineContextHelper.create(req.id, targetPrompt, workspaceRoot),
            };
        }
        // ─── CODE_EXPLAIN: Route to engineering intelligence before pipeline (Sprint 87) ──────
        if (query_normalization_engine_1.QueryNormalizationEngine.isCodeExplain(normalized) && this.semanticRetriever) {
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
                    finalContext: pipeline_context_1.PipelineContextHelper.create(req.id, targetPrompt, workspaceRoot),
                };
            }
            // Evidence sufficient — route to LLM with grounded context
            const explainContext = pipeline_context_1.PipelineContextHelper.create(req.id, targetPrompt, workspaceRoot);
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
        let routerResponse = null;
        const classifiedIntent = this.corePlanner.classifyIntent(targetPrompt);
        const classifiedGoal = classifiedIntent.goal || execution_goal_1.ExecutionGoal.UNKNOWN;
        if (this.executionRouter) {
            const routerResult = await this.executionRouter.resolveGoal(classifiedGoal, session);
            if (routerResult && routerResult.formattedResponse) {
                routerResponse = routerResult.formattedResponse;
                memoryHit = routerResult.source === 'memory';
                this.logger.info(`[AiOrchestrator] ExecutionRouter resolved goal "${classifiedGoal}" via source "${routerResult.source}" in ${Date.now() - routerStart}ms`);
            }
        }
        let finalContext;
        let pipelineMs = 0;
        if (routerResponse) {
            finalContext = pipeline_context_1.PipelineContextHelper.create(req.id, targetPrompt, workspaceRoot);
        }
        else {
            const pipelineStart = Date.now();
            const initialContext = pipeline_context_1.PipelineContextHelper.create(req.id, targetPrompt, workspaceRoot);
            const structuredState = session.getState();
            initialContext.session = session;
            initialContext.entities = session.entities;
            initialContext.conversationHistory = session.conversation.getMessages();
            initialContext.state = structuredState;
            initialContext.resolution = resolvedContext.resolution;
            initialContext.contextCollected = {
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
                        id: (0, execution_event_1.generateExecutionEventId)(),
                        sessionId: session.sessionId,
                        turnId: req.id,
                        taskId: res.taskId,
                        toolId: res.toolId,
                        type: (res.status === 'completed' ? 'tool_completed' : 'tool_failed'),
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
        let response;
        let fallbackUsed = false;
        // Check Router Response, then Deterministic Fast-Path
        const fastPathResponse = routerResponse || this._tryDeterministicFastPath(req.prompt, targetPrompt, finalContext);
        if (fastPathResponse) {
            response = fastPathResponse;
            fallbackUsed = false;
            this.logger.info(`[TRACE] ${JSON.stringify({ route: 'fast-path', groundingStatus: 'NOT_APPLICABLE', llmInvoked: false, responseRuntime: 'deterministic' })}`);
            this.logger.info(`[AiOrchestrator] Deterministic Fast-Path executed in ${Date.now() - responseGenStart}ms`);
        }
        else {
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
        this.logger.info(`[AiOrchestrator] Request complete in ${totalMs}ms (ContextRes: ${contextResolutionMs}ms, Pipeline: ${pipelineMs}ms, ResponseGen: ${responseGenerationMs}ms, FastPath: ${!!fastPathResponse})`);
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
    _tryDeterministicFastPath(originalPrompt, resolvedPrompt, context) {
        if (!context.executionResults || context.executionResults.length === 0) {
            return null;
        }
        const promptLower = originalPrompt.toLowerCase().trim();
        for (const res of context.executionResults) {
            if (res.status !== 'completed' || !res.result)
                continue;
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
                if (dirItems.length === 0)
                    return 'Directory is empty.';
                return `Project Directory Contents (${dirItems.length} items):\n` + dirItems.map((i) => `- ${i}`).join('\n');
            }
            // 3. File Search / List Fast-Path
            const searchResults = payload.results ?? payload.files ?? result.results;
            const isListingPrompt = promptLower.startsWith('list') ||
                promptLower.startsWith('find') ||
                promptLower.startsWith('name') ||
                promptLower.startsWith('show') ||
                promptLower.startsWith('get');
            if (res.toolId === 'search_workspace' && Array.isArray(searchResults) && isListingPrompt) {
                if (searchResults.length === 0)
                    return 'No matching files found.';
                const files = searchResults.map((r) => typeof r === 'string' ? r : r.filePath || r.file).filter(Boolean);
                return `Matching files (${files.length}):\n` + files.slice(0, 100).map((f) => `- ${f}`).join('\n');
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
    async _tryCodeExplainGrounding(prompt, concept, activeFilePath) {
        if (!this.semanticRetriever) {
            return { sufficient: false, evidenceCount: 0 };
        }
        const query = concept || prompt;
        let candidates = [];
        try {
            const result = await this.semanticRetriever.retrieve({
                query,
                activeFilePath: activeFilePath ?? undefined,
                maxTokens: 4096,
            });
            candidates = result?.candidates ?? result?.chunks ?? (Array.isArray(result) ? result : []);
        }
        catch (err) {
            this.logger.warn(`[AiOrchestrator] SemanticContextRetriever failed for CODE_EXPLAIN: ${err?.message}`);
            return { sufficient: false, evidenceCount: 0 };
        }
        // Optionally enrich via EngineeringIntelligenceEngine (best-effort)
        if (this.engineeringIntel && candidates.length > 0) {
            try {
                const analysis = await this.engineeringIntel.analyzeRepository?.({ concept, query });
                if (Array.isArray(analysis?.additionalContext)) {
                    candidates = [...candidates, ...analysis.additionalContext];
                }
            }
            catch {
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
        const hasRelevantSource = candidates.some((c) => {
            const filePath = c.filePath ?? c.file ?? c.path ?? '';
            const lc = filePath.toLowerCase();
            return filePath && !lc.includes('.test.') && !lc.includes('.spec.')
                && !lc.endsWith('.d.ts') && !lc.endsWith('.json') && !lc.endsWith('.yaml');
        });
        const hasSymbolMatch = candidates.some((c) => {
            const symbolName = c.symbol ?? c.name ?? c.identifier ?? '';
            return symbolName.length >= 3 && query.toLowerCase().includes(symbolName.toLowerCase().slice(0, 5));
        });
        const isRepositoryRelevant = candidates.some((c) => {
            const filePath = c.filePath ?? c.file ?? c.path ?? '';
            return filePath && (filePath.startsWith(root) || !path.isAbsolute(filePath));
        });
        const sufficient = hasRelevantSource || hasSymbolMatch || isRepositoryRelevant;
        if (!sufficient) {
            return { sufficient: false, evidenceCount };
        }
        // Build grounded context from candidates for PromptComposer
        const knowledgeFacts = candidates.slice(0, 20).map((c) => ({
            kind: 'file_content',
            path: c.filePath ?? c.file ?? c.path ?? '',
            content: c.content ?? c.text ?? c.snippet ?? '',
        }));
        const groundedContext = {
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
    async _tryDirectDeterministicFileQuery(originalPrompt, resolvedPrompt, session, resolvedContext) {
        const root = this.workspaceService.getRootPath() || process.cwd();
        const promptLower = originalPrompt.toLowerCase().trim();
        // 0a. Handle Deterministic Workspace Folder Query (e.g., "find all folders in forge-desktop")
        const folderNorm = file_query_normalizer_1.FolderQueryNormalizer.normalize(originalPrompt);
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
                }
                else if (fs.existsSync(parentPath)) {
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
            }
            catch (err) {
                return `Failed to open file "${relPath}": ${err?.message || String(err)}`;
            }
            // Emit open command
            try {
                const eventBus = this.workspaceService.eventBus;
                eventBus?.emit('ai:execute-command', {
                    commandId: 'forge.workspace.openFile',
                    args: [fullPath],
                });
            }
            catch {
                // Event bus best effort
            }
            if (session.updateState) {
                session.updateState({ activeDocument: { filePath: relPath } });
            }
            return `Opened ${relPath}.`;
        }
        const norm = file_query_normalizer_1.FileQueryNormalizer.normalize(originalPrompt);
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
                ? filesRes.data.map((f) => path.isAbsolute(f) ? path.relative(root, f) : f)
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
                    id: (0, execution_event_1.generateExecutionEventId)(),
                    sessionId: session.sessionId,
                    turnId: '',
                    taskId: 'task_fast_path',
                    toolId: 'search_workspace',
                    type: 'tool_completed',
                    timestamp: new Date().toISOString(),
                    durationMs: 0,
                    success: true,
                    payload: { filesCount, files: allFiles },
                });
            }
            return `There are ${filesCount} files in this workspace.`;
        }
        // 2. Query workspace files for filename, path, or language
        let candidateFiles = [];
        if (norm.language) {
            const langRes = await this.repo.query({ type: 'findFilesByLanguage', language: norm.language });
            if (langRes.success && Array.isArray(langRes.data)) {
                candidateFiles = langRes.data.map((f) => path.isAbsolute(f) ? path.relative(root, f) : f);
            }
        }
        else {
            const searchTerm = norm.basename || norm.relativePath || '';
            const res = await this.repo.query({ type: 'findFile', query: searchTerm });
            if (res.success && Array.isArray(res.data)) {
                const all = res.data.map((f) => path.isAbsolute(f) ? path.relative(root, f) : f);
                if (norm.relativePath) {
                    candidateFiles = all.filter((f) => f === norm.relativePath || f.endsWith(norm.relativePath));
                }
                else if (norm.basename) {
                    const targetBase = norm.basename.toLowerCase();
                    candidateFiles = all.filter((f) => path.basename(f).toLowerCase() === targetBase || f.toLowerCase() === targetBase);
                }
                else {
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
                const all = allRes.data.map((f) => path.isAbsolute(f) ? path.relative(root, f) : f);
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
                }
                else if (fs.existsSync(parentPath)) {
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
            }
            catch (err) {
                return `Failed to open file "${targetPath}": ${err?.message || String(err)}`;
            }
            // Emit open command
            try {
                const eventBus = this.workspaceService.eventBus;
                eventBus?.emit('ai:execute-command', {
                    commandId: 'forge.workspace.openFile',
                    args: [fullPath],
                });
            }
            catch {
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
    async runOrchestration(plan, workspaceRoot) {
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
        const reflectionReport = await this.reflectionEngine.reflect(plan, verificationReport, recoveryReport, workspaceRoot);
        this.logger.info('[AiOrchestrator] Running Outcome Runtime...');
        const outcome = await this.outcomeManager.processOutcome(plan, verificationReport, recoveryReport, reflectionReport);
        this.logger.info('[AiOrchestrator] Running Learning Runtime...');
        await this.learningEngine.learn(outcome);
        this.logger.info(`[AiOrchestrator] AI legacy orchestration loop completed for plan: ${plan.id}`);
    }
    /**
     * Discovers subfolders in the workspace, respecting standard workspace exclusions.
     */
    async _getWorkspaceFolders(root, inDir, folderName) {
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
        const isFolderIgnored = (dirPath) => {
            const parts = dirPath.replace(/\\/g, '/').split('/');
            return parts.some((p) => ignoredFolders.has(p.toLowerCase()));
        };
        const discoveredFolders = new Set();
        // 1. Filesystem scan from root
        const scanDir = (dirPath) => {
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
            }
            catch {
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
        }
        catch {
            // Best effort
        }
        let results = Array.from(discoveredFolders);
        // 3. Filter by inDir if specified (e.g. "forge-desktop" or "apps/forge-desktop")
        if (inDir) {
            const targetIn = inDir.toLowerCase().replace(/\\/g, '/');
            results = results.filter((f) => {
                const lower = f.toLowerCase();
                return (lower === targetIn ||
                    lower.startsWith(`${targetIn}/`) ||
                    lower.includes(`/${targetIn}/`) ||
                    lower.endsWith(`/${targetIn}`));
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
exports.AiOrchestrator = AiOrchestrator;
//# sourceMappingURL=ai-orchestrator.js.map