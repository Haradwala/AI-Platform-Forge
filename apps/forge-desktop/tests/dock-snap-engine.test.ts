import { describe, it, expect, beforeEach, vi } from 'vitest';
import { DockSnapEngine } from '../src/components/dock/DockSnapEngine';
import { DockPersistence } from '../src/components/dock/DockPersistence';
import { useDockStore } from '../src/components/dock/DockStore';
import { springStep } from '../src/components/dock/DockAnimations';

describe('Dock System — Snap Engine & Persistence & Store', () => {
  beforeEach(() => {
    useDockStore.setState({
      targetHeightPx: 280,
      actualHeightPx: 280,
      lastExpandedHeightPx: 280,
      snapPoint: 'quarter',
      dockMode: 'bottom',
      activeTabId: 'terminal',
      isDragging: false,
      isCollapsed: false,
    });
  });

  it('computes 6 discrete pixel snap targets for a 1000px viewport', () => {
    const targets = DockSnapEngine.getSnapTargets(1000);
    expect(targets).toHaveLength(6);
    expect(targets.map((t) => t.name)).toEqual([
      'hidden',
      'peek',
      'quarter',
      'half',
      'threeQuarter',
      'full',
    ]);
    expect(targets.find((t) => t.name === 'quarter')?.heightPx).toBe(250);
    expect(targets.find((t) => t.name === 'half')?.heightPx).toBe(500);
    expect(targets.find((t) => t.name === 'threeQuarter')?.heightPx).toBe(700);
  });

  it('snaps to nearest target based on position and drag velocity', () => {
    const vh = 1000;
    // Position near 480px, no velocity -> snaps to 500px (half)
    const snapNearHalf = DockSnapEngine.findNearestSnap(480, 0, vh);
    expect(snapNearHalf.name).toBe('half');

    // Upward flick velocity (+500px/s) near 260px -> snaps to next higher (half: 500px)
    const snapFlickUp = DockSnapEngine.findNearestSnap(260, 500, vh);
    expect(snapFlickUp.name).toBe('half');

    // Downward flick velocity (-500px/s) near 450px -> snaps to lower (quarter: 250px)
    const snapFlickDown = DockSnapEngine.findNearestSnap(450, -500, vh);
    expect(snapFlickDown.name).toBe('quarter');
  });

  it('springStep interpolates current height towards target height smoothly', () => {
    const { nextPx, settled } = springStep(100, 200, 0);
    expect(nextPx).toBeGreaterThan(100);
    expect(settled).toBe(false);
  });

  it('DockStore handles setSnapPoint and recalculates pixel height', () => {
    const store = useDockStore.getState();
    store.setSnapPoint('half', 1000);

    const updated = useDockStore.getState();
    expect(updated.snapPoint).toBe('half');
    expect(updated.targetHeightPx).toBe(500);
    expect(updated.isCollapsed).toBe(false);
  });

  it('DockStore handles toggleMaximize between quarter and 70% height', () => {
    const store = useDockStore.getState();
    store.setSnapPoint('quarter', 1000);

    store.toggleMaximize(1000);
    expect(useDockStore.getState().snapPoint).toBe('threeQuarter');

    useDockStore.getState().toggleMaximize(1000);
    expect(useDockStore.getState().snapPoint).toBe('quarter');
  });

  it('DockPersistence saves and restores state correctly', () => {
    const mockState = {
      targetHeightPx: 450,
      lastExpandedHeightPx: 450,
      snapPoint: 'half',
      dockMode: 'floating' as const,
      activeTabId: 'health',
      isCollapsed: false,
    };

    DockPersistence.save(mockState);
    const loaded = DockPersistence.load();
    expect(loaded).toEqual(mockState);
  });
});
