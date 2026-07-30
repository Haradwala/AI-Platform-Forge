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

import type { IDesktopContainer, IValidationResult } from './container/interfaces';
import type { IStartupManager, IDesktopLogger, IDesktopEventBus, IIpcRouter, IWorkspaceService, ISessionManager, IWindowService, IRepositoryProvider, IAiSessionService } from './container/service-interfaces';
import { T } from './container/tokens';
import { registerSystemHandlers } from '../ipc/handlers/system-handlers';
import { registerWindowHandlers } from '../ipc/handlers/window-handlers';
import { registerWorkspaceHandlers } from '../ipc/handlers/workspace-handlers';
import { registerThemeHandlers } from '../ipc/handlers/theme-handlers';
import { registerTerminalHandlers } from '../ipc/handlers/terminal-handlers';
import { registerSessionHandlers } from '../ipc/handlers/session-handlers';
import { registerAiHandlers } from '../ipc/handlers/ai-handlers';
import { InternalPlatform } from './platform/internal-platform';
import { ArchitectureValidator } from './platform/architecture-validator';
import { PlatformInspectorService } from './platform/platform-inspector-service';
import { RuntimeKernel } from './platform/runtime-kernel';
import { LifecycleManager } from './platform/lifecycle-manager';
import { BackgroundScheduler } from './platform/background-scheduler';
import { ResourceManager } from './platform/resource-manager';
import { Observability } from './platform/observability';
import { FeatureRegistry } from './platform/feature-registry';
import { PlatformRecoveryService } from './platform/platform-recovery-service';
import { RuntimeHealthService } from './platform/runtime-health-service';
import { RepositoryIntelligenceEngine } from './platform/repository-intelligence';
import { AiSessionService } from './ai/session/ai-session-service';


export type StartupStage =
  | 'idle'
  | 'pre-init'
  | 'core'
  | 'ipc'
  | 'workspace'
  | 'ui'
  | 'services'
  | 'plugins'
  | 'ready'
  | 'running'
  | 'failed';

export interface IStartupStageResult {
  readonly stage: StartupStage;
  readonly success: boolean;
  readonly durationMs: number;
  readonly error?: Error;
}

export interface IStartupReport {
  readonly totalDurationMs: number;
  readonly stages: readonly IStartupStageResult[];
  readonly finalStage: StartupStage;
  readonly success: boolean;
}

export class StartupManager implements IStartupManager {
  private currentStage_: StartupStage = 'idle';
  private readonly stageResults_: IStartupStageResult[] = [];
  private readonly startTime_ = Date.now();
  private readonly kernel = new RuntimeKernel();

  constructor(private readonly container: IDesktopContainer) {}

  // ─── IStartupManager interface ─────────────────────────────────────────────

  getCurrentStage(): string {
    return this.currentStage_;
  }

  async boot(): Promise<void> {
    const report = await this.runBootSequence();
    if (!report.success) {
      throw new Error(
        `StartupManager: Boot failed at stage "${report.finalStage}". ` +
        `Check logs for details.`,
      );
    }
  }

  async shutdown(): Promise<void> {
    this.currentStage_ = 'idle';
    const logger = this.safeResolve<IDesktopLogger>(T.IDesktopLogger);
    logger?.info('[StartupManager] Initiating shutdown...');

    // Detach IPC first
    const ipcRouter = this.safeResolve<IIpcRouter>(T.IIpcRouter);
    ipcRouter?.detach?.();

    // Dispose all services via container
    await this.container.shutdownAll();

    logger?.info('[StartupManager] Shutdown complete.');
  }

  // ─── Boot sequence ─────────────────────────────────────────────────────────

