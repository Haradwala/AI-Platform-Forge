import type { IIpcContext } from '../interfaces';
import type { IAiKernel, IAiSessionService, IProviderRegistry, IContextEngine, PromptNormalizer, IIpcRouter, IAiProvider, IPlanner, IExecutionEngine, IPlan, IDesktopEventBus, IPerformanceMonitor } from '../../main/container/service-interfaces';
import type { IWindowRegistry } from '../../main/window-registry';
import type { IServiceResolver } from '../../main/container/interfaces';
import { T } from '../../main/container/tokens';
import { AiOrchestrator } from '../../main/ai/orchestrator/ai-orchestrator';
import { DiagnosticsService } from '../../main/ai/diagnostics/diagnostics-service';

export function registerAiHandlers(router: IIpcRouter, container: IServiceResolver): void {
  const kernel = container.resolve<IAiKernel>(T.IAiKernel);
  const sessionService = container.resolve<IAiSessionService>(T.IAiSessionService);
  const providerRegistry = container.resolve<IProviderRegistry>(T.IProviderRegistry);
  const contextEngine = container.resolve<IContextEngine>(T.IContextEngine);
  const promptNormalizer = container.tryResolve<any>((T as any).PromptNormalizer) ?? undefined;
  const planner = container.resolve<IPlanner>(T.IPlanner);
  const executionEngine = container.resolve<IExecutionEngine>(T.IExecutionEngine);
  const eventBus = container.resolve<IDesktopEventBus>(T.IDesktopEventBus);
  const windowRegistry = container.tryResolve<IWindowRegistry>(T.IWindowRegistry) ?? undefined;
  const perf = container.tryResolve<IPerformanceMonitor>(T.IPerformanceMonitor) ?? undefined;

  const broadcast = (channel: string, data: any) => {
    try {
      const windows = windowRegistry?.getAll() ?? [];
      for (const entry of windows) {
        if (!entry.window.isDestroyed()) {
          entry.window.webContents.send(channel, data);
        }
      }
    } catch (err) {
      // safe ignore in mock contexts
    }
  };

  eventBus.on('ai:task-started', (data) => broadcast('ai:task-started', data));
  eventBus.on('ai:task-completed', (data) => broadcast('ai:task-completed', data));
  eventBus.on('ai:plan-completed', (data) => broadcast('ai:plan-completed', data));

  router.handle('ai:get-providers', async () => {
    return providerRegistry.getAll().map((p: IAiProvider) => ({ id: p.id, name: p.name }));
  });

  router.handle('ai:set-provider', async (ctx: IIpcContext) => {
    const providerId = ctx.args[0] as string;
    sessionService.setProvider(providerId);
    const configService = container.tryResolve<any>(T.IConfigurationService);
    if (configService && typeof configService.setActiveRuntime === 'function') {
      configService.setActiveRuntime(providerId);
    }
    const runtimeManager = container.tryResolve<any>(T.IRuntimeManager);
    if (runtimeManager && typeof runtimeManager.activate === 'function') {
      try {
        runtimeManager.activate(providerId);
      } catch {
        // Safe ignore if runtimeId is not registered in runtimeManager yet
      }
    }
    broadcast('ai:runtime-changed', { activeRuntime: providerId, isExplicit: providerId !== 'auto' });
    return { success: true };
  });

  router.handle('ai:get-active-runtime', async () => {
    const configService = container.tryResolve<any>(T.IConfigurationService);
    const runtimeManager = container.tryResolve<any>(T.IRuntimeManager);
    const configuredId = configService?.getActiveRuntime() || 'auto';
    const resolvedRuntime = runtimeManager?.resolveFallbackRuntime
      ? await runtimeManager.resolveFallbackRuntime()
      : runtimeManager?.active();

    return {
      configuredRuntime: configuredId,
      activeRuntime: resolvedRuntime?.id || 'mock',
      isExplicit: configuredId !== 'auto',
      isFallback: configuredId !== 'auto' && resolvedRuntime?.id !== configuredId,
    };
  });

  router.handle('ai:get-models', async () => {
    const s = sessionService.getActiveSession();
    if (!s) return [];
    const prov = providerRegistry.getById(s.activeProviderId);
    if (!prov) return [];
    return await prov.listAvailableModels();
  });

  router.handle('ai:set-model', async (ctx: IIpcContext) => {
    const modelId = ctx.args[0] as string;
    sessionService.setModel(modelId);
    return { success: true };
  });

  router.handle('ai:collect-context', async (ctx: IIpcContext) => {
    const editorState = ctx.args[0] as any;
    return await contextEngine.collectContext(editorState);
  });

  router.handle('ai:execute-task', async (ctx: IIpcContext) => {
    const params = ctx.args[0] as { prompt: string; editorState: any };
    const collectedContext = await contextEngine.collectContext(params.editorState);
    const request = promptNormalizer.normalize(params.prompt, collectedContext);
    
    const response = await kernel.executeTask(request, (token: string) => {
      ctx.sender.send('ai:token', { token });
    });

    return { response };
  });

  router.handle('ai:cancel-task', async () => {
    kernel.cancelActiveTask();
    return { success: true };
  });

  router.handle('ai:generate-plan', async (ctx: IIpcContext) => {
    const startTime = Date.now();
    const params = ctx.args[0] as { prompt: string; context: any };
    const collectedContext = await contextEngine.collectContext(params.context || {});
    const plan = await planner.generatePlan(params.prompt, collectedContext);
    
    perf?.record('ai:generate-plan', Date.now() - startTime);
    return { plan };
  });

  router.handle('ai:execute-plan', async (ctx: IIpcContext) => {
    const startTime = Date.now();
    const params = ctx.args[0] as { plan: IPlan };
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
  router.handle('ai:request', async (ctx: IIpcContext) => {
    const params = ctx.args[0] as { id: string; prompt: string; options?: Record<string, any> };
    const orchestrator = container.resolve<AiOrchestrator>(T.IAiOrchestrator);
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
    const diag = container.resolve<DiagnosticsService>(T.IDiagnosticsService);
    return await diag.getDiagnosticsSnapshot();
  });

  // ─── Phase 23 Runtime Discovery Handlers ───────────────────────────────
  router.handle('runtime:discover', async (ctx: IIpcContext) => {
    const forceRefresh = (ctx.args?.[0] as any)?.forceRefresh ?? false;
    const discoveryEngine = container.resolve<any>(T.IRuntimeDiscoveryEngine);
    const runtimes = await discoveryEngine.discoverRuntimes(forceRefresh);
    return { success: true, runtimes };
  });

  router.handle('runtime:get-diagnostics', async () => {
    const discoveryEngine = container.resolve<any>(T.IRuntimeDiscoveryEngine);
    const diagnostics = await discoveryEngine.runDiagnostics();
    return { success: true, diagnostics };
  });

  router.handle('runtime:validate', async (ctx: IIpcContext) => {
    const execPath = ctx.args[0] as string;
    const discoveryEngine = container.resolve<any>(T.IRuntimeDiscoveryEngine);
    const result = await discoveryEngine.validateRuntimePath(execPath);
    return { success: true, result };
  });

  router.handle('runtime:check-health', async (ctx: IIpcContext) => {
    const runtimeId = ctx.args[0] as string;
    const discoveryEngine = container.resolve<any>(T.IRuntimeDiscoveryEngine);
    const result = await discoveryEngine.checkHealth(runtimeId);
    return { success: true, result };
  });

  router.handle('runtime:update-config', async (ctx: IIpcContext) => {
    const newConfig = ctx.args[0] as any;
    const discoveryEngine = container.resolve<any>(T.IRuntimeDiscoveryEngine);
    discoveryEngine.updateConfig(newConfig);
    return { success: true };
  });

  // ─── Phase 24 Runtime Execution Hub Handlers ───────────────────────────
  router.handle('runtime:launch-session', async (ctx: IIpcContext) => {
    const options = ctx.args[0] as any;
    const execManager = container.resolve<any>(T.IRuntimeExecutionManager);
    const session = await execManager.launchSession(options);
    return { success: true, session };
  });

  router.handle('runtime:stop-session', async (ctx: IIpcContext) => {
    const sessionId = ctx.args[0] as string;
    const execManager = container.resolve<any>(T.IRuntimeExecutionManager);
    await execManager.stopSession(sessionId);
    return { success: true };
  });

  router.handle('runtime:restart-session', async (ctx: IIpcContext) => {
    const sessionId = ctx.args[0] as string;
    const execManager = container.resolve<any>(T.IRuntimeExecutionManager);
    const session = await execManager.restartSession(sessionId);
    return { success: true, session };
  });

  router.handle('runtime:respond-approval', async (ctx: IIpcContext) => {
    const { sessionId, approvalId, decision } = ctx.args[0] as any;
    const execManager = container.resolve<any>(T.IRuntimeExecutionManager);
    await execManager.respondApproval(sessionId, approvalId, decision);
    return { success: true };
  });

  router.handle('runtime:get-active-sessions', async () => {
    const execManager = container.resolve<any>(T.IRuntimeExecutionManager);
    const sessions = await execManager.getAllSessions();
    return { success: true, sessions };
  });

  // ─── Phase 25-28 Routing, Session, Profile, Repository Import, Intelligence Handlers ──
  router.handle('runtime:route-intent', async (ctx: IIpcContext) => {
    const { prompt, workspaceRoot } = ctx.args[0] as { prompt: string; workspaceRoot: string };
    const intentAnalyzer = new (require('../../main/ai/routing/intent-analyzer').IntentAnalyzer)();
    const routerService = container.resolve<any>(T.IRuntimeRouter);
    const discoveryEngine = container.resolve<any>(T.IRuntimeDiscoveryEngine);

    const request = intentAnalyzer.analyze(prompt, workspaceRoot || process.cwd());
    const runtimes = discoveryEngine.getAllRuntimes();
    const candidates = runtimes.map((r: any) => ({
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

  router.handle('workspace:save-session', async (ctx: IIpcContext) => {
    const sessionData = ctx.args[0] as any;
    const sessionManager = container.resolve<any>(T.IWorkspaceSessionManager);
    await sessionManager.saveSession(sessionData);
    return { success: true };
  });

  router.handle('workspace:restore-session', async (ctx: IIpcContext) => {
    const workspaceRoot = (ctx.args[0] as string) || process.cwd();
    const sessionManager = container.resolve<any>(T.IWorkspaceSessionManager);
    const session = await sessionManager.restoreSession(workspaceRoot);
    return { success: true, session };
  });

  router.handle('workspace:get-profile', async (ctx: IIpcContext) => {
    const workspaceRoot = (ctx.args[0] as string) || process.cwd();
    const profileManager = container.resolve<any>(T.IWorkspaceProfileManager);
    const profile = profileManager.getProfile(workspaceRoot);
    return { success: true, profile };
  });

  router.handle('workspace:save-profile', async (ctx: IIpcContext) => {
    const { workspaceRoot, profile } = ctx.args[0] as any;
    const profileManager = container.resolve<any>(T.IWorkspaceProfileManager);
    profileManager.saveProfile(workspaceRoot || process.cwd(), profile);
    return { success: true };
  });

  router.handle('repository:import', async (ctx: IIpcContext) => {
    const { descriptor, destinationRoot } = ctx.args[0] as any;
    const importer = container.resolve<any>(T.IRepositoryImporter);
    const result = await importer.importRepository(descriptor, destinationRoot);
    return { success: true, result };
  });

  router.handle('workspace:analyze', async (ctx: IIpcContext) => {
    const workspaceRoot = (ctx.args[0] as string) || process.cwd();
    const intelligenceEngine = new (require('../../main/ai/intelligence/engineering-intelligence-engine').EngineeringIntelligenceEngine)();
    const analysis = await intelligenceEngine.analyzeRepository(workspaceRoot);
    return { success: true, analysis };
  });

  router.handle('action:execute', async (ctx: IIpcContext) => {
    const request = ctx.args[0] as any;
    const actionExecutor = container.resolve<any>(T.IActionExecutor);
    const result = await actionExecutor.executeAction(request);
    return { success: true, result };
  });

  router.handle('action:approve', async (ctx: IIpcContext) => {
    const { requestId } = ctx.args[0] as { requestId: string };
    const actionExecutor = container.resolve<any>(T.IActionExecutor);
    const approved = actionExecutor.approvalMiddleware.respondApproval(requestId, true);
    return { success: approved };
  });

  router.handle('action:reject', async (ctx: IIpcContext) => {
    const { requestId } = ctx.args[0] as { requestId: string };
    const actionExecutor = container.resolve<any>(T.IActionExecutor);
    const rejected = actionExecutor.approvalMiddleware.respondApproval(requestId, false);
    return { success: rejected };
  });

  router.handle('action:cancel', async (ctx: IIpcContext) => {
    const { requestId } = ctx.args[0] as { requestId: string };
    const actionExecutor = container.resolve<any>(T.IActionExecutor);
    const cancelled = actionExecutor.approvalMiddleware.respondApproval(requestId, false);
    return { success: cancelled };
  });

  router.handle('action:history', async (ctx: IIpcContext) => {
    const workspaceRoot = (ctx.args[0] as string) || process.cwd();
    const actionHistory = container.resolve<any>(T.IActionHistory);
    const history = await actionHistory.getHistory(workspaceRoot);
    return { success: true, history };
  });

  router.handle('action:list', async () => {
    const registry = container.resolve<any>(T.IActionRegistry);
    const actions = registry.listActions().map((a: any) => a.metadata);
    return { success: true, actions };
  });

  // ─── Phase 30 Agent Framework IPC Handlers ─────────────────────────────────────
  router.handle('agent:run-workflow', async (ctx: IIpcContext) => {
    const request = ctx.args[0] as any;
    const orchestrator = container.resolve<any>(T.IAgentOrchestrator);
    const result = await orchestrator.runWorkflow(request);
    return { success: true, result };
  });

  router.handle('agent:cancel-task', async (ctx: IIpcContext) => {
    const { taskId } = ctx.args[0] as { taskId: string };
    const orchestrator = container.resolve<any>(T.IAgentOrchestrator);
    orchestrator.scheduler.cancelTask(taskId);
    return { success: true };
  });

  router.handle('agent:get-memory', async (ctx: IIpcContext) => {
    const workspaceRoot = (ctx.args[0] as string) || process.cwd();
    const memory = container.resolve<any>(T.IAgentMemory);
    const entries = await memory.getAll(workspaceRoot);
    return { success: true, entries };
  });

  router.handle('agent:list', async () => {
    const registry = container.resolve<any>(T.IAgentRegistry);
    const agents = registry.list().map((a: any) => ({
      role: a.role,
      name: a.name,
      description: a.description,
      capabilities: a.capabilities,
    }));
    return { success: true, agents };
  });

  // Decoupled AgentEventEmitter -> Electron IPC Bridge
  const orchestratorInstance = container.resolve<any>(T.IAgentOrchestrator);
  orchestratorInstance.events.onAgentEvent((evt: any) => {
    broadcast('agent:event', evt);
  });

  // Decoupled ActionEventEmitter -> Electron IPC Bridge
  const actionExecutorInstance = container.resolve<any>(T.IActionExecutor);
  actionExecutorInstance.events.onActionEvent((evt: any) => {
    broadcast('action:event', evt);
  });

  // Decoupled RuntimeEventBus -> Electron IPC Bridge
  const runtimeEventBus = container.resolve<any>(T.IRuntimeEventBus);
  runtimeEventBus.onRuntimeEvent((evt: any) => {
    broadcast('runtime:event', evt);
  });

  // Forward event stream to all windows
  eventBus.on('ai:event', (data) => broadcast('ai:event', data));
  eventBus.on('ai:execute-command', (data) => broadcast('ai:execute-command', data));
}


