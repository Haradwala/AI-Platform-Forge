import type {
  IExecutionEngine,
  IPlan,
  IJournalEntry,
  IWorkspaceService,
  IDesktopLogger,
  IDesktopEventBus,
} from '../../container/service-interfaces';
import type { ExecutionGraphEngine } from './execution-graph-engine';
import type { ExecutionScheduler } from './execution-scheduler';
import type { ExecutionObserver } from './execution-observer';
import { ExecutionBudgetTracker } from './execution-budget';
import * as fs from 'fs';
import * as path from 'path';

import type { IExecutionResult } from './execution-types';

export class ExecutionEngine implements IExecutionEngine {
  private activePlanId: string | null = null;
  private abortController: AbortController | null = null;
  private readonly journal: IJournalEntry[] = [];

  constructor(
    private readonly graphEngine: ExecutionGraphEngine,
    private readonly scheduler: ExecutionScheduler,
    private readonly observer: ExecutionObserver,
    private readonly workspaceService: IWorkspaceService,
    private readonly logger: IDesktopLogger,
    private readonly eventBus: IDesktopEventBus
  ) {
    this.observer.subscribe((event) => {
      this.logger.debug(`[ExecutionEngine] Observer event: ${event.type} for execution: ${event.executionId}`);
      if (event.type === 'execution:progress') {
        if (event.state === 'running') {
          this.eventBus.emit('ai:task-started', {
            taskId: event.taskId,
            title: event.taskId,
            planId: this.activePlanId || '',
          });
        } else if (event.state === 'completed' || event.state === 'failed') {
          this.eventBus.emit('ai:task-completed', {
            taskId: event.taskId,
            status: event.state,
            result: event.result,
            error: event.error,
            planId: this.activePlanId || '',
          });
        }
      }
    });
  }

  async executePlan(plan: IPlan): Promise<IExecutionResult[]> {
    this.activePlanId = plan.id;
    this.abortController = new AbortController();
    const executionId = `exec-${plan.id}-${Date.now()}`;

    this.logger.info(`[ExecutionEngine] Starting execution for plan: ${plan.id} (${executionId})`);

    this.graphEngine.build(plan);
    const validation = this.graphEngine.validate();
    if (!validation.valid) {
      throw new Error(`Execution Graph Validation failed: ${validation.reason}`);
    }

    const budgetTracker = new ExecutionBudgetTracker({
      tokenBudget: 500000,
      timeBudget: 600,
      costBudget: 0.1,
      fileBudget: 20,
      retryBudget: 5,
    });

    const entry: IJournalEntry = {
      planId: plan.id,
      goal: plan.goal,
      startTime: new Date().toISOString(),
      tasksExecuted: [],
    };
    this.journal.push(entry);

    try {
      const results = await this.scheduler.schedule(
        this.graphEngine,
        budgetTracker,
        this.abortController.signal,
        executionId,
        plan.id
      );

      entry.endTime = new Date().toISOString();
      this.eventBus.emit('ai:plan-completed', { planId: plan.id, success: true });
      await this.saveJournalToWorkspace();
      return results;
    } catch (err: any) {
      entry.endTime = new Date().toISOString();
      this.eventBus.emit('ai:plan-completed', { planId: plan.id, success: false, error: err.message });
      await this.saveJournalToWorkspace();
      throw err;
    } finally {
      this.activePlanId = null;
      this.abortController = null;
    }
  }

  cancelActiveTask(): void {
    if (this.abortController) {
      this.abortController.abort();
      this.logger.info('[ExecutionEngine] Cancel active execution requested.');
    }
  }

  getJournal(): IJournalEntry[] {
    return this.journal;
  }

  private async saveJournalToWorkspace(): Promise<void> {
    const root = this.workspaceService.getRootPath();
    if (!root) return;

    try {
      const forgeDir = path.join(root, '.forge');
      if (!fs.existsSync(forgeDir)) {
        await fs.promises.mkdir(forgeDir, { recursive: true });
      }
      const journalFile = path.join(forgeDir, 'journal.json');
      await fs.promises.writeFile(journalFile, JSON.stringify(this.journal, null, 2), 'utf-8');
    } catch (err) {
      this.logger.error(`[ExecutionEngine] Failed to write journal log: ${err}`);
    }
  }
}
