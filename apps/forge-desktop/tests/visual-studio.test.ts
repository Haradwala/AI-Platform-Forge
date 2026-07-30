/**
 * visual-studio.test.ts — Unit Test Suite for Composable Modular Panel Grid Architecture
 */

import { describe, it, expect } from 'vitest';
import { useStudioStore } from '../src/store/useStudioStore';

describe('Personal OS Composable Panel Grid', () => {
  it('initializes with modular panels and execution nodes', () => {
    const state = useStudioStore.getState();
    expect(state.panels.length).toBeGreaterThan(0);
    expect(state.executionNodes.length).toBeGreaterThan(0);
    expect(state.executionNodes[0].agentRole).toBe('PlannerAgent');
  });

  it('toggles panel visibility and float state', () => {
    useStudioStore.getState().togglePanelVisibility('code-terminal');
    expect(useStudioStore.getState().panels.find((p) => p.id === 'code-terminal')?.isVisible).toBe(false);

    useStudioStore.getState().togglePanelFloat('agent-execution-graph');
    expect(useStudioStore.getState().panels.find((p) => p.id === 'agent-execution-graph')?.isFloating).toBe(true);
  });

  it('binds timeline events to the central event backbone', () => {
    useStudioStore.getState().addTimelineEvent({
      id: 'evt_test_1',
      type: 'agent.reasoning.step',
      subsystem: 'agent',
      timestamp: Date.now(),
      message: 'Test event',
    });

    expect(useStudioStore.getState().timelineEvents.length).toBe(1);
    expect(useStudioStore.getState().timelineEvents[0].type).toBe('agent.reasoning.step');
  });
});
