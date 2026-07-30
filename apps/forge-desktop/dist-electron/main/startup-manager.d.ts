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
import type { IDesktopContainer } from './container/interfaces';
import type { IStartupManager } from './container/service-interfaces';
export type StartupStage = 'idle' | 'pre-init' | 'core' | 'ipc' | 'workspace' | 'ui' | 'services' | 'plugins' | 'ready' | 'running' | 'failed';
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
export declare class StartupManager implements IStartupManager {
    private readonly container;
    private currentStage_;
    private readonly stageResults_;
    private readonly startTime_;
    private readonly kernel;
    constructor(container: IDesktopContainer);
    getCurrentStage(): string;
    boot(): Promise<void>;
    shutdown(): Promise<void>;
    private runBootSequence;
    private runStage;
    private stagePreInit;
    /** Stage 2: Boot logger + event bus. */
    private stageCore;
    /** Stage 3: Attach IPC router and register all system handlers. */
    private stageIpc;
    /** Stage 4: Restore last workspace session (non-fatal). */
    private stageWorkspace;
    /** Stage 5: Apply theme + restore window state (non-fatal). */
    private stageUi;
    /** Stage 6: Remaining services (non-fatal). */
    private stageServices;
    /** Stage 7: Plugin activation (non-fatal). */
    private stagePlugins;
    /** Stage 8: Freeze container + emit ready. Fatal — renderer waits on this. */
    private stageReady;
    private safeResolve;
    private emitEvent;
    private buildReport;
    getReport(): IStartupReport;
}
