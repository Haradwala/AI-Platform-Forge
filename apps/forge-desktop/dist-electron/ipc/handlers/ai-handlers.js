"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerAiHandlers = registerAiHandlers;
const tokens_1 = require("../../main/container/tokens");
function registerAiHandlers(router, container) {
    const kernel = container.resolve(tokens_1.T.IAiKernel);
    const sessionService = container.resolve(tokens_1.T.IAiSessionService);
    const providerRegistry = container.resolve(tokens_1.T.IProviderRegistry);
    const contextEngine = container.resolve(tokens_1.T.IContextEngine);
    const promptNormalizer = container.tryResolve(tokens_1.T.PromptNormalizer) ?? undefined;
    const planner = container.resolve(tokens_1.T.IPlanner);
    const executionEngine = container.resolve(tokens_1.T.IExecutionEngine);
    const eventBus = container.resolve(tokens_1.T.IDesktopEventBus);
    const windowRegistry = container.tryResolve(tokens_1.T.IWindowRegistry) ?? undefined;
    const perf = container.tryResolve(tokens_1.T.IPerformanceMonitor) ?? undefined;
    const broadcast = (channel, data) => {
        try {
            const windows = windowRegistry?.getAll() ?? [];
            for (const entry of windows) {
                if (!entry.window.isDestroyed()) {
                    entry.window.webContents.send(channel, data);
                }
            }
        }
        catch (err) {
            // safe ignore in mock contexts
        }
    };
    eventBus.on('ai:task-started', (data) => broadcast('ai:task-started', data));
    eventBus.on('ai:task-completed', (data) => broadcast('ai:task-completed', data));
    eventBus.on('ai:plan-completed', (data) => broadcast('ai:plan-completed', data));
    router.handle('ai:get-providers', async () => {
        return providerRegistry.getAll().map((p) => ({ id: p.id, name: p.name }));
    });
    router.handle('ai:set-provider', async (ctx) => {
        const providerId = ctx.args[0];
        sessionService.setProvider(providerId);
        const runtimeManager = container.tryResolve(tokens_1.T.IRuntimeManager);
        if (runtimeManager && typeof runtimeManager.activate === 'function') {
            try {
                runtimeManager.activate(providerId);
            }
            catch {
                // Safe ignore if runtimeId is not registered in runtimeManager yet
            }
        }
        return { success: true };
    });
    router.handle('ai:get-models', async () => {
        const s = sessionService.getActiveSession();
        if (!s)
            return [];
        const prov = providerRegistry.getById(s.activeProviderId);
        if (!prov)
            return [];
        return await prov.listAvailableModels();
    });
    router.handle('ai:set-model', async (ctx) => {
        const modelId = ctx.args[0];
        sessionService.setModel(modelId);
        return { success: true };
    });
    router.handle('ai:collect-context', async (ctx) => {
        const editorState = ctx.args[0];
        return await contextEngine.collectContext(editorState);
    });
    router.handle('ai:execute-task', async (ctx) => {
        const params = ctx.args[0];
        const collectedContext = await contextEngine.collectContext(params.editorState);
        const request = promptNormalizer.normalize(params.prompt, collectedContext);
        const response = await kernel.executeTask(request, (token) => {
            ctx.sender.send('ai:token', { token });
        });
        return { response };
    });
    router.handle('ai:cancel-task', async () => {
        kernel.cancelActiveTask();
        return { success: true };
    });
    router.handle('ai:generate-plan', async (ctx) => {
        const startTime = Date.now();
        const params = ctx.args[0];
        const collectedContext = await contextEngine.collectContext(params.context || {});
        const plan = await planner.generatePlan(params.prompt, collectedContext);
        perf?.record('ai:generate-plan', Date.now() - startTime);
        return { plan };
    });
    router.handle('ai:execute-plan', async (ctx) => {
        const startTime = Date.now();
        const params = ctx.args[0];
        await executionEngine.executePlan(params.plan);
        perf?.record('ai:execute-plan', Date.now() - startTime);
        return { success: true };
    });
    router.handle('ai:cancel-execution', async () => {
        executionEngine.cancelActiveTask();
        return { success: true };
    });
    router.handle('ai:get-journal', async () => {
        const journal = executionEngine.getJournal();
        return { journal };
    });
    // Unified AI Pipeline requests
    router.handle('ai:request', async (ctx) => {
        const params = ctx.args[0];
        const orchestrator = container.resolve(tokens_1.T.IAiOrchestrator);
        const result = await orchestrator.executeRequest({
            id: params.id,
            prompt: params.prompt,
            options: params.options
        });
        // Return typed AiRequestResponse — renderer reads result.response
        return {
            success: result.success,
            result: result.result,
            finalContext: result.finalContext,
        };
    });
    // Centralized AI Diagnostics
    router.handle('ai:get-diagnostics', async () => {
        const diag = container.resolve(tokens_1.T.IDiagnosticsService);
        return await diag.getDiagnosticsSnapshot();
    });
    // ─── Phase 23 Runtime Discovery Handlers ───────────────────────────────
    router.handle('runtime:discover', async (ctx) => {
        const forceRefresh = ctx.args?.[0]?.forceRefresh ?? false;
        const discoveryEngine = container.resolve(tokens_1.T.IRuntimeDiscoveryEngine);
        const runtimes = await discoveryEngine.discoverRuntimes(forceRefresh);
        return { success: true, runtimes };
    });
    router.handle('runtime:get-diagnostics', async () => {
        const discoveryEngine = container.resolve(tokens_1.T.IRuntimeDiscoveryEngine);
        const diagnostics = await discoveryEngine.runDiagnostics();
        return { success: true, diagnostics };
    });
    router.handle('runtime:validate', async (ctx) => {
        const execPath = ctx.args[0];
        const discoveryEngine = container.resolve(tokens_1.T.IRuntimeDiscoveryEngine);
        const result = await discoveryEngine.validateRuntimePath(execPath);
        return { success: true, result };
    });
    router.handle('runtime:check-health', async (ctx) => {
        const runtimeId = ctx.args[0];
        const discoveryEngine = container.resolve(tokens_1.T.IRuntimeDiscoveryEngine);
        const result = await discoveryEngine.checkHealth(runtimeId);
        return { success: true, result };
    });
    router.handle('runtime:update-config', async (ctx) => {
        const newConfig = ctx.args[0];
        const discoveryEngine = container.resolve(tokens_1.T.IRuntimeDiscoveryEngine);
        discoveryEngine.updateConfig(newConfig);
        return { success: true };
    });
    // ─── Phase 24 Runtime Execution Hub Handlers ───────────────────────────
    router.handle('runtime:launch-session', async (ctx) => {
        const options = ctx.args[0];
        const execManager = container.resolve(tokens_1.T.IRuntimeExecutionManager);
        const session = await execManager.launchSession(options);
        return { success: true, session };
    });
    router.handle('runtime:stop-session', async (ctx) => {
        const sessionId = ctx.args[0];
        const execManager = container.resolve(tokens_1.T.IRuntimeExecutionManager);
        await execManager.stopSession(sessionId);
        return { success: true };
    });
    router.handle('runtime:restart-session', async (ctx) => {
        const sessionId = ctx.args[0];
        const execManager = container.resolve(tokens_1.T.IRuntimeExecutionManager);
        const session = await execManager.restartSession(sessionId);
        return { success: true, session };
    });
    router.handle('runtime:respond-approval', async (ctx) => {
        const { sessionId, approvalId, decision } = ctx.args[0];
        const execManager = container.resolve(tokens_1.T.IRuntimeExecutionManager);
        await execManager.respondApproval(sessionId, approvalId, decision);
        return { success: true };
    });
    router.handle('runtime:get-active-sessions', async () => {
        const execManager = container.resolve(tokens_1.T.IRuntimeExecutionManager);
        const sessions = await execManager.getAllSessions();
        return { success: true, sessions };
    });
    // ─── Phase 25-28 Routing, Session, Profile, Repository Import, Intelligence Handlers ──
    router.handle('runtime:route-intent', async (ctx) => {
        const { prompt, workspaceRoot } = ctx.args[0];
        const intentAnalyzer = new (require('../../main/ai/routing/intent-analyzer').IntentAnalyzer)();
        const routerService = container.resolve(tokens_1.T.IRuntimeRouter);
        const discoveryEngine = container.resolve(tokens_1.T.IRuntimeDiscoveryEngine);
        const request = intentAnalyzer.analyze(prompt, workspaceRoot || process.cwd());
        const runtimes = discoveryEngine.getAllRuntimes();
        const candidates = runtimes.map((r) => ({
            id: r.id,
            name: r.name,
            type: r.type,
            isAvailable: r.status === 'AVAILABLE',
            capabilities: r.capabilities || { streaming: true, tools: true },
            health: r.health,
            latencyMs: r.latencyMs,
        }));
        const ranked = routerService.rankRuntimes(request, candidates);
        return { success: true, request, ranked };
    });
    router.handle('workspace:save-session', async (ctx) => {
        const sessionData = ctx.args[0];
        const sessionManager = container.resolve(tokens_1.T.IWorkspaceSessionManager);
        await sessionManager.saveSession(sessionData);
        return { success: true };
    });
    router.handle('workspace:restore-session', async (ctx) => {
        const workspaceRoot = ctx.args[0] || process.cwd();
        const sessionManager = container.resolve(tokens_1.T.IWorkspaceSessionManager);
        const session = await sessionManager.restoreSession(workspaceRoot);
        return { success: true, session };
    });
    router.handle('workspace:get-profile', async (ctx) => {
        const workspaceRoot = ctx.args[0] || process.cwd();
        const profileManager = container.resolve(tokens_1.T.IWorkspaceProfileManager);
        const profile = profileManager.getProfile(workspaceRoot);
        return { success: true, profile };
    });
    router.handle('workspace:save-profile', async (ctx) => {
        const { workspaceRoot, profile } = ctx.args[0];
        const profileManager = container.resolve(tokens_1.T.IWorkspaceProfileManager);
        profileManager.saveProfile(workspaceRoot || process.cwd(), profile);
        return { success: true };
    });
    router.handle('repository:import', async (ctx) => {
        const { descriptor, destinationRoot } = ctx.args[0];
        const importer = container.resolve(tokens_1.T.IRepositoryImporter);
        const result = await importer.importRepository(descriptor, destinationRoot);
        return { success: true, result };
    });
    router.handle('workspace:analyze', async (ctx) => {
        const workspaceRoot = ctx.args[0] || process.cwd();
        const intelligenceEngine = new (require('../../main/ai/intelligence/engineering-intelligence-engine').EngineeringIntelligenceEngine)();
        const analysis = await intelligenceEngine.analyzeRepository(workspaceRoot);
        return { success: true, analysis };
    });
    router.handle('action:execute', async (ctx) => {
        const request = ctx.args[0];
        const actionExecutor = container.resolve(tokens_1.T.IActionExecutor);
        const result = await actionExecutor.executeAction(request);
        return { success: true, result };
    });
    router.handle('action:approve', async (ctx) => {
        const { requestId } = ctx.args[0];
        const actionExecutor = container.resolve(tokens_1.T.IActionExecutor);
        const approved = actionExecutor.approvalMiddleware.respondApproval(requestId, true);
        return { success: approved };
    });
    router.handle('action:reject', async (ctx) => {
        const { requestId } = ctx.args[0];
        const actionExecutor = container.resolve(tokens_1.T.IActionExecutor);
        const rejected = actionExecutor.approvalMiddleware.respondApproval(requestId, false);
        return { success: rejected };
    });
    router.handle('action:cancel', async (ctx) => {
        const { requestId } = ctx.args[0];
        const actionExecutor = container.resolve(tokens_1.T.IActionExecutor);
        const cancelled = actionExecutor.approvalMiddleware.respondApproval(requestId, false);
        return { success: cancelled };
    });
    router.handle('action:history', async (ctx) => {
        const workspaceRoot = ctx.args[0] || process.cwd();
        const actionHistory = container.resolve(tokens_1.T.IActionHistory);
        const history = await actionHistory.getHistory(workspaceRoot);
        return { success: true, history };
    });
    router.handle('action:list', async () => {
        const registry = container.resolve(tokens_1.T.IActionRegistry);
        const actions = registry.listActions().map((a) => a.metadata);
        return { success: true, actions };
    });
    // ─── Phase 30 Agent Framework IPC Handlers ─────────────────────────────────────
    router.handle('agent:run-workflow', async (ctx) => {
        const request = ctx.args[0];
        const orchestrator = container.resolve(tokens_1.T.IAgentOrchestrator);
        const result = await orchestrator.runWorkflow(request);
        return { success: true, result };
    });
    router.handle('agent:cancel-task', async (ctx) => {
        const { taskId } = ctx.args[0];
        const orchestrator = container.resolve(tokens_1.T.IAgentOrchestrator);
        orchestrator.scheduler.cancelTask(taskId);
        return { success: true };
    });
    router.handle('agent:get-memory', async (ctx) => {
        const workspaceRoot = ctx.args[0] || process.cwd();
        const memory = container.resolve(tokens_1.T.IAgentMemory);
        const entries = await memory.getAll(workspaceRoot);
        return { success: true, entries };
    });
    router.handle('agent:list', async () => {
        const registry = container.resolve(tokens_1.T.IAgentRegistry);
        const agents = registry.list().map((a) => ({
            role: a.role,
            name: a.name,
            description: a.description,
            capabilities: a.capabilities,
        }));
        return { success: true, agents };
    });
    // Decoupled AgentEventEmitter -> Electron IPC Bridge
    const orchestratorInstance = container.resolve(tokens_1.T.IAgentOrchestrator);
    orchestratorInstance.events.onAgentEvent((evt) => {
        broadcast('agent:event', evt);
    });
    // Decoupled ActionEventEmitter -> Electron IPC Bridge
    const actionExecutorInstance = container.resolve(tokens_1.T.IActionExecutor);
    actionExecutorInstance.events.onActionEvent((evt) => {
        broadcast('action:event', evt);
    });
    // Decoupled RuntimeEventBus -> Electron IPC Bridge
    const runtimeEventBus = container.resolve(tokens_1.T.IRuntimeEventBus);
    runtimeEventBus.onRuntimeEvent((evt) => {
        broadcast('runtime:event', evt);
    });
    // Forward event stream to all windows
    eventBus.on('ai:event', (data) => broadcast('ai:event', data));
}
//# sourceMappingURL=ai-handlers.js.map