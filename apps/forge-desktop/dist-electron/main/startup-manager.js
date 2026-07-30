"use strict";
/**
 * StartupManager — 10-stage deterministic boot sequencer for the Forge Desktop.
 *
 * Stage sequence (each emits an event on the Desktop Event Bus):
 *  0  idle        → initial state
 *  1  pre-init    → validate container, set up error boundaries
 *  2  core        → initialize logging + event bus
 *  3  ipc         → attach IPC router, register all handlers
 *  4  workspace   → restore last session
 *  5  ui          → apply theme, window state
 *  6  services    → initialize remaining services in dep order
 *  7  plugins     → load and activate plugins
 *  8  ready       → emit ready, unblock renderer
 *  9  running     → fully running, all services healthy
 *
 * Failures at any stage are isolated — the stage fails, logs the error,
 * emits a failure event, and (if recoverable) continues. Fatal stages
 * set status=failed and stop the sequence.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.StartupManager = void 0;
const tokens_1 = require("./container/tokens");
const system_handlers_1 = require("../ipc/handlers/system-handlers");
const window_handlers_1 = require("../ipc/handlers/window-handlers");
const workspace_handlers_1 = require("../ipc/handlers/workspace-handlers");
const theme_handlers_1 = require("../ipc/handlers/theme-handlers");
const terminal_handlers_1 = require("../ipc/handlers/terminal-handlers");
const session_handlers_1 = require("../ipc/handlers/session-handlers");
const ai_handlers_1 = require("../ipc/handlers/ai-handlers");
const internal_platform_1 = require("./platform/internal-platform");
const architecture_validator_1 = require("./platform/architecture-validator");
const platform_inspector_service_1 = require("./platform/platform-inspector-service");
const runtime_kernel_1 = require("./platform/runtime-kernel");
const lifecycle_manager_1 = require("./platform/lifecycle-manager");
const background_scheduler_1 = require("./platform/background-scheduler");
const resource_manager_1 = require("./platform/resource-manager");
const observability_1 = require("./platform/observability");
const feature_registry_1 = require("./platform/feature-registry");
const platform_recovery_service_1 = require("./platform/platform-recovery-service");
const runtime_health_service_1 = require("./platform/runtime-health-service");
const repository_intelligence_1 = require("./platform/repository-intelligence");
class StartupManager {
    container;
    currentStage_ = 'idle';
    stageResults_ = [];
    startTime_ = Date.now();
    kernel = new runtime_kernel_1.RuntimeKernel();
    constructor(container) {
        this.container = container;
    }
    // ─── IStartupManager interface ─────────────────────────────────────────────
    getCurrentStage() {
        return this.currentStage_;
    }
    async boot() {
        const report = await this.runBootSequence();
        if (!report.success) {
            throw new Error(`StartupManager: Boot failed at stage "${report.finalStage}". ` +
                `Check logs for details.`);
        }
    }
    async shutdown() {
        this.currentStage_ = 'idle';
        const logger = this.safeResolve(tokens_1.T.IDesktopLogger);
        logger?.info('[StartupManager] Initiating shutdown...');
        // Detach IPC first
        const ipcRouter = this.safeResolve(tokens_1.T.IIpcRouter);
        ipcRouter?.detach?.();
        // Dispose all services via container
        await this.container.shutdownAll();
        logger?.info('[StartupManager] Shutdown complete.');
    }
    // ─── Boot sequence ─────────────────────────────────────────────────────────
    async runBootSequence() {
        const stages = [
            { name: 'pre-init', handler: () => this.stagePreInit(), fatal: true },
            { name: 'core', handler: () => this.stageCore(), fatal: true },
            { name: 'ipc', handler: () => this.stageIpc(), fatal: true },
            { name: 'workspace', handler: () => this.stageWorkspace(), fatal: false },
            { name: 'ui', handler: () => this.stageUi(), fatal: false },
            { name: 'services', handler: () => this.stageServices(), fatal: false },
            { name: 'plugins', handler: () => this.stagePlugins(), fatal: false },
            { name: 'ready', handler: () => this.stageReady(), fatal: true },
        ];
        for (const { name, handler, fatal } of stages) {
            const result = await this.runStage(name, handler);
            this.stageResults_.push(result);
            if (!result.success && fatal) {
                this.currentStage_ = 'failed';
                this.emitEvent('startup.failed', { stage: name, error: result.error?.message });
                return this.buildReport(false);
            }
        }
        this.currentStage_ = 'running';
        this.emitEvent('startup.complete', { totalMs: Date.now() - this.startTime_ });
        return this.buildReport(true);
    }
    async runStage(name, handler) {
        this.currentStage_ = name;
        const stageStart = Date.now();
        this.emitEvent(`startup.stage.${name}`, { stage: name });
        try {
            await handler();
            return { stage: name, success: true, durationMs: Date.now() - stageStart };
        }
        catch (err) {
            const error = err instanceof Error ? err : new Error(String(err));
            this.safeResolve(tokens_1.T.IDesktopLogger)
                ?.error(`[StartupManager] Stage "${name}" failed:`, error);
            return { stage: name, success: false, durationMs: Date.now() - stageStart, error };
        }
    }
    // ─── Individual stages ─────────────────────────────────────────────────────
    async stagePreInit() {
        const result = this.container.validate();
        if (!result.valid) {
            const messages = result.errors.map((e) => `  • ${e.name}: ${e.message}`).join('\n');
            console.error('[StartupManager PreInit Error]', messages);
            throw new Error(`Container validation failed:\n${messages}`);
        }
        if (result.warnings.length > 0) {
            const warnings = result.warnings.map((w) => `  ⚠ ${w.name}: ${w.message}`).join('\n');
            console.warn(`[StartupManager] Container warnings:\n${warnings}`);
        }
        // Call the Architecture Validator to check for duplicates, IPC overlap, etc.
        const archResult = architecture_validator_1.ArchitectureValidator.validate(this.container, []);
        if (!archResult.success) {
            throw new Error(`Architecture validation failed:\n${archResult.errors.join('\n')}`);
        }
    }
    /** Stage 2: Boot logger + event bus. */
    async stageCore() {
        try {
            await this.container.initializeAll();
        }
        catch (err) {
            console.error('[stageCore initializeAll error]', err);
            throw err;
        }
        const logger = this.container.resolve(tokens_1.T.IDesktopLogger);
        logger.info('[StartupManager] Core services initialized.');
        // Instantiate and register core IRuntimeServices on the Runtime Kernel
        const workspaceService = this.container.resolve(tokens_1.T.IWorkspaceService);
        const lifecycle = new lifecycle_manager_1.LifecycleManager();
        const scheduler = new background_scheduler_1.BackgroundScheduler();
        const resources = new resource_manager_1.ResourceManager();
        const observability = new observability_1.Observability();
        const features = new feature_registry_1.FeatureRegistry();
        const recovery = new platform_recovery_service_1.PlatformRecoveryService(workspaceService);
        const health = new runtime_health_service_1.RuntimeHealthService(this.kernel);
        const repository = (this.container.tryResolve(tokens_1.T.IRepositoryProvider) ?? new repository_intelligence_1.RepositoryIntelligenceEngine(workspaceService));
        const aiSessionService = this.container.resolve(tokens_1.T.IAiSessionService);
        this.kernel.register(lifecycle);
        this.kernel.register(scheduler);
        this.kernel.register(resources);
        this.kernel.register(observability);
        this.kernel.register(features);
        this.kernel.register(recovery);
        this.kernel.register(health);
        this.kernel.register(repository);
        this.kernel.register(aiSessionService);
        // Boot/Start the Runtime Kernel
        await this.kernel.start();
        logger.info('[StartupManager] Runtime Kernel started and services mounted.');
    }
    /** Stage 3: Attach IPC router and register all system handlers. */
    async stageIpc() {
        const router = this.container.resolve(tokens_1.T.IIpcRouter);
        const windowService = this.container.resolve(tokens_1.T.IWindowService);
        const workspaceService = this.container.resolve(tokens_1.T.IWorkspaceService);
        (0, system_handlers_1.registerSystemHandlers)(router, this.container);
        (0, window_handlers_1.registerWindowHandlers)(router, windowService);
        (0, workspace_handlers_1.registerWorkspaceHandlers)(router, workspaceService);
        (0, theme_handlers_1.registerThemeHandlers)(router, this.container);
        (0, terminal_handlers_1.registerTerminalHandlers)(router, this.container);
        (0, session_handlers_1.registerSessionHandlers)(router, this.container);
        (0, ai_handlers_1.registerAiHandlers)(router, this.container);
        router.attach?.();
        this.safeResolve(tokens_1.T.IDesktopLogger)?.info('[StartupManager] IPC router attached and handlers registered.');
    }
    /** Stage 4: Restore last workspace session (non-fatal). */
    async stageWorkspace() {
        const logger = this.safeResolve(tokens_1.T.IDesktopLogger);
        const workspaceService = this.safeResolve(tokens_1.T.IWorkspaceService);
        const sessionManager = this.safeResolve(tokens_1.T.ISessionManager);
        if (!workspaceService || !sessionManager) {
            logger?.warn('[StartupManager] WorkspaceService or SessionManager not available during stageWorkspace');
            return;
        }
        try {
            const recents = await workspaceService.getRecentWorkspaces();
            if (recents && recents.length > 0) {
                const lastWorkspace = recents[0];
                logger?.info(`[StartupManager] Restoring last workspace: ${lastWorkspace}`);
                await workspaceService.open(lastWorkspace);
                await sessionManager.restore();
            }
            else {
                logger?.info('[StartupManager] No recent workspaces to restore.');
            }
        }
        catch (err) {
            logger?.error(`[StartupManager] Failed to restore workspace session: ${err.message}`);
        }
    }
    /** Stage 5: Apply theme + restore window state (non-fatal). */
    async stageUi() {
        const windowService = this.container.resolve(tokens_1.T.IWindowService);
        await windowService.createMainWindow();
        this.safeResolve(tokens_1.T.IDesktopLogger)?.info('[StartupManager] UI stage complete: Main window created.');
    }
    /** Stage 6: Remaining services (non-fatal). */
    async stageServices() {
        this.safeResolve(tokens_1.T.IDesktopLogger)?.info('[StartupManager] Services stage complete.');
    }
    /** Stage 7: Plugin activation (non-fatal). */
    async stagePlugins() {
        this.safeResolve(tokens_1.T.IDesktopLogger)?.info('[StartupManager] Plugins stage complete (stub).');
    }
    /** Stage 8: Freeze container + emit ready. Fatal — renderer waits on this. */
    async stageReady() {
        this.container.freeze();
        const logger = this.safeResolve(tokens_1.T.IDesktopLogger);
        logger?.info('[StartupManager] Container frozen. App ready.');
        // Initialize Internal Platform
        internal_platform_1.InternalPlatform.initialize(this.container);
        // Export architecture & runtime documentation maps
        try {
            const workspaceService = this.container.resolve(tokens_1.T.IWorkspaceService);
            if (logger) {
                const inspector = new platform_inspector_service_1.PlatformInspectorService(this.container, workspaceService, logger);
                inspector.generateDiagnostics([]);
                inspector.generateRuntimeDiagnostics(this.kernel);
            }
        }
        catch (err) {
            logger?.error('[StartupManager] Failed to run PlatformInspectorService:', err);
        }
    }
    // ─── Helpers ───────────────────────────────────────────────────────────────
    safeResolve(token) {
        return this.container.tryResolve(token);
    }
    emitEvent(topic, payload) {
        const bus = this.safeResolve(tokens_1.T.IDesktopEventBus);
        bus?.emit(topic, { stage: this.currentStage_, ...payload });
    }
    buildReport(success) {
        const lastStage = this.stageResults_[this.stageResults_.length - 1];
        return {
            totalDurationMs: Date.now() - this.startTime_,
            stages: this.stageResults_,
            finalStage: lastStage?.stage ?? 'idle',
            success,
        };
    }
    getReport() {
        return this.buildReport(this.currentStage_ === 'running');
    }
}
exports.StartupManager = StartupManager;
//# sourceMappingURL=startup-manager.js.map