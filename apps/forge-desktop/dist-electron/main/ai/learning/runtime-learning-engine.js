"use strict";
/**
 * runtime-learning-engine.ts — Phase 25-28 Runtime Learning Engine
 *
 * Tracks per-workspace runtime execution outcomes, latency, and success rates.
 * Dynamically adjusts runtime selection weights as Forge learns over time.
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.RuntimeLearningEngine = void 0;
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
class RuntimeLearningEngine {
    getLearningPath(workspaceRoot) {
        const dir = path.join(workspaceRoot, '.forge', 'session');
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        return path.join(dir, 'learning.json');
    }
    /**
     * Logs a runtime execution outcome for a specific workspace.
     */
    async recordOutcome(record) {
        try {
            const filePath = this.getLearningPath(record.workspaceRoot);
            let stats = {
                workspaceRoot: record.workspaceRoot,
                totalExecutions: 0,
                runtimes: {},
            };
            if (fs.existsSync(filePath)) {
                const raw = fs.readFileSync(filePath, 'utf-8');
                stats = JSON.parse(raw || '{}');
            }
            if (!stats.runtimes)
                stats.runtimes = {};
            const current = stats.runtimes[record.runtimeId] || {
                successCount: 0,
                failCount: 0,
                avgDurationMs: 0,
                lastUsed: 0,
            };
            if (record.success) {
                current.successCount++;
            }
            else {
                current.failCount++;
            }
            current.avgDurationMs = Math.round((current.avgDurationMs * (current.successCount + current.failCount - 1) + record.durationMs) /
                (current.successCount + current.failCount));
            current.lastUsed = record.timestamp;
            stats.runtimes[record.runtimeId] = current;
            stats.totalExecutions++;
            fs.writeFileSync(filePath, JSON.stringify(stats, null, 2), 'utf-8');
        }
        catch (err) {
            console.error('[RuntimeLearningEngine] Failed to record outcome:', err.message);
        }
    }
    /**
     * Retrieves historical success rates per runtime for a workspace.
     */
    getSuccessRates(workspaceRoot) {
        try {
            const filePath = this.getLearningPath(workspaceRoot);
            if (!fs.existsSync(filePath))
                return {};
            const raw = fs.readFileSync(filePath, 'utf-8');
            const stats = JSON.parse(raw || '{}');
            const rates = {};
            for (const [runtimeId, data] of Object.entries(stats.runtimes || {})) {
                const total = data.successCount + data.failCount;
                if (total > 0) {
                    rates[runtimeId] = data.successCount / total;
                }
            }
            return rates;
        }
        catch (err) {
            return {};
        }
    }
}
exports.RuntimeLearningEngine = RuntimeLearningEngine;
//# sourceMappingURL=runtime-learning-engine.js.map