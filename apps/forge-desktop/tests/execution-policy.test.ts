import { describe, it, expect } from 'vitest';
import { ExecutionPolicyRegistry } from '../electron/main/ai/execution/execution-policy-registry';

describe('ExecutionPolicyRegistry', () => {
  it('enforces readonly tool constraints', () => {
    const registry = new ExecutionPolicyRegistry();
    const result = registry.validate('readonly', 'write_file', { targetFile: 'test.ts' }, '/root');
    expect(result.allowed).toBe(false);
    expect(result.reason).toContain('readonly');
  });

  it('permits read actions under readonly policy', () => {
    const registry = new ExecutionPolicyRegistry();
    const result = registry.validate('readonly', 'read_file', { path: 'test.ts' }, '/root');
    expect(result.allowed).toBe(true);
    expect(result.action).toBe('execute');
  });

  it('enforces workspace boundary paths under workspace-only policy', () => {
    const registry = new ExecutionPolicyRegistry();
    const result = registry.validate('workspace-only', 'write_file', { TargetFile: 'C:/other/file.ts' }, 'C:/root');
    expect(result.allowed).toBe(false);
    expect(result.reason).toContain('workspace-only');
  });

  it('returns action mock under dry-run policy', () => {
    const registry = new ExecutionPolicyRegistry();
    const result = registry.validate('dry-run', 'write_file', { TargetFile: '/root/test.ts' }, '/root');
    expect(result.allowed).toBe(true);
    expect(result.action).toBe('mock');
  });
});
