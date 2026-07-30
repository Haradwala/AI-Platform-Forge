"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MemoryRegistry = void 0;
class MemoryRegistry {
    records = new Map();
    policies = new Map();
    constructor() {
        this.policies.set('conversation', { retention: 100, priority: 'normal', persistence: false });
        this.policies.set('workspace', { retention: 1000, priority: 'high', persistence: true });
        this.policies.set('decision', { retention: 500, priority: 'high', persistence: true });
        this.policies.set('pattern', { retention: 200, priority: 'normal', persistence: true });
        this.policies.set('tool', { retention: 100, priority: 'low', persistence: false });
        this.policies.set('error', { retention: 300, priority: 'normal', persistence: false });
        this.policies.set('preference', { retention: 50, priority: 'high', persistence: true });
        this.policies.set('session', { retention: 10, priority: 'low', persistence: false });
    }
    addRecord(record) {
        if (!this.records.has(record.type)) {
            this.records.set(record.type, []);
        }
        const list = this.records.get(record.type);
        list.push(record);
        const policy = this.policies.get(record.type);
        if (policy && list.length > policy.retention) {
            list.shift();
        }
    }
    getRecords(type) {
        return this.records.get(type) || [];
    }
    clear(type) {
        if (type) {
            this.records.delete(type);
        }
        else {
            this.records.clear();
        }
    }
}
exports.MemoryRegistry = MemoryRegistry;
//# sourceMappingURL=memory-registry.js.map