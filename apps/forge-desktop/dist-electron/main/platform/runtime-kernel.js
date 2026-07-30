"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RuntimeKernel = void 0;
const runtime_registry_1 = require("./runtime-registry");
class RuntimeKernel {
    registry = new runtime_registry_1.RuntimeRegistry();
    started = false;
    register(service) {
        this.registry.register(service);
        if (this.started) {
            Promise.resolve(service.onStart()).then(() => {
                service.status = 'running';
                service.onRunning();
            });
        }
    }
    unregister(id) {
        try {
            const service = this.registry.getService(id);
            if (service) {
                service.onShutdown();
                service.status = 'stopped';
            }
        }
        catch {
            // Ignored
        }
        this.registry.unregister(id);
    }
    getService(id) {
        return this.registry.getService(id);
    }
    getServices() {
        return this.registry.getAll();
    }
    async start() {
        if (this.started)
            return;
        const sorted = this.registry.getSortedServices();
        for (const service of sorted) {
            service.status = 'starting';
            try {
                await service.onStart();
                service.status = 'running';
                await service.onRunning();
            }
            catch (err) {
                service.status = 'error';
                service.health = 'failed';
                throw err;
            }
        }
        this.started = true;
    }
    async stop() {
        if (!this.started)
            return;
        const sorted = this.registry.getSortedServices().reverse();
        for (const service of sorted) {
            service.status = 'suspended';
            try {
                await service.onSuspend();
                await service.onShutdown();
                service.status = 'stopped';
            }
            catch (err) {
                service.status = 'error';
                service.health = 'failed';
            }
        }
        this.started = false;
    }
    diagnostics() {
        return {
            started: this.started,
            timestamp: new Date().toISOString(),
            services: this.registry.getAll().map((s) => ({
                id: s.id,
                version: s.version,
                health: s.health,
                status: s.status,
                dependencies: s.dependencies,
                metrics: s.metrics(),
            })),
        };
    }
}
exports.RuntimeKernel = RuntimeKernel;
//# sourceMappingURL=runtime-kernel.js.map