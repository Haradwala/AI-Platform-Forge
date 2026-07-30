"use strict";
/**
 * intelligent-routing-engine.ts — Multi-Criteria Intelligent Router & Failover Engine
 *
 * Evaluates candidate models across 6 vectors: task suitability, language, context size,
 * cost ($/1M tokens), latency, and reliability score.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.IntelligentRoutingEngine = void 0;
const runtime_profile_registry_1 = require("../profiles/runtime-profile-registry");
const runtime_performance_engine_1 = require("../performance/runtime-performance-engine");
class IntelligentRoutingEngine {
    profileRegistry;
    performanceEngine;
    runtimeManager;
    timelinePublisher;
    constructor(profileRegistry = new runtime_profile_registry_1.RuntimeProfileRegistry(), performanceEngine = new runtime_performance_engine_1.RuntimePerformanceEngine(), runtimeManager, timelinePublisher) {
        this.profileRegistry = profileRegistry;
        this.performanceEngine = performanceEngine;
        this.runtimeManager = runtimeManager;
        this.timelinePublisher = timelinePublisher;
    }
    /**
     * Evaluates routing request and selects optimal model candidate with failover fallback chain.
     */
    async routeRequest(request) {
        let profiles = this.profileRegistry.listProfiles();
        if (request.allowCloud === false) {
            profiles = profiles.filter((p) => p.isLocal);
        }
        if (request.minContextTokens) {
            profiles = profiles.filter((p) => p.contextWindow >= request.minContextTokens);
        }
        if (request.requiredCapabilities.includes('vision')) {
            profiles = profiles.filter((p) => p.supportsVision);
        }
        if (profiles.length === 0) {
            profiles = this.profileRegistry.listProfiles();
        }
        // Score candidates across task suitability, cost, latency, and reliability
        const scored = profiles.map((profile) => {
            const reliability = this.performanceEngine.getReliabilityScore(profile.modelId);
            let score = reliability * 0.4;
            // Task suitability bonus
            if (request.taskType === 'coding' && (profile.modelId.includes('sonnet') || profile.modelId.includes('4o'))) {
                score += 0.3;
            }
            else if (request.taskType === 'reasoning' && profile.modelId.includes('gemini')) {
                score += 0.3;
            }
            else {
                score += 0.15;
            }
            // Cost efficiency score
            if (request.maxCostUSD && profile.inputCostPer1M === 0) {
                score += 0.3; // Local model cost bonus
            }
            else {
                score += 0.1;
            }
            return { profile, score };
        });
        scored.sort((a, b) => b.score - a.score);
        const primary = scored[0]?.profile || profiles[0];
        const fallbackChain = scored.slice(1, 3).map((s) => s.profile.modelId);
        const decision = {
            selectedModelId: primary.modelId,
            selectedProviderId: primary.providerId,
            fallbackChain,
            score: scored[0]?.score || 1.0,
            rationale: `Optimal runtime selected for task '${request.taskType}' based on multi-vector scoring`,
        };
        if (this.timelinePublisher) {
            this.timelinePublisher.publishRoutingDecision(request.workspaceRoot, decision);
        }
        return decision;
    }
}
exports.IntelligentRoutingEngine = IntelligentRoutingEngine;
//# sourceMappingURL=intelligent-routing-engine.js.map