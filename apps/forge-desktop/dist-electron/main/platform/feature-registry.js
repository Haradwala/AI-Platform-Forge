"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FeatureRegistry = void 0;
class FeatureRegistry {
    id = 'FeatureRegistry';
    version = '1.0.0';
    dependencies = [];
    health = 'healthy';
    status = 'stopped';
    features = new Map();
    startTime = Date.now();
    uptime() {
        return Date.now() - this.startTime;
    }
    metrics() {
        return {
            featuresCount: this.features.size,
        };
    }
    onStart() {
        this.register({
            id: 'ai.chat',
            description: 'Interact with AI assistant models via chat logs panels',
            stage: 'Stable',
        });
        this.register({
            id: 'ai.planning',
            description: 'Generates multi-task plans for coding tasks',
            stage: 'Experimental',
        });
        this.register({
            id: 'dock.floating-windows',
            description: 'Detach panels into floating browser window sessions',
            stage: 'Preview',
        });
    }
    onRunning() { }
    onSuspend() { }
    onShutdown() { }
    register(feature) {
        this.features.set(feature.id, feature);
    }
    isEnabled(id) {
        const f = this.features.get(id);
        if (!f)
            return false;
        return f.stage !== 'Disabled';
    }
    getFeature(id) {
        return this.features.get(id);
    }
    getAll() {
        return Array.from(this.features.values());
    }
}
exports.FeatureRegistry = FeatureRegistry;
//# sourceMappingURL=feature-registry.js.map