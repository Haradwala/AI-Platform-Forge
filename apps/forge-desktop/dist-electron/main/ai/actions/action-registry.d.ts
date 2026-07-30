/**
 * action-registry.ts — Phase 29 Engineering Action Registry
 *
 * Supports provider-based registration (registerProvider), action registration, lookup,
 * listing by category, and existence validation.
 */
import { ActionCategory, IAction, IActionProvider } from './action-types';
export declare class ActionRegistry {
    private actions;
    private providers;
    registerProvider(provider: IActionProvider): void;
    registerAction(action: IAction): void;
    unregisterAction(actionId: string): boolean;
    getAction(actionId: string): IAction | undefined;
    exists(actionId: string): boolean;
    listActions(): IAction[];
    listByCategory(category: ActionCategory): IAction[];
    getProviders(): IActionProvider[];
}
