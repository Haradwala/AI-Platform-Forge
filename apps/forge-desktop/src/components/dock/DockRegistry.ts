/**
 * DockRegistry.ts — Dynamic Panel Registration API for WorkbenchDock
 */

import React from 'react';

export interface DockPanelDefinition {
  id: string;
  title: string;
  iconName: string;
  component: React.ComponentType<any>;
  category?: 'terminal' | 'diagnostics' | 'ai' | 'tools' | 'health';
  badgeCount?: number;
}

class DockRegistryImpl {
  private panels = new Map<string, DockPanelDefinition>();

  register(panel: DockPanelDefinition): void {
    this.panels.set(panel.id, panel);
  }

  getById(id: string): DockPanelDefinition | undefined {
    return this.panels.get(id);
  }

  getAll(): DockPanelDefinition[] {
    return Array.from(this.panels.values());
  }
}

export const DockRegistry = new DockRegistryImpl();
