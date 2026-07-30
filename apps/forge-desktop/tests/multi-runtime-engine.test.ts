/**
 * multi-runtime-engine.test.ts — Unit Test Suite for Multi-Runtime Subsystem
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';
import { RuntimeProfileRegistry } from '../electron/main/runtimes/profiles/runtime-profile-registry';
import { RuntimeProviderRegistry } from '../electron/main/runtimes/providers/runtime-provider-registry';
import { RuntimeManager } from '../electron/main/runtimes/manager/runtime-manager';
import { RuntimePerformanceEngine } from '../electron/main/runtimes/performance/runtime-performance-engine';
import { IntelligentRoutingEngine } from '../electron/main/runtimes/routing/intelligent-routing-engine';
import { MultiRuntimeSessionManager } from '../electron/main/runtimes/sessions/multi-runtime-session-manager';
import { MultiRuntimeApplicationService } from '../electron/main/application/runtime/multi-runtime-application-service';

describe('Multi-Runtime Intelligence Engine', () => {
  const testDir = path.join(__dirname, 'temp_runtime_test');
  let profileRegistry: RuntimeProfileRegistry;
  let providerRegistry: RuntimeProviderRegistry;
  let runtimeManager: RuntimeManager;
  let performanceEngine: RuntimePerformanceEngine;
  let routingEngine: IntelligentRoutingEngine;
  let sessionManager: MultiRuntimeSessionManager;
  let appService: MultiRuntimeApplicationService;

  beforeEach(() => {
    if (!fs.existsSync(testDir)) {
      fs.mkdirSync(testDir, { recursive: true });
    }

    profileRegistry = new RuntimeProfileRegistry();
    providerRegistry = new RuntimeProviderRegistry();
    runtimeManager = new RuntimeManager(providerRegistry);
    performanceEngine = new RuntimePerformanceEngine();
    routingEngine = new IntelligentRoutingEngine(profileRegistry, performanceEngine, runtimeManager);
    sessionManager = new MultiRuntimeSessionManager(undefined, profileRegistry);
    appService = new MultiRuntimeApplicationService(
      runtimeManager,
      profileRegistry,
      routingEngine,
      sessionManager,
      performanceEngine
    );
  });

  afterEach(() => {
    if (fs.existsSync(testDir)) {
      fs.rmSync(testDir, { recursive: true, force: true });
    }
  });

  it('RuntimeProfileRegistry returns preloaded model profiles', () => {
    const profiles = profileRegistry.listProfiles();
    expect(profiles.length).toBeGreaterThan(0);
    const gpt4o = profileRegistry.getProfile('gpt-4o');
    expect(gpt4o).toBeDefined();
    expect(gpt4o?.contextWindow).toBe(128000);
  });

  it('RuntimeProfileRegistry filters profiles by local/vision flags', () => {
    const localProfiles = profileRegistry.listProfiles({ isLocal: true });
    expect(localProfiles.length).toBeGreaterThan(0);
    expect(localProfiles[0].isLocal).toBe(true);
  });

  it('RuntimeManager manages runtime lifecycle and health', async () => {
    await runtimeManager.startRuntime('ollama');
    const health = await runtimeManager.checkHealth('ollama');
    expect(health.status).toBe('healthy');
  });

  it('RuntimePerformanceEngine tracks execution metrics and calculates reliability', () => {
    performanceEngine.recordExecution({
      modelId: 'gpt-4o',
      providerId: 'openai',
      workspaceRoot: testDir,
      ttftMs: 110,
      tokensPerSec: 50.0,
      inputTokens: 100,
      outputTokens: 200,
      costUSD: 0.002,
      success: true,
      timestamp: Date.now(),
    });

    const metrics = performanceEngine.getMetrics('gpt-4o');
    expect(metrics.totalRequests).toBe(1);
    expect(metrics.successRate).toBe(1.0);
    expect(metrics.reliabilityScore).toBeGreaterThan(0.5);
  });

  it('IntelligentRoutingEngine routes coding request to optimal model', async () => {
    const decision = await routingEngine.routeRequest({
      workspaceRoot: testDir,
      taskType: 'coding',
      requiredCapabilities: ['vision'],
    });

    expect(decision.selectedModelId).toBeDefined();
    expect(decision.fallbackChain.length).toBeGreaterThan(0);
  });

  it('MultiRuntimeSessionManager creates sessions and switches runtime with context sync', async () => {
    const session = await sessionManager.createSession(testDir, 'gpt-4o');
    expect(session.currentModelId).toBe('gpt-4o');

    const updated = await sessionManager.switchRuntime(session.id, 'claude-3-5-sonnet');
    expect(updated.currentModelId).toBe('claude-3-5-sonnet');
  });

  it('MultiRuntimeApplicationService facade proxies calls cleanly', async () => {
    const profiles = await appService.listProfiles();
    expect(profiles.length).toBeGreaterThan(0);

    const metrics = await appService.runBenchmark('gemini-1.5-pro');
    expect(metrics.modelId).toBe('gemini-1.5-pro');
  });
});
