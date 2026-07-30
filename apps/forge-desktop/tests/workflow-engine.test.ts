import { describe, it, expect } from 'vitest';
import { WorkflowEngine } from '../electron/main/ai/workflow/workflow-engine';

describe('Phase 25-28 Workflow Engine Suite', () => {
  it('decomposes build goal into build pipeline steps', () => {
    const engine = new WorkflowEngine();
    const wf = engine.createWorkflow('Build desktop app', '/tmp/test_workspace');

    expect(wf.goal).toBe('Build desktop app');
    expect(wf.steps.length).toBe(3);
    expect(wf.steps[0].name).toBe('Typecheck');
    expect(wf.steps[1].name).toBe('Lint & Verify');
    expect(wf.steps[2].name).toBe('Package & Build');
  });

  it('decomposes review goal into analysis audit pipeline', () => {
    const engine = new WorkflowEngine();
    const wf = engine.createWorkflow('Review code quality', '/tmp/test_workspace');

    expect(wf.steps.length).toBe(2);
    expect(wf.steps[0].name).toBe('Workspace Indexing');
    expect(wf.steps[1].name).toBe('Generate Code Audit');
  });

  it('creates single step workflow for default goals', () => {
    const engine = new WorkflowEngine();
    const wf = engine.createWorkflow('Add a new dark mode toggle component', '/tmp/test_workspace');

    expect(wf.steps.length).toBe(1);
    expect(wf.steps[0].name).toBe('Execute Goal');
  });
});
