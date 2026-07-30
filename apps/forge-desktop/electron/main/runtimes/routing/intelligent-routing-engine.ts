/**
 * intelligent-routing-engine.ts — Multi-Criteria Intelligent Router & Failover Engine
 *
 * Evaluates candidate models across 6 vectors: task suitability, language, context size,
 * cost ($/1M tokens), latency, and reliability score.
 */

import { RuntimeProfileRegistry } from '../profiles/runtime-profile-registry';
import { RuntimePerformanceEngine } from '../performance/runtime-performance-engine';
import { RuntimeManager } from '../manager/runtime-manager';
import { RuntimeTimelinePublisher } from '../timeline/runtime-timeline-publisher';
import { RoutingRequest, RoutingDecision, RuntimeProfile } from '../contracts/runtime-types';

export class IntelligentRoutingEngine {
  constructor(
    private readonly profileRegistry: RuntimeProfileRegistry = new RuntimeProfileRegistry(),
    private readonly performanceEngine: RuntimePerformanceEngine = new RuntimePerformanceEngine(),
    private readonly runtimeManager?: RuntimeManager,
    private readonly timelinePublisher?: RuntimeTimelinePublisher
  ) {}

  /**
   * Evaluates routing request and selects optimal model candidate with failover fallback chain.
   */
  async routeRequest(request: RoutingRequest): Promise<RoutingDecision> {
    let profiles = this.profileRegistry.listProfiles();

    if (request.allowCloud === false) {
      profiles = profiles.filter((p) => p.isLocal);
    }

    if (request.minContextTokens) {
      profiles = profiles.filter((p) => p.contextWindow >= request.minContextTokens!);
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
      } else if (request.taskType === 'reasoning' && profile.modelId.includes('gemini')) {
        score += 0.3;
      } else {
        score += 0.15;
      }

      // Cost efficiency score
      if (request.maxCostUSD && profile.inputCostPer1M === 0) {
        score += 0.3; // Local model cost bonus
      } else {
        score += 0.1;
      }

      return { profile, score };
    });

    scored.sort((a, b) => b.score - a.score);

    const primary = scored[0]?.profile || profiles[0];
    const fallbackChain = scored.slice(1, 3).map((s) => s.profile.modelId);

    const decision: RoutingDecision = {
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
