"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServiceScope = void 0;
const errors_1 = require("./errors");
/**
 * ServiceScope — provides a named resolution context where scoped services
 * live as singletons. When the scope is disposed, all scoped instances are
 * destroyed in reverse-creation order.
 */
class ServiceScope {
    name;
    instances = new Map();
    creationOrder = [];
    descriptors;
    singletonInstances;
    disposed = false;
    constructor(name, descriptors, singletonInstances) {
        this.name = name;
        this.descriptors = descriptors;
        this.singletonInstances = singletonInstances;
    }
    // ── IServiceResolver ───────────────────────────────────────────────────────
    resolve(token) {
        this.assertNotDisposed();
        // Singletons are always resolved from the parent container
        const singleton = this.singletonInstances.get(token);
        if (singleton !== undefined)
            return singleton;
        const descriptor = this.descriptors.get(token);
        if (!descriptor) {
            throw new errors_1.UnregisteredServiceError(token, `scope "${this.name}"`);
        }
        // Scoped — return scope-local instance if already created
        if (descriptor.lifetime === 'scoped') {
            if (this.instances.has(token)) {
                return this.instances.get(token);
            }
            const instance = descriptor.factory(this);
            this.instances.set(token, instance);
            this.creationOrder.push(token);
            return instance;
        }
        // Transient — new instance each time
        if (descriptor.lifetime === 'transient') {
            return descriptor.factory(this);
        }
        throw new errors_1.UnregisteredServiceError(token, `scope "${this.name}" (unknown lifetime)`);
    }
    tryResolve(token) {
        try {
            return this.resolve(token);
        }
        catch {
            return null;
        }
    }
    // ── Dispose ───────────────────────────────────────────────────────────────
    async dispose() {
        if (this.disposed)
            return;
        this.disposed = true;
        // Dispose in reverse creation order
        const reversed = [...this.creationOrder].reverse();
        for (const token of reversed) {
            const instance = this.instances.get(token);
            const descriptor = this.descriptors.get(token);
            if (instance !== undefined && descriptor?.dispose) {
                try {
                    await descriptor.dispose(instance);
                }
                catch (err) {
                    console.error(`[ServiceScope "${this.name}"] Error disposing "${descriptor.name}":`, err);
                }
            }
        }
        this.instances.clear();
        this.creationOrder.length = 0;
    }
    // ── Helpers ───────────────────────────────────────────────────────────────
    assertNotDisposed() {
        if (this.disposed) {
            throw new Error(`ServiceScope "${this.name}" has already been disposed.`);
        }
    }
}
exports.ServiceScope = ServiceScope;
//# sourceMappingURL=service-scope.js.map