import { describe, it, expect } from 'vitest';
import { EngineeringIntelligenceEngine } from '../electron/main/ai/intelligence/engineering-intelligence-engine';

describe('Phase 25-28 Workspace Intelligence Providers Suite', () => {
  it('analyzes repository using modular providers', async () => {
    const engine = new EngineeringIntelligenceEngine();
    const analysis = await engine.analyzeRepository('/tmp/test_ws');

    expect(analysis.health.score).toBeGreaterThan(80);
    expect(analysis.architecture.layers.length).toBeGreaterThan(0);
    expect(analysis.dependencies.externalPackages.length).toBeGreaterThan(0);
    expect(analysis.todos).toBeDefined();
    expect(analysis.git).toBeDefined();
    expect(analysis.testStats).toBeDefined();
  });

  it('incremental indexer buffers dirty file notifications', async () => {
    const engine = new EngineeringIntelligenceEngine();
    engine.indexer.notifyFileChanged('src/App.tsx');
    engine.indexer.notifyFileChanged('src/main.tsx');

    let processedCount = 0;
    await engine.indexer.processDirtyQueue(async (files) => {
      processedCount = files.length;
    });

    expect(processedCount).toBe(2);
  });
});
