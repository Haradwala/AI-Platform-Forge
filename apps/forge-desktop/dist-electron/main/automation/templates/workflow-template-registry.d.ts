/**
 * workflow-template-registry.ts — Pre-built workflow templates for Forge Automation
 */
import { WorkflowTemplateInfo } from '../contracts/automation-types';
export declare class WorkflowTemplateRegistry {
    private templates;
    constructor();
    private registerDefaults;
    register(template: WorkflowTemplateInfo): void;
    list(): WorkflowTemplateInfo[];
    get(id: string): WorkflowTemplateInfo | undefined;
}
