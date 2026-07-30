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
exports.ExecutionEngine = void 0;
const execution_budget_1 = require("./execution-budget");
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
class ExecutionEngine {
    graphEngine;
    scheduler;
    observer;
    workspaceService;
    logger;
    eventBus;
    activePlanId = null;
    abortController = null;
    journal = [];
    constructor(graphEngine, scheduler, observer, workspaceService, logger, eventBus) {
        this.graphEngine = graphEngine;
        this.scheduler = scheduler;
        this.observer = observer;
        this.workspaceService = workspaceService;
        this.logger = logger;
        this.eventBus = eventBus;
        this.observer.subscribe((event) => {
            this.logger.debug(`[ExecutionEngine] Observer event: ${event.type} for execution: ${event.executionId}`);
            if (event.type === 'execution:progress') {
                if (event.state === 'running') {
                    this.eventBus.emit('ai:task-started', {
                        taskId: event.taskId,
                        title: event.taskId,
                        planId: this.activePlanId || '',
                    });
                }
                else if (event.state === 'completed' || event.state === 'failed') {
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
    async executePlan(plan) {
        this.activePlanId = plan.id;
        this.abortController = new AbortController();
        const executionId = `exec-${plan.id}-${Date.now()}`;
        this.logger.info(`[ExecutionEngine] Starting execution for plan: ${plan.id} (${executionId})`);
        this.graphEngine.build(plan);
        const validation = this.graphEngine.validate();
        if (!validation.valid) {
            throw new Error(`Execution Graph Validation failed: ${validation.reason}`);
        }
        const budgetTracker = new execution_budget_1.ExecutionBudgetTracker({
            tokenBudget: 500000,
            timeBudget: 600,
            costBudget: 0.1,
            fileBudget: 20,
            retryBudget: 5,
        });
        const entry = {
            planId: plan.id,
            goal: plan.goal,
            startTime: new Date().toISOString(),
            tasksExecuted: [],
        };
        this.journal.push(entry);
        try {
            const results = await this.scheduler.schedule(this.graphEngine, budgetTracker, this.abortController.signal, executionId, plan.id);
            entry.endTime = new Date().toISOString();
            this.eventBus.emit('ai:plan-completed', { planId: plan.id, success: true });
            await this.saveJournalToWorkspace();
            return results;
        }
        catch (err) {
            entry.endTime = new Date().toISOString();
            this.eventBus.emit('ai:plan-completed', { planId: plan.id, success: false, error: err.message });
            await this.saveJournalToWorkspace();
            throw err;
        }
        finally {
            this.activePlanId = null;
            this.abortController = null;
        }
    }
    cancelActiveTask() {
        if (this.abortController) {
            this.abortController.abort();
            this.logger.info('[ExecutionEngine] Cancel active execution requested.');
        }
    }
    getJournal() {
        return this.journal;
    }
    async saveJournalToWorkspace() {
        const root = this.workspaceService.getRootPath();
        if (!root)
            return;
        try {
            const forgeDir = path.join(root, '.forge');
            if (!fs.existsSync(forgeDir)) {
                await fs.promises.mkdir(forgeDir, { recursive: true });
            }
            const journalFile = path.join(forgeDir, 'journal.json');
            await fs.promises.writeFile(journalFile, JSON.stringify(this.journal, null, 2), 'utf-8');
        }
        catch (err) {
            this.logger.error(`[ExecutionEngine] Failed to write journal log: ${err}`);
        }
    }
}
exports.ExecutionEngine = ExecutionEngine;
//# sourceMappingURL=execution-engine.js.map