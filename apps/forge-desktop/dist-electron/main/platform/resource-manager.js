"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResourceManager = void 0;
class ResourceManager {
    id = 'ResourceManager';
    version = '1.0.0';
    dependencies = [];
    health = 'healthy';
    status = 'stopped';
    ramUsage = 0;
    cpuUsage = 0;
    ptyCount = 0;
    isThrottled = false;
    startTime = Date.now();
    uptime() {
        return Date.now() - this.startTime;
    }
    metrics() {
        return {
            ramUsageMb: this.ramUsage,
            cpuUsagePercent: this.cpuUsage,
            ptyCount: this.ptyCount,
            isThrottled: this.isThrottled,
        };
    }
    onStart() {
        this.pollResources();
    }
    onRunning() { }
    onSuspend() { }
    onShutdown() { }
    pollResources() {
        const mem = process.memoryUsage();
        this.ramUsage = Math.round(mem.heapUsed / 1024 / 1024);
        this.cpuUsage = Math.round(Math.random() * 30);
        if (this.ramUsage > 500) {
            this.isThrottled = true;
            this.health = 'warning';
        }
        else {
            this.isThrottled = false;
            this.health = 'healthy';
        }
    }
    checkThrottle() {
        this.pollResources();
        return this.isThrottled;
    }
    registerPty() {
        this.ptyCount++;
    }
    unregisterPty() {
        if (this.ptyCount > 0)
            this.ptyCount--;
    }
}
exports.ResourceManager = ResourceManager;
//# sourceMappingURL=resource-manager.js.map