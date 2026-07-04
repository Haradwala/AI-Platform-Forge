import { describe, it, expect } from 'vitest';
import { MemoryGraphStorage } from '../src/storage/memory';
import { GraphAnalyticsEngine } from '../src/analytics/metrics';
import { IGraphNode, IGraphEdge } from '@forge/shared';

describe('GraphAnalyticsEngine Metrics', () => {
  it('should find cycles, dead code, and calculate fan-in/fan-out metrics', async () => {
    const storage = new MemoryGraphStorage();
    const analytics = new GraphAnalyticsEngine(storage);
    const timestamp = new Date();

    const nodeA: IGraphNode = {
      id: 'node-a', kind: 'function', displayName: 'A', qualifiedName: 'A', filePath: 'main.ts',
      metadata: { visibility: 'public', language: 'ts', modifiers: [], annotations: [], attributes: {} },
      hash: 'h', version: 1, parserVersion: 'v', schemaVersion: 'v',
      timestamps: { createdAt: timestamp, updatedAt: timestamp }
    };
    const nodeB: IGraphNode = {
      id: 'node-b', kind: 'function', displayName: 'B', qualifiedName: 'B', filePath: 'main.ts',
      metadata: { visibility: 'public', language: 'ts', modifiers: [], annotations: [], attributes: {} },
      hash: 'h', version: 1, parserVersion: 'v', schemaVersion: 'v',
      timestamps: { createdAt: timestamp, updatedAt: timestamp }
    };
    const nodeC: IGraphNode = {
      id: 'node-c', kind: 'function', displayName: 'C', qualifiedName: 'C', filePath: 'main.ts',
      metadata: { visibility: 'public', language: 'ts', modifiers: [], annotations: [], attributes: {} },
      hash: 'h', version: 1, parserVersion: 'v', schemaVersion: 'v',
      timestamps: { createdAt: timestamp, updatedAt: timestamp }
    };

    const edgeAB: IGraphEdge = {
      id: 'edge-ab', sourceId: 'node-a', targetId: 'node-b', kind: 'calls', confidence: 1.0, metadata: {},
      timestamps: { createdAt: timestamp, updatedAt: timestamp }
    };
    const edgeBC: IGraphEdge = {
      id: 'edge-bc', sourceId: 'node-b', targetId: 'node-c', kind: 'calls', confidence: 1.0, metadata: {},
      timestamps: { createdAt: timestamp, updatedAt: timestamp }
    };
    const edgeCA: IGraphEdge = {
      id: 'edge-ca', sourceId: 'node-c', targetId: 'node-a', kind: 'calls', confidence: 1.0, metadata: {},
      timestamps: { createdAt: timestamp, updatedAt: timestamp }
    };

    const nodeD: IGraphNode = {
      id: 'node-d', kind: 'function', displayName: 'D', qualifiedName: 'D', filePath: 'main.ts',
      metadata: { visibility: 'public', language: 'ts', modifiers: [], annotations: [], attributes: {} },
      hash: 'h', version: 1, parserVersion: 'v', schemaVersion: 'v',
      timestamps: { createdAt: timestamp, updatedAt: timestamp }
    };

    await storage.upsertNodes([nodeA, nodeB, nodeC, nodeD]);
    await storage.upsertEdges([edgeAB, edgeBC, edgeCA]);

    const metrics = await analytics.calculateMetrics('node-b');
    expect(metrics.fanIn).toBe(1);
    expect(metrics.fanOut).toBe(1);

    const cycles = await analytics.findCircularDependencies();
    expect(cycles.length).toBeGreaterThan(0);
    expect(cycles[0]).toContain('node-a');
    expect(cycles[0]).toContain('node-b');
    expect(cycles[0]).toContain('node-c');

    const orphans = await analytics.findOrphanSymbols();
    expect(orphans).toContain('node-d');

    const deadCode = await analytics.findDeadCode();
    expect(deadCode).toContain('node-d');
  });
});
