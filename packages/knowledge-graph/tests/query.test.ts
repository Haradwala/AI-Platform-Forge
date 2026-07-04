import { describe, it, expect } from 'vitest';
import { MemoryGraphStorage } from '../src/storage/memory';
import { QueryEngine } from '../src/query/engine';
import { IGraphNode, IGraphEdge } from '@forge/shared';

describe('QueryEngine Traversals', () => {
  it('should find symbol, callers, callees, and pathing BFS routes', async () => {
    const storage = new MemoryGraphStorage();
    const queryEngine = new QueryEngine(storage);

    const timestamp = new Date();
    const nodeA: IGraphNode = {
      id: 'node-a', kind: 'function', displayName: 'funcA', qualifiedName: 'funcA', filePath: 'main.ts',
      metadata: { visibility: 'public', language: 'ts', modifiers: [], annotations: [], attributes: {} },
      hash: 'h', version: 1, parserVersion: 'v', schemaVersion: 'v',
      timestamps: { createdAt: timestamp, updatedAt: timestamp }
    };
    const nodeB: IGraphNode = {
      id: 'node-b', kind: 'function', displayName: 'funcB', qualifiedName: 'funcB', filePath: 'main.ts',
      metadata: { visibility: 'public', language: 'ts', modifiers: [], annotations: [], attributes: {} },
      hash: 'h', version: 1, parserVersion: 'v', schemaVersion: 'v',
      timestamps: { createdAt: timestamp, updatedAt: timestamp }
    };
    const nodeC: IGraphNode = {
      id: 'node-c', kind: 'function', displayName: 'funcC', qualifiedName: 'funcC', filePath: 'main.ts',
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

    await storage.upsertNodes([nodeA, nodeB, nodeC]);
    await storage.upsertEdges([edgeAB, edgeBC]);

    const callers = await queryEngine.findCallers('node-b');
    expect(callers.length).toBe(1);
    expect(callers[0].id).toBe('node-a');

    const callees = await queryEngine.findCallees('node-b');
    expect(callees.length).toBe(1);
    expect(callees[0].id).toBe('node-c');

    const symbols = await queryEngine.findSymbol('funcB');
    expect(symbols.length).toBe(1);
    expect(symbols[0].id).toBe('node-b');

    const paths = await queryEngine.findPath('node-a', 'node-c');
    expect(paths.length).toBe(1);
    expect(paths[0].length).toBe(2);
    expect(paths[0][0].id).toBe('edge-ab');
    expect(paths[0][1].id).toBe('edge-bc');
  });
});
