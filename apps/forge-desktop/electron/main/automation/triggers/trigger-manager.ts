/**
 * trigger-manager.ts — Central Trigger Manager & Event Multiplexer
 *
 * Listens for system and workspace events on DesktopEventBus and triggers
 * matching workflow executions via AutomationCoordinator.
 */

import type { IDesktopEventBus } from '../../container/service-interfaces';
import { AutomationWorkflowDefinition } from '../contracts/automation-types';
import { AutomationCoordinator } from '../coordinator/automation-coordinator';
import { GitTriggerEvaluator } from './git-trigger-evaluator';
import { FileWatchTriggerEvaluator } from './file-watch-trigger-evaluator';
import { CronTriggerEvaluator } from './cron-trigger-evaluator';

export class TriggerManager {
  private registeredWorkflows = new Map<string, AutomationWorkflowDefinition>();
  private gitEvaluator = new GitTriggerEvaluator();
  private fileWatchEvaluator = new FileWatchTriggerEvaluator();
  private cronEvaluator = new CronTriggerEvaluator();

  constructor(
    private readonly eventBus?: IDesktopEventBus,
    private readonly coordinator?: AutomationCoordinator
  ) {
    this.setupEventListeners();
  }

  registerWorkflow(workflow: AutomationWorkflowDefinition): void {
    this.registeredWorkflows.set(workflow.id, workflow);
  }

  unregisterWorkflow(workflowId: string): void {
    this.registeredWorkflows.delete(workflowId);
  }

  /**
   * Evaluates an incoming event against all registered workflow triggers.
   */
  async evaluateEvent(eventType: string, payload: any): Promise<void> {
    for (const workflow of this.registeredWorkflows.values()) {
      for (const cond of workflow.on || []) {
        let isMatch = false;

        if (cond.type === 'push' || cond.type === 'pull_request') {
          isMatch = this.gitEvaluator.matches(cond, payload);
        } else if (cond.type === 'file_change') {
          isMatch = this.fileWatchEvaluator.matches(cond, payload.filePath || '');
        } else if (cond.type === 'schedule') {
          isMatch = this.cronEvaluator.matches(cond);
        } else if (cond.type === 'event' && cond.events) {
          isMatch = cond.events.includes(eventType);
        }

        if (isMatch && this.coordinator) {
          await this.coordinator.executeWorkflow(workflow, payload.inputs || {});
          break;
        }
      }
    }
  }

  private setupEventListeners(): void {
    if (!this.eventBus) return;

    this.eventBus.on('workspace.file_changed', (payload) => {
      this.evaluateEvent('workspace.file_changed', payload);
    });

    this.eventBus.on('git.event', (payload) => {
      this.evaluateEvent('git.event', payload);
    });
  }
}
