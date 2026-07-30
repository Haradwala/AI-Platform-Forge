import { describe, it, expect, beforeEach } from 'vitest';
import { PanelRegistry } from '../src/plugins/panel-registry';
import React from 'react';

describe('PanelRegistry', () => {
  let registry: PanelRegistry;
  const dummyComponent = () => React.createElement('div');

  beforeEach(() => {
    registry = new PanelRegistry();
  });

  it('registers and retrieves panel metadata', () => {
    registry.register({
      id: 'panel1',
      title: 'Panel 1',
      icon: 'folder',
      component: dummyComponent,
      order: 1,
    });

    const panel = registry.getById('panel1');
    expect(panel).not.toBeNull();
    expect(panel!.title).toBe('Panel 1');
  });

  it('throws error when registering duplicate panel IDs', () => {
    registry.register({ id: 'panel1', title: 'Panel 1', icon: 'folder', component: dummyComponent });
    expect(() =>
      registry.register({ id: 'panel1', title: 'Dup Panel', icon: 'folder', component: dummyComponent })
    ).toThrow('already registered');
  });

  it('returns all registered panels in correct order', () => {
    registry.register({ id: 'p2', title: 'P2', icon: 'i', component: dummyComponent, order: 2 });
    registry.register({ id: 'p1', title: 'P1', icon: 'i', component: dummyComponent, order: 1 });
    registry.register({ id: 'p3', title: 'P3', icon: 'i', component: dummyComponent, order: 3 });

    const all = registry.getAll();
    expect(all).toHaveLength(3);
    expect(all[0].id).toBe('p1');
    expect(all[1].id).toBe('p2');
    expect(all[2].id).toBe('p3');
  });

  it('unregister() removes panel from registry', () => {
    registry.register({ id: 'panel1', title: 'P1', icon: 'i', component: dummyComponent });
    expect(registry.getById('panel1')).not.toBeNull();
    registry.unregister('panel1');
    expect(registry.getById('panel1')).toBeNull();
  });

  it('clear() empties all registrations', () => {
    registry.register({ id: 'panel1', title: 'P1', icon: 'i', component: dummyComponent });
    registry.clear();
    expect(registry.getAll()).toHaveLength(0);
  });
});