  private async runBootSequence(): Promise<IStartupReport> {
    const stages: Array<{
      name: StartupStage;
      handler: () => Promise<void>;
      fatal: boolean;
    }> = [
      { name: 'pre-init',  handler: () => this.stagePreInit(),  fatal: true  },
      { name: 'core',      handler: () => this.stageCore(),     fatal: true  },
      { name: 'ipc',       handler: () => this.stageIpc(),      fatal: true  },
      { name: 'workspace', handler: () => this.stageWorkspace(),fatal: false },
      { name: 'ui',        handler: () => this.stageUi(),       fatal: false },
      { name: 'services',  handler: () => this.stageServices(), fatal: false },
      { name: 'plugins',   handler: () => this.stagePlugins(),  fatal: false },
      { name: 'ready',     handler: () => this.stageReady(),    fatal: true  },
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

  private async runStage(
    name: StartupStage,
    handler: () => Promise<void>,
  ): Promise<IStartupStageResult> {
    this.currentStage_ = name;
    const stageStart = Date.now();
    this.emitEvent(`startup.stage.${name}`, { stage: name });

    try {
      await handler();
      return { stage: name, success: true, durationMs: Date.now() - stageStart };
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      this.safeResolve<IDesktopLogger>(T.IDesktopLogger)
        ?.error(`[StartupManager] Stage "${name}" failed:`, error);
      return { stage: name, success: false, durationMs: Date.now() - stageStart, error };
    }
  }

  // ─── Individual stages ─────────────────────────────────────────────────────

  private async stagePreInit(): Promise<void> {
    const result: IValidationResult = this.container.validate();
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
    const archResult = ArchitectureValidator.validate(this.container, []);
    if (!archResult.success) {
      throw new Error(`Architecture validation failed:\n${archResult.errors.join('\n')}`);
    }
  }

  /** Stage 2: Boot logger + event bus. */
  private async stageCore(): Promise<void> {
    try {
      await this.container.initializeAll();
    } catch (err) {
      console.error('[stageCore initializeAll error]', err);
      throw err;
    }
    const logger = this.container.resolve<IDesktopLogger>(T.IDesktopLogger);
    logger.info('[StartupManager] Core services initialized.');

    // Instantiate and register core IRuntimeServices on the Runtime Kernel
    const workspaceService = this.container.resolve<IWorkspaceService>(T.IWorkspaceService);

    const lifecycle = new LifecycleManager();
    const scheduler = new BackgroundScheduler();
    const resources = new ResourceManager();
    const observability = new Observability();
    const features = new FeatureRegistry();
    const recovery = new PlatformRecoveryService(workspaceService);
    const health = new RuntimeHealthService(this.kernel);

    const repository = (this.container.tryResolve<IRepositoryProvider>(T.IRepositoryProvider) ?? new RepositoryIntelligenceEngine(workspaceService)) as unknown as RepositoryIntelligenceEngine;
    const aiSessionService = this.container.resolve<IAiSessionService>(T.IAiSessionService) as unknown as AiSessionService;

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
  private async stageIpc(): Promise<void> {
    const router = this.container.resolve<IIpcRouter>(T.IIpcRouter);

    const windowService = this.container.resolve<IWindowService>(T.IWindowService);
    const workspaceService = this.container.resolve<IWorkspaceService>(T.IWorkspaceService);

    registerSystemHandlers(router, this.container);
    registerWindowHandlers(router, windowService);
    registerWorkspaceHandlers(router, workspaceService);
    registerThemeHandlers(router, this.container);
    registerTerminalHandlers(router, this.container);
    registerSessionHandlers(router, this.container);
    registerAiHandlers(router, this.container);

    router.attach?.();
    this.safeResolve<IDesktopLogger>(T.IDesktopLogger)?.info('[StartupManager] IPC router attached and handlers registered.');
  }

  /** Stage 4: Restore last workspace session (non-fatal). */
  private async stageWorkspace(): Promise<void> {
    const logger = this.safeResolve<IDesktopLogger>(T.IDesktopLogger);
    const workspaceService = this.safeResolve<IWorkspaceService>(T.IWorkspaceService);
    const sessionManager = this.safeResolve<ISessionManager>(T.ISessionManager);

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
      } else {
        logger?.info('[StartupManager] No recent workspaces to restore.');
      }
    } catch (err: any) {
      logger?.error(`[StartupManager] Failed to restore workspace session: ${err.message}`);
    }
  }

  /** Stage 5: Apply theme + restore window state (non-fatal). */
  private async stageUi(): Promise<void> {
    const windowService = this.container.resolve<any>(T.IWindowService);
    await windowService.createMainWindow();
    this.safeResolve<IDesktopLogger>(T.IDesktopLogger)?.info('[StartupManager] UI stage complete: Main window created.');
  }

  /** Stage 6: Remaining services (non-fatal). */
  private async stageServices(): Promise<void> {
    this.safeResolve<IDesktopLogger>(T.IDesktopLogger)?.info('[StartupManager] Services stage complete.');
  }

  /** Stage 7: Plugin activation (non-fatal). */
  private async stagePlugins(): Promise<void> {
    this.safeResolve<IDesktopLogger>(T.IDesktopLogger)?.info('[StartupManager] Plugins stage complete (stub).');
  }

  /** Stage 8: Freeze container + emit ready. Fatal — renderer waits on this. */
  private async stageReady(): Promise<void> {
    this.container.freeze();
    const logger = this.safeResolve<IDesktopLogger>(T.IDesktopLogger);
    logger?.info('[StartupManager] Container frozen. App ready.');

    // Initialize Internal Platform
    InternalPlatform.initialize(this.container);

    // Export architecture & runtime documentation maps
    try {
      const workspaceService = this.container.resolve<IWorkspaceService>(T.IWorkspaceService);
      if (logger) {
        const inspector = new PlatformInspectorService(this.container, workspaceService, logger);
        inspector.generateDiagnostics([]);
        inspector.generateRuntimeDiagnostics(this.kernel);
      }
    } catch (err: any) {
      logger?.error('[StartupManager] Failed to run PlatformInspectorService:', err);
    }
  }

  // ─── Helpers ───────────────────────────────────────────────────────────────

  private safeResolve<T>(token: symbol): T | null {
    return this.container.tryResolve<T>(token);
  }

  private emitEvent(topic: string, payload?: Record<string, unknown>): void {
    const bus = this.safeResolve<IDesktopEventBus>(T.IDesktopEventBus);
    bus?.emit(topic, { stage: this.currentStage_, ...payload });
  }

  private buildReport(success: boolean): IStartupReport {
    const lastStage = this.stageResults_[this.stageResults_.length - 1];
    return {
      totalDurationMs: Date.now() - this.startTime_,
      stages: this.stageResults_,
      finalStage: lastStage?.stage ?? 'idle',
      success,
    };
  }

  getReport(): IStartupReport {
    return this.buildReport(this.currentStage_ === 'running');
  }
}
