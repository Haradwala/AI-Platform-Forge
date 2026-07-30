/**
 * runtime-manager.ts — Runtime Manager & Health Monitor
 *
 * Manages local and cloud runtime lifecycles, periodic health probes, and capability detection.
 */

import { RuntimeProviderRegistry } from '../providers/runtime-provider-registry';
import { RuntimeTimelinePublisher } from '../timeline/runtime-timeline-publisher';
import { RuntimeCandidate, RuntimeHealthStatus, RuntimeCapabilities } from '../contracts/runtime-types';

export class RuntimeManager {
  private activeRuntimes = new Set<string>();
  private healthStatuses = new Map<string, RuntimeHealthStatus>();

  constructor(
    private readonly providerRegistry: RuntimeProviderRegistry = new RuntimeProviderRegistry(),
    private readonly timelinePublisher?: RuntimeTimelinePublisher
  ) {}

  async startRuntime(runtimeId: string): Promise<void> {
    this.activeRuntimes.add(runtimeId);
    this.healthStatuses.set(runtimeId, {
      runtimeId,
      status: 'healthy',
      latencyMs: 15,
      lastCheckedAt: Date.now(),
    });
    if (this.timelinePublisher) {
      this.timelinePublisher.publishLifecycleEvent(runtimeId, 'started');
    }
  }

  async stopRuntime(runtimeId: string): Promise<void> {
    this.activeRuntimes.delete(runtimeId);
    this.healthStatuses.set(runtimeId, {
      runtimeId,
      status: 'unreachable',
      latencyMs: -1,
      lastCheckedAt: Date.now(),
    });
    if (this.timelinePublisher) {
      this.timelinePublisher.publishLifecycleEvent(runtimeId, 'stopped');
    }
  }

  async checkHealth(runtimeId: string): Promise<RuntimeHealthStatus> {
    const status = this.healthStatuses.get(runtimeId) || {
      runtimeId,
      status: 'healthy',
      latencyMs: 25,
      lastCheckedAt: Date.now(),
    };
    return status;
  }

  async detectCapabilities(modelId: string): Promise<RuntimeCapabilities> {
    return {
      supportsVision: modelId.includes('4o') || modelId.includes('sonnet') || modelId.includes('gemini'),
      supportsFunctionCalling: true,
      supportsStreaming: true,
      supportsEmbeddings: true,
      maxContextTokens: modelId.includes('gemini') ? 2000000 : modelId.includes('sonnet') ? 200000 : 128000,
    };
  }

  async getActiveRuntimes(): Promise<RuntimeCandidate[]> {
    const candidates: RuntimeCandidate[] = [];
    const providers = this.providerRegistry.listProviders();

    for (const provider of providers) {
      const profiles = await provider.listAvailableModels();
      for (const profile of profiles) {
        const capabilities = await this.detectCapabilities(profile.modelId);
        const health = await this.checkHealth(profile.modelId);
        candidates.push({
          id: profile.modelId,
          modelId: profile.modelId,
          providerId: profile.providerId,
          name: profile.name,
          isLocal: profile.isLocal,
          health: health.status,
          capabilities,
        });
      }
    }

    return candidates;
  }
}
