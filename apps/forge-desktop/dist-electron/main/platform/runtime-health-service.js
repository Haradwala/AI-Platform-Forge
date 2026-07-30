"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RuntimeHealthService = void 0;
class RuntimeHealthService {
    kernel;
    id = 'RuntimeHealthService';
    version = '1.0.0';
    dependencies = [];
    health = 'healthy';
    status = 'stopped';
    startTime = Date.now();
    constructor(kernel) {
        this.kernel = kernel;
    }
    uptime() {
        return Date.now() - this.startTime;
    }
    metrics() {
        return {
            overallHealth: this.health,
        };
    }
    onStart() { }
    onRunning() { }
    onSuspend() { }
    onShutdown() { }
    checkHealth() {
        let overall = 'healthy';
        for (const service of this.kernel.getServices()) {
            if (service.id === this.id)
                continue;
            if (service.health === 'failed')
                return 'failed';
            if (service.health === 'degraded')
                overall = 'degraded';
            if (service.health === 'warning' && overall === 'healthy')
                overall = 'warning';
        }
        this.health = overall;
        return overall;
    }
}
exports.RuntimeHealthService = RuntimeHealthService;
//# sourceMappingURL=runtime-health-service.js.map