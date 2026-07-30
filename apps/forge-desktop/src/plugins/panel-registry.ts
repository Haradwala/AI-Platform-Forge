import { IPanelContribution } from './interfaces';

export class PanelRegistry {
  private readonly panels = new Map<string, IPanelContribution>();

  register(panel: IPanelContribution): void {
    if (this.panels.has(panel.id)) {
      throw new Error(`PanelRegistry: Panel with ID "${panel.id}" is already registered.`);
    }
    this.panels.set(panel.id, panel);
  }

  getById(id: string): IPanelContribution | null {
    return this.panels.get(id) ?? null;
  }

  getAll(): IPanelContribution[] {
    return Array.from(this.panels.values()).sort((a, b) => {
      const orderA = a.order ?? 999;
      const orderB = b.order ?? 999;
      return orderA - orderB;
    });
  }

  unregister(id: string): void {
    this.panels.delete(id);
  }

  clear(): void {
    this.panels.clear();
  }
}

export const panelRegistry = new PanelRegistry();
