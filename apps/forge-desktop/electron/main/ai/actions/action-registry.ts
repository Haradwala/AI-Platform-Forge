/**
 * action-registry.ts — Phase 29 Engineering Action Registry
 *
 * Supports provider-based registration (registerProvider), action registration, lookup,
 * listing by category, and existence validation.
 */

import { ActionCategory, IAction, IActionProvider } from './action-types';

export class ActionRegistry {
  private actions: Map<string, IAction> = new Map();
  private providers: Map<string, IActionProvider> = new Map();

  registerProvider(provider: IActionProvider): void {
    this.providers.set(provider.id, provider);
    for (const action of provider.getActions()) {
      this.registerAction(action);
    }
  }

  registerAction(action: IAction): void {
    this.actions.set(action.metadata.id, action);
  }

  unregisterAction(actionId: string): boolean {
    return this.actions.delete(actionId);
  }

  getAction(actionId: string): IAction | undefined {
    return this.actions.get(actionId);
  }

  exists(actionId: string): boolean {
    return this.actions.has(actionId);
  }

  listActions(): IAction[] {
    return Array.from(this.actions.values());
  }

  listByCategory(category: ActionCategory): IAction[] {
    return Array.from(this.actions.values()).filter((a) => a.metadata.category === category);
  }

  getProviders(): IActionProvider[] {
    return Array.from(this.providers.values());
  }
}
