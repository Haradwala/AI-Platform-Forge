import type { IExecutionEngine, IPlan, IJournalEntry, IWorkspaceService, IDesktopLogger, IDesktopEventBus } from '../../container/service-interfaces';
import type { ExecutionGraphEngine } from './execution-graph-engine';
import type { ExecutionScheduler } from './execution-scheduler';
import type { ExecutionObserver } from './execution-observer';
import type { IExecutionResult } from './execution-types';
export declare class ExecutionEngine implements IExecutionEngine {
    private readonly graphEngine;
    private readonly scheduler;
    private readonly observer;
    private readonly workspaceService;
    private readonly logger;
    private readonly eventBus;
    private activePlanId;
    private abortController;
    private readonly journal;
    constructor(graphEngine: ExecutionGraphEngine, scheduler: ExecutionScheduler, observer: ExecutionObserver, workspaceService: IWorkspaceService, logger: IDesktopLogger, eventBus: IDesktopEventBus);
    executePlan(plan: IPlan): Promise<IExecutionResult[]>;
    cancelActiveTask(): void;
    getJournal(): IJournalEntry[];
    private saveJournalToWorkspace;
}
