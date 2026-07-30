/**
 * automation-application-service.ts — Application Service for Engineering Automation Engine
 *
 * Single orchestration boundary for Renderer IPC and external consumers.
 * Manages declarative workflows, execution triggers, templates, and artifacts.
 */

import * as fs from 'fs';
import * as path from 'path';
import {
  AutomationWorkflowDefinition,
  PipelineExecution,
  WorkflowTemplateInfo,
  AutomationArtifact,
} from '../../automation/contracts/automation-types';
import { WorkflowDefinitionParser } from '../../automation/parser/workflow-definition-parser';
import { AutomationCoordinator } from '../../automation/coordinator/automation-coordinator';
import { TriggerManager } from '../../automation/triggers/trigger-manager';
import { WorkflowTemplateRegistry } from '../../automation/templates/workflow-template-registry';
import { AutomationArtifactStore } from '../../automation/artifacts/automation-artifact-store';

export interface IAutomationApplicationService {
  parseWorkflow(content: string, format?: 'yaml' | 'json' | 'ts'): Promise<AutomationWorkflowDefinition>;
  saveWorkflow(workspaceRoot: string, definition: AutomationWorkflowDefinition): Promise<void>;
  listWorkflows(workspaceRoot: string): Promise<AutomationWorkflowDefinition[]>;
  runWorkflow(workspaceRoot: string, workflowId: string, inputs?: Record<string, any>): Promise<PipelineExecution>;
  cancelExecution(executionId: string): Promise<boolean>;
  getExecution(workspaceRoot: string, executionId: string): Promise<PipelineExecution | null>;
  listExecutions(workspaceRoot: string): Promise<PipelineExecution[]>;
  listTemplates(): WorkflowTemplateInfo[];
  getArtifacts(workspaceRoot: string, executionId: string): Promise<AutomationArtifact[]>;
}

export class AutomationApplicationService implements IAutomationApplicationService {
  constructor(
    private readonly coordinator?: AutomationCoordinator,
    private readonly parser: WorkflowDefinitionParser = new WorkflowDefinitionParser(),
    private readonly triggerManager?: TriggerManager,
    private readonly templateRegistry: WorkflowTemplateRegistry = new WorkflowTemplateRegistry(),
    private readonly artifactStore: AutomationArtifactStore = new AutomationArtifactStore()
  ) {}

  async parseWorkflow(content: string, format: 'yaml' | 'json' | 'ts' = 'yaml'): Promise<AutomationWorkflowDefinition> {
    return this.parser.parse(content, '', format);
  }

  async saveWorkflow(workspaceRoot: string, definition: AutomationWorkflowDefinition): Promise<void> {
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

  async listWorkflows(workspaceRoot: string): Promise<AutomationWorkflowDefinition[]> {
    const dir = path.join(workspaceRoot, '.forge', 'workflows');
    if (!fs.existsSync(dir)) {
      return [];
    }

    const files = fs.readdirSync(dir).filter((f) => f.endsWith('.yaml') || f.endsWith('.json') || f.endsWith('.yml'));
    const workflows: AutomationWorkflowDefinition[] = [];

    for (const file of files) {
      try {
        const content = fs.readFileSync(path.join(dir, file), 'utf-8');
        const format = file.endsWith('.json') ? 'json' : 'yaml';
        const parsed = this.parser.parse(content, workspaceRoot, format);
        workflows.push(parsed);
        if (this.triggerManager) {
          this.triggerManager.registerWorkflow(parsed);
        }
      } catch (err) {
        // Skip invalid workflow files
      }
    }

    return workflows;
  }

  async runWorkflow(workspaceRoot: string, workflowId: string, inputs: Record<string, any> = {}): Promise<PipelineExecution> {
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

  async cancelExecution(executionId: string): Promise<boolean> {
    if (this.coordinator) {
      return this.coordinator.cancelExecution(executionId);
    }
    return false;
  }

  async getExecution(workspaceRoot: string, executionId: string): Promise<PipelineExecution | null> {
    if (this.coordinator) {
      return this.coordinator.getExecution(workspaceRoot, executionId);
    }
    return null;
  }

  async listExecutions(workspaceRoot: string): Promise<PipelineExecution[]> {
    if (this.coordinator) {
      return this.coordinator.listExecutions(workspaceRoot);
    }
    return [];
  }

  listTemplates(): WorkflowTemplateInfo[] {
    return this.templateRegistry.list();
  }

  async getArtifacts(workspaceRoot: string, executionId: string): Promise<AutomationArtifact[]> {
    return this.artifactStore.listArtifacts(workspaceRoot, executionId);
  }
}
