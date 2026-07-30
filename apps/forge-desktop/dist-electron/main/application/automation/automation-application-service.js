"use strict";
/**
 * automation-application-service.ts — Application Service for Engineering Automation Engine
 *
 * Single orchestration boundary for Renderer IPC and external consumers.
 * Manages declarative workflows, execution triggers, templates, and artifacts.
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
exports.AutomationApplicationService = void 0;
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const workflow_definition_parser_1 = require("../../automation/parser/workflow-definition-parser");
const workflow_template_registry_1 = require("../../automation/templates/workflow-template-registry");
const automation_artifact_store_1 = require("../../automation/artifacts/automation-artifact-store");
class AutomationApplicationService {
    coordinator;
    parser;
    triggerManager;
    templateRegistry;
    artifactStore;
    constructor(coordinator, parser = new workflow_definition_parser_1.WorkflowDefinitionParser(), triggerManager, templateRegistry = new workflow_template_registry_1.WorkflowTemplateRegistry(), artifactStore = new automation_artifact_store_1.AutomationArtifactStore()) {
        this.coordinator = coordinator;
        this.parser = parser;
        this.triggerManager = triggerManager;
        this.templateRegistry = templateRegistry;
        this.artifactStore = artifactStore;
    }
    async parseWorkflow(content, format = 'yaml') {
        return this.parser.parse(content, '', format);
    }
    async saveWorkflow(workspaceRoot, definition) {
        const dir = path.join(workspaceRoot, '.forge', 'workflows');
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        const ext = definition.format === 'json' ? 'json' : 'yaml';
        const filePath = path.join(dir, `${definition.id}.${ext}`);
        fs.writeFileSync(filePath, JSON.stringify(definition, null, 2));
        if (this.triggerManager) {
            this.triggerManager.registerWorkflow(definition);
        }
    }
    async listWorkflows(workspaceRoot) {
        const dir = path.join(workspaceRoot, '.forge', 'workflows');
        if (!fs.existsSync(dir)) {
            return [];
        }
        const files = fs.readdirSync(dir).filter((f) => f.endsWith('.yaml') || f.endsWith('.json') || f.endsWith('.yml'));
        const workflows = [];
        for (const file of files) {
            try {
                const content = fs.readFileSync(path.join(dir, file), 'utf-8');
                const format = file.endsWith('.json') ? 'json' : 'yaml';
                const parsed = this.parser.parse(content, workspaceRoot, format);
                workflows.push(parsed);
                if (this.triggerManager) {
                    this.triggerManager.registerWorkflow(parsed);
                }
            }
            catch (err) {
                // Skip invalid workflow files
            }
        }
        return workflows;
    }
    async runWorkflow(workspaceRoot, workflowId, inputs = {}) {
        const workflows = await this.listWorkflows(workspaceRoot);
        const target = workflows.find((w) => w.id === workflowId || w.name === workflowId);
        if (!target) {
            throw new Error(`Workflow "${workflowId}" not found in workspace`);
        }
        if (!this.coordinator) {
            throw new Error('AutomationCoordinator unavailable');
        }
        return this.coordinator.executeWorkflow(target, inputs);
    }
    async cancelExecution(executionId) {
        if (this.coordinator) {
            return this.coordinator.cancelExecution(executionId);
        }
        return false;
    }
    async getExecution(workspaceRoot, executionId) {
        if (this.coordinator) {
            return this.coordinator.getExecution(workspaceRoot, executionId);
        }
        return null;
    }
    async listExecutions(workspaceRoot) {
        if (this.coordinator) {
            return this.coordinator.listExecutions(workspaceRoot);
        }
        return [];
    }
    listTemplates() {
        return this.templateRegistry.list();
    }
    async getArtifacts(workspaceRoot, executionId) {
        return this.artifactStore.listArtifacts(workspaceRoot, executionId);
    }
}
exports.AutomationApplicationService = AutomationApplicationService;
//# sourceMappingURL=automation-application-service.js.map