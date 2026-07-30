"use strict";
/**
 * automation-coordinator.ts — Domain Coordinator for Execution Lifecycle & State Snapshots
 *
 * Owns workflow execution lifecycle, queue state, execution registry, cancellation APIs,
 * and persistence of execution snapshots to `.forge/executions/<executionId>.json`.
 */
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
exports.AutomationCoordinator = void 0;
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const automation_resource_scheduler_1 = require("../scheduler/automation-resource-scheduler");
const automation_artifact_store_1 = require("../artifacts/automation-artifact-store");
class AutomationCoordinator {
    pipelineRunner;
    resourceScheduler;
    artifactStore;
    activeExecutions = new Map();
    constructor(pipelineRunner, resourceScheduler = new automation_resource_scheduler_1.AutomationResourceScheduler(), artifactStore = new automation_artifact_store_1.AutomationArtifactStore()) {
        this.pipelineRunner = pipelineRunner;
        this.resourceScheduler = resourceScheduler;
        this.artifactStore = artifactStore;
    }
    /**
     * Enqueues and coordinates the execution of a workflow pipeline.
     */
    async executeWorkflow(definition, inputs = {}) {
        const executionPromise = this.pipelineRunner.executePipeline(definition, inputs);
        // Track in active executions memory map
        executionPromise.then((exec) => {
            this.activeExecutions.set(exec.id, exec);
            this.persistExecution(exec);
        });
        const result = await executionPromise;
        this.activeExecutions.set(result.id, result);
        this.persistExecution(result);
        return result;
    }
    /**
     * Cancels a running workflow pipeline execution.
     */
    async cancelExecution(executionId) {
        const active = this.activeExecutions.get(executionId);
        if (active) {
            active.status = 'CANCELLED';
            this.resourceScheduler.cancelExecutionSlots(executionId);
            this.persistExecution(active);
            return true;
        }
        return false;
    }
    /**
     * Gets an execution by ID from active memory or snapshot storage.
     */
    async getExecution(workspaceRoot, executionId) {
        if (this.activeExecutions.has(executionId)) {
            return this.activeExecutions.get(executionId);
        }
        const filePath = path.join(workspaceRoot, '.forge', 'executions', `${executionId}.json`);
        if (fs.existsSync(filePath)) {
            try {
                const raw = fs.readFileSync(filePath, 'utf-8');
                return JSON.parse(raw);
            }
            catch (err) {
                return null;
            }
        }
        return null;
    }
    /**
     * Lists all execution snapshots stored in `.forge/executions/`.
     */
    async listExecutions(workspaceRoot) {
        const dir = path.join(workspaceRoot, '.forge', 'executions');
        if (!fs.existsSync(dir)) {
            return Array.from(this.activeExecutions.values());
        }
        const files = fs.readdirSync(dir).filter((f) => f.endsWith('.json'));
        const stored = [];
        for (const file of files) {
            try {
                const raw = fs.readFileSync(path.join(dir, file), 'utf-8');
                stored.push(JSON.parse(raw));
            }
            catch (err) {
                // Skip unparseable files
            }
        }
        // Merge memory and stored executions
        const map = new Map();
        stored.forEach((e) => map.set(e.id, e));
        this.activeExecutions.forEach((e) => map.set(e.id, e));
        return Array.from(map.values()).sort((a, b) => b.startTime - a.startTime);
    }
    persistExecution(execution) {
        try {
            const dir = path.join(execution.workspaceRoot, '.forge', 'executions');
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir, { recursive: true });
            }
            fs.writeFileSync(path.join(dir, `${execution.id}.json`), JSON.stringify(execution, null, 2));
        }
        catch (err) {
            // Non-blocking write error
        }
    }
}
exports.AutomationCoordinator = AutomationCoordinator;
//# sourceMappingURL=automation-coordinator.js.map