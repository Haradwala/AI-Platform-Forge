"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RuntimeRegistry = void 0;
class RuntimeRegistry {
    services = new Map();
    register(service) {
        if (this.services.has(service.id)) {
            throw new Error(`[RuntimeRegistry] Service already registered: ${service.id}`);
        }
        this.services.set(service.id, service);
    }
    unregister(id) {
        this.services.delete(id);
    }
    getService(id) {
        const service = this.services.get(id);
        if (!service) {
            throw new Error(`[RuntimeRegistry] Service not found: ${id}`);
        }
        return service;
    }
    getAll() {
        return Array.from(this.services.values());
    }
    getSortedServices() {
        const visited = new Set();
        const temp = new Set();
        const result = [];
        const visit = (id) => {
            if (temp.has(id)) {
                throw new Error(`[RuntimeRegistry] Circular dependency detected: ${id}`);
            }
            if (!visited.has(id)) {
                temp.add(id);
                const service = this.services.get(id);
                if (service) {
                    for (const dep of service.dependencies) {
                        visit(dep);
                    }
                }
                temp.delete(id);
                visited.add(id);
                const s = this.services.get(id);
                if (s)
                    result.push(s);
            }
        };
        for (const id of this.services.keys()) {
            visit(id);
        }
        return result;
    }
}
exports.RuntimeRegistry = RuntimeRegistry;
//# sourceMappingURL=runtime-registry.js.map