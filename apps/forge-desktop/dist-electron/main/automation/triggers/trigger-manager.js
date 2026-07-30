"use strict";
/**
 * trigger-manager.ts — Central Trigger Manager & Event Multiplexer
 *
 * Listens for system and workspace events on DesktopEventBus and triggers
 * matching workflow executions via AutomationCoordinator.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.TriggerManager = void 0;
const git_trigger_evaluator_1 = require("./git-trigger-evaluator");
const file_watch_trigger_evaluator_1 = require("./file-watch-trigger-evaluator");
const cron_trigger_evaluator_1 = require("./cron-trigger-evaluator");
class TriggerManager {
    eventBus;
    coordinator;
    registeredWorkflows = new Map();
    gitEvaluator = new git_trigger_evaluator_1.GitTriggerEvaluator();
    fileWatchEvaluator = new file_watch_trigger_evaluator_1.FileWatchTriggerEvaluator();
    cronEvaluator = new cron_trigger_evaluator_1.CronTriggerEvaluator();
    constructor(eventBus, coordinator) {
        this.eventBus = eventBus;
        this.coordinator = coordinator;
        this.setupEventListeners();
    }
    registerWorkflow(workflow) {
        this.registeredWorkflows.set(workflow.id, workflow);
    }
    unregisterWorkflow(workflowId) {
        this.registeredWorkflows.delete(workflowId);
    }
    /**
     * Evaluates an incoming event against all registered workflow triggers.
     */
    async evaluateEvent(eventType, payload) {
        for (const workflow of this.registeredWorkflows.values()) {
            for (const cond of workflow.on || []) {
                let isMatch = false;
                if (cond.type === 'push' || cond.type === 'pull_request') {
                    isMatch = this.gitEvaluator.matches(cond, payload);
                }
                else if (cond.type === 'file_change') {
                    isMatch = this.fileWatchEvaluator.matches(cond, payload.filePath || '');
                }
                else if (cond.type === 'schedule') {
                    isMatch = this.cronEvaluator.matches(cond);
                }
                else if (cond.type === 'event' && cond.events) {
                    isMatch = cond.events.includes(eventType);
                }
                if (isMatch && this.coordinator) {
                    await this.coordinator.executeWorkflow(workflow, payload.inputs || {});
                    break;
                }
            }
        }
    }
    setupEventListeners() {
        if (!this.eventBus)
            return;
        this.eventBus.on('workspace.file_changed', (payload) => {
            this.evaluateEvent('workspace.file_changed', payload);
        });
        this.eventBus.on('git.event', (payload) => {
            this.evaluateEvent('git.event', payload);
        });
    }
}
exports.TriggerManager = TriggerManager;
//# sourceMappingURL=trigger-manager.js.map