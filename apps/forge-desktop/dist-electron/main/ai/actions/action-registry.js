"use strict";
/**
 * action-registry.ts — Phase 29 Engineering Action Registry
 *
 * Supports provider-based registration (registerProvider), action registration, lookup,
 * listing by category, and existence validation.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActionRegistry = void 0;
class ActionRegistry {
    actions = new Map();
    providers = new Map();
    registerProvider(provider) {
        this.providers.set(provider.id, provider);
        for (const action of provider.getActions()) {
            this.registerAction(action);
        }
    }
    registerAction(action) {
        this.actions.set(action.metadata.id, action);
    }
    unregisterAction(actionId) {
        return this.actions.delete(actionId);
    }
    getAction(actionId) {
        return this.actions.get(actionId);
    }
    exists(actionId) {
        return this.actions.has(actionId);
    }
    listActions() {
        return Array.from(this.actions.values());
    }
    listByCategory(category) {
        return Array.from(this.actions.values()).filter((a) => a.metadata.category === category);
    }
    getProviders() {
        return Array.from(this.providers.values());
    }
}
exports.ActionRegistry = ActionRegistry;
//# sourceMappingURL=action-registry.js.map