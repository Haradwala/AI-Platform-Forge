/**
 * automation-application-service.ts — Application Service for Engineering Automation Engine
 *
 * Single orchestration boundary for Renderer IPC and external consumers.
 * Manages declarative workflows, execution triggers, templates, and artifacts.
 */
import { AutomationWorkflowDefinition, PipelineExecution, WorkflowTemplateInfo, AutomationArtifact } from '../../automation/contracts/automation-types';
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
export declare class AutomationApplicationService implements IAutomationApplicationService {
    private readonly coordinator?;
    private readonly parser;
    private readonly triggerManager?;
    private readonly templateRegistry;
    private readonly artifactStore;
    constructor(coordinator?: AutomationCoordinator | undefined, parser?: WorkflowDefinitionParser, triggerManager?: TriggerManager | undefined, templateRegistry?: WorkflowTemplateRegistry, artifactStore?: AutomationArtifactStore);
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
