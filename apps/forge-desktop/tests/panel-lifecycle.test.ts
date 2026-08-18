import { describe, it, expect, vi, beforeEach } from 'vitest';
import { PanelLifecycleRegistryImpl } from '../src/components/dock/PanelLifecycleRegistry';
import { PanelState } from '../src/components/dock/PanelLifecycleTypes';

describe('Panel Lifecycle System', () => {
  let registry: PanelLifecycleRegistryImpl;

  beforeEach(() => {
    registry = new PanelLifecycleRegistryImpl();
  });

  it('registers panel lifecycle and defaults to SUSPENDED state', () => {
    registry.register('terminal', {});
    expect(registry.getState('terminal')).toBe(PanelState.SUSPENDED);
  });

  it('transitions state idempotently on resume() and suspend()', async () => {
    const resumeFn = vi.fn();
    const suspendFn = vi.fn();

    registry.register('terminal', { resume: resumeFn, suspend: suspendFn });

    // Initial Resume
    await registry.resume('terminal');
    expect(registry.getState('terminal')).toBe(PanelState.ACTIVE);
    expect(resumeFn).toHaveBeenCalledTimes(1);

    // Duplicate Resume — Should be ignored idempotently
    await registry.resume('terminal');
    expect(resumeFn).toHaveBeenCalledTimes(1);

    // Suspend
    await registry.suspend('terminal');
    expect(registry.getState('terminal')).toBe(PanelState.SUSPENDED);
    expect(suspendFn).toHaveBeenCalledTimes(1);

    // Duplicate Suspend — Should be ignored idempotently
    await registry.suspend('terminal');
    expect(suspendFn).toHaveBeenCalledTimes(1);
  });

  it('handles dispose() idempotently and cleans up callbacks', async () => {
    const disposeFn = vi.fn();
    registry.register('health', { dispose: disposeFn });

    await registry.dispose('health');
    expect(registry.getState('health')).toBe(PanelState.DISPOSED);
    expect(disposeFn).toHaveBeenCalledTimes(1);

    // Duplicate Dispose — Should be ignored idempotently
    await registry.dispose('health');
    expect(disposeFn).toHaveBeenCalledTimes(1);
  });

  it('disposes all registered panels on disposeAll()', async () => {
    const d1 = vi.fn();
    const d2 = vi.fn();

    registry.register('panel1', { dispose: d1 });
    registry.register('panel2', { dispose: d2 });

    await registry.disposeAll();

    expect(registry.getState('panel1')).toBe(PanelState.DISPOSED);
    expect(registry.getState('panel2')).toBe(PanelState.DISPOSED);
    expect(d1).toHaveBeenCalledTimes(1);
    expect(d2).toHaveBeenCalledTimes(1);
  });
});
