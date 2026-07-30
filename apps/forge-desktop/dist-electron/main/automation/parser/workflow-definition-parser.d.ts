/**
 * workflow-definition-parser.ts — Multi-format parser & validator for workflow definitions
 *
 * Supports YAML, JSON, and JavaScript/TypeScript declarative formats.
 * Performs structural validation and DAG cycle detection across job/step dependencies.
 */
import { AutomationWorkflowDefinition } from '../contracts/automation-types';
export declare class WorkflowDefinitionParser {
    /**
     * Parses raw string workflow content (YAML, JSON, or TS exports) into an AutomationWorkflowDefinition.
     */
    parse(content: string, workspaceRoot: string, format?: 'yaml' | 'json' | 'ts'): AutomationWorkflowDefinition;
    /**
     * Validates a workflow definition for schema compliance and dependency DAG cycle freedom.
     */
    validate(def: AutomationWorkflowDefinition): {
        valid: boolean;
        errors: string[];
    };
    private normalizeAndValidate;
    /**
     * Lightweight YAML line parser for key-value and simple nested block structures.
     */
    private parseSimpleYaml;
}
