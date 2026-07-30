"use strict";
/**
 * runtime-scorer.ts — Phase 25-28 Multi-Factor Dynamic Runtime Scorer
 *
 * Scores candidate runtimes based on Capability, Availability, Health, Historical Success,
 * Latency, User Preference, and Offline/Local priority.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.RuntimeScorer = void 0;
class RuntimeScorer {
    scoreCandidates(request, candidates, historicalScores = {}) {
        return candidates
            .map((candidate) => {
            // 1. Capability score (0-30)
            let capabilityScore = 20;
            for (const cap of request.capabilities) {
                if (candidate.capabilities && candidate.capabilities[cap]) {
                    capabilityScore += 2;
                }
            }
            capabilityScore = Math.min(30, capabilityScore);
            // 2. Health score (0-20)
            let healthScore = 20;
            if (candidate.health === 'degraded')
                healthScore = 10;
            if (candidate.health === 'unhealthy' || !candidate.isAvailable)
                healthScore = 0;
            // 3. Latency score (0-15)
            let latencyScore = 15;
            const latency = candidate.latencyMs ?? 200;
            if (latency > 1500)
                latencyScore = 2;
            else if (latency > 800)
                latencyScore = 7;
            else if (latency > 400)
                latencyScore = 11;
            // 4. Historical success score (0-20)
            const histSuccessRate = historicalScores[candidate.id] ?? 0.85; // Default 85% success
            const historicalScore = Math.round(histSuccessRate * 20);
            // 5. User preference / suggested runtime score (0-15)
            let preferenceScore = 0;
            if (request.suggestedRuntime && candidate.id.includes(request.suggestedRuntime)) {
                preferenceScore = 15;
            }
            else if (request.userPreference && candidate.id.includes(request.userPreference)) {
                preferenceScore = 15;
            }
            // 6. Offline / Local bonus (0-10)
            let offlineScore = 0;
            if (request.requiresLocal && (candidate.id === 'ollama' || candidate.type === 'cli')) {
                offlineScore = 10;
            }
            const totalScore = capabilityScore + healthScore + latencyScore + historicalScore + preferenceScore + offlineScore;
            return {
                candidate,
                score: totalScore,
                breakdown: {
                    capabilityScore,
                    healthScore,
                    latencyScore,
                    historicalScore,
                    preferenceScore,
                    offlineScore,
                },
            };
        })
            .sort((a, b) => b.score - a.score);
    }
}
exports.RuntimeScorer = RuntimeScorer;
//# sourceMappingURL=runtime-scorer.js.map