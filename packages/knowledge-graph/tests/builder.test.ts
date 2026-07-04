import { describe, it, expect } from 'vitest';
import { GraphBuilderCoordinator } from '../src/builder/coordinator';
import { MemoryGraphStorage } from '../src/storage/memory';
import { IParseResult } from '@forge/shared';

class MockEventBus {
  public readonly events: { topic: string; payload: any }[] = [];

  publish(topic: string, payload: any): void {
    this.events.push({ topic, payload });
  }
}

describe('GraphBuilderCoordinator & Validation', () => {
  it('should build graph and emit events on success', async () => {
    const storage = new MemoryGraphStorage();
    const eventBus = new MockEventBus() as any;
    const coordinator = new GraphBuilderCoordinator(storage, eventBus);

    const parseResult: IParseResult = {
      symbols: [
        {
          id: 'sym-1',
          name: 'MyClass',
          kind: 'class',
          range: { start: { line: 0, column: 0, offset: 0 }, end: { line: 0, column: 0, offset: 0 } },
          selectionRange: { start: { line: 0, column: 0, offset: 0 }, end: { line: 0, column: 0, offset: 0 } },
          visibility: 'public'
        }
      ],
      relationships: [
        {
          sourceSymbolId: 'MyClass',
          targetSymbolId: 'external-target',
          type: 'calls'
        }
      ],
      diagnostics: []
    };

    await coordinator.buildFileGraph('w-1', 'main.ts', parseResult, 'h1');

    const nodes = await storage.getAllNodes();
    expect(nodes.length).toBe(2);

    const edges = await storage.getAllEdges();
    expect(edges.length).toBe(3);

    expect(eventBus.events.some((e: any) => e.topic === 'graph.node.created')).toBe(true);
    expect(eventBus.events.some((e: any) => e.topic === 'graph.completed')).toBe(true);
  });

  it('should throw and rollback if circular self-loop violates validation', async () => {
    const storage = new MemoryGraphStorage();
    const eventBus = new MockEventBus() as any;
    const coordinator = new GraphBuilderCoordinator(storage, eventBus);

    const parseResult: IParseResult = {
      symbols: [
        {
          id: 'sym-2',
          name: 'MyClass2',
          kind: 'class',
          range: { start: { line: 0, column: 0, offset: 0 }, end: { line: 0, column: 0, offset: 0 } },
          selectionRange: { start: { line: 0, column: 0, offset: 0 }, end: { line: 0, column: 0, offset: 0 } },
          visibility: 'public'
        }
      ],
      relationships: [
        {
          sourceSymbolId: 'MyClass2',
          targetSymbolId: 'MyClass2',
          type: 'extends'
        }
      ],
      diagnostics: []
    };

    await expect(
      coordinator.buildFileGraph('w-1', 'main.ts', parseResult, 'h2')
    ).rejects.toThrow('Validation failed');

    const nodes = await storage.getAllNodes();
    expect(nodes.length).toBe(0);
  });
});
