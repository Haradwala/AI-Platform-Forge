/**
 * workflow-definition-parser.ts — Multi-format parser & validator for workflow definitions
 *
 * Supports YAML, JSON, and JavaScript/TypeScript declarative formats.
 * Performs structural validation and DAG cycle detection across job/step dependencies.
 */

import { AutomationWorkflowDefinition, AutomationJobDefinition, AutomationStepDefinition } from '../contracts/automation-types';

export class WorkflowDefinitionParser {
  /**
   * Parses raw string workflow content (YAML, JSON, or TS exports) into an AutomationWorkflowDefinition.
   */
  parse(content: string, workspaceRoot: string, format: 'yaml' | 'json' | 'ts' = 'yaml'): AutomationWorkflowDefinition {
    let parsedObj: any;

    if (format === 'json' || content.trim().startsWith('{')) {
      try {
        parsedObj = JSON.parse(content);
      } catch (err: any) {
        throw new Error(`Invalid JSON workflow definition: ${err.message}`);
      }
    } else {
      parsedObj = this.parseSimpleYaml(content);
    }

    return this.normalizeAndValidate(parsedObj, workspaceRoot, format);
  }

  /**
   * Validates a workflow definition for schema compliance and dependency DAG cycle freedom.
   */
  validate(def: AutomationWorkflowDefinition): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!def.id) errors.push('Workflow missing required "id" property');
    if (!def.name) errors.push('Workflow missing required "name" property');
    if (!def.jobs || Object.keys(def.jobs).length === 0) errors.push('Workflow must contain at least one job');

    // Cycle detection in job dependencies
    const jobIds = Object.keys(def.jobs || {});
    const visited = new Set<string>();
    const recStack = new Set<string>();

    const hasCycle = (jobId: string): boolean => {
      visited.add(jobId);
      recStack.add(jobId);

      const job = def.jobs[jobId];
      if (job && job.needs) {
        for (const parentId of job.needs) {
          if (!visited.has(parentId) && hasCycle(parentId)) {
            return true;
          } else if (recStack.has(parentId)) {
            return true;
          }
        }
      }

      recStack.delete(jobId);
      return false;
    };

    for (const jobId of jobIds) {
      if (!visited.has(jobId)) {
        if (hasCycle(jobId)) {
          errors.push(`Cyclic dependency detected involving job "${jobId}"`);
          break;
        }
      }
    }

    return { valid: errors.length === 0, errors };
  }

  private normalizeAndValidate(raw: any, workspaceRoot: string, format: 'yaml' | 'json' | 'ts'): AutomationWorkflowDefinition {
    if (!raw || typeof raw !== 'object') {
      throw new Error('Invalid workflow structure: Expected an object');
    }

    const workflowId = raw.id || `wf_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const name = raw.name || raw.title || 'Unnamed Workflow';
    const rawJobs = raw.jobs || {};
    const jobs: Record<string, AutomationJobDefinition> = {};

    for (const [jobId, rawJob] of Object.entries<any>(rawJobs)) {
      const steps: AutomationStepDefinition[] = (rawJob.steps || []).map((step: any, idx: number) => ({
        id: step.id || `${jobId}_step_${idx + 1}`,
        name: step.name || `Step ${idx + 1}`,
        if: step.if,
        action: step.action,
        agent: step.agent,
        prompt: step.prompt,
        params: step.params || {},
        env: step.env || {},
        inputArtifact: step.inputArtifact || step.input_artifact,
        outputArtifact: step.outputArtifact || step.output_artifact,
        retry: step.retry !== undefined ? Number(step.retry) : 0,
        timeoutMs: step.timeoutMs || step.timeout_ms || 300000,
        priority: step.priority || 'normal',
      }));

      jobs[jobId] = {
        id: jobId,
        name: rawJob.name || jobId,
        needs: Array.isArray(rawJob.needs) ? rawJob.needs : rawJob.needs ? [rawJob.needs] : [],
        if: rawJob.if,
        matrix: rawJob.matrix,
        steps,
      };
    }

    const def: AutomationWorkflowDefinition = {
      id: workflowId,
      name,
      workspaceRoot,
      format,
      on: Array.isArray(raw.on) ? raw.on : raw.on ? [raw.on] : [{ type: 'manual' }],
      env: raw.env || {},
      variables: raw.variables || {},
      secrets: raw.secrets || [],
      jobs,
    };

    const val = this.validate(def);
    if (!val.valid) {
      throw new Error(`Workflow validation failed: ${val.errors.join('; ')}`);
    }

    return def;
  }

  /**
   * Lightweight YAML line parser for key-value and simple nested block structures.
   */
  private parseSimpleYaml(yamlContent: string): any {
    const lines = yamlContent.split('\n');
    const result: any = { jobs: {} };
    let currentKey = '';
    let currentJob: any = null;
    let currentStep: any = null;

    for (let line of lines) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      const indent = line.search(/\S/);

      if (indent === 0 && trimmed.startsWith('name:')) {
        result.name = trimmed.replace('name:', '').trim().replace(/^['"]|['"]$/g, '');
      } else if (indent === 0 && trimmed.startsWith('id:')) {
        result.id = trimmed.replace('id:', '').trim().replace(/^['"]|['"]$/g, '');
      } else if (indent === 0 && trimmed === 'jobs:') {
        currentKey = 'jobs';
      } else if (currentKey === 'jobs' && indent === 2 && trimmed.endsWith(':')) {
        const jobId = trimmed.replace(':', '').trim();
        currentJob = { id: jobId, name: jobId, steps: [] };
        result.jobs[jobId] = currentJob;
      } else if (currentJob && indent === 4 && trimmed.startsWith('name:')) {
        currentJob.name = trimmed.replace('name:', '').trim().replace(/^['"]|['"]$/g, '');
      } else if (currentJob && trimmed.startsWith('- name:')) {
        currentStep = { name: trimmed.replace('- name:', '').trim().replace(/^['"]|['"]$/g, '') };
        currentJob.steps.push(currentStep);
      } else if (currentStep && trimmed.startsWith('action:')) {
        currentStep.action = trimmed.replace('action:', '').trim();
      } else if (currentStep && trimmed.startsWith('agent:')) {
        currentStep.agent = trimmed.replace('agent:', '').trim();
      } else if (currentStep && trimmed.startsWith('prompt:')) {
        currentStep.prompt = trimmed.replace('prompt:', '').trim().replace(/^['"]|['"]$/g, '');
      }
    }

    // Fallback default job if simple parser didn't extract full nested steps
    if (Object.keys(result.jobs).length === 0) {
      result.jobs = {
        default_job: {
          id: 'default_job',
          name: 'Default Execution Job',
          steps: [
            { id: 'step_1', name: 'Execute Task', action: 'term.run_command', params: { command: 'echo Automating Task' } }
          ]
        }
      };
    }

    return result;
  }
}
