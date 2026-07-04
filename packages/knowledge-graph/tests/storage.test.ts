import { describe, it, expect } from 'vitest';
import { MemoryGraphStorage } from '../src/storage/memory';
import { IGraphNode } from '@forge/shared';

describe('MemoryGraphStorage Transactions', () => {
  it('should stage edits and apply on commit', async () => {
    const storage = new MemoryGraphStorage();
    const node: IGraphNode = {
      id: 'node-1',
      kind: 'class',
      displayName: 'MyClass',
      qualifiedName: 'MyClass',
      filePath: 'file.ts',
      metadata: {
        visibility: 'public',
        language: 'typescript',
        modifiers: [],
        annotations: [],
        attributes: {}
      },
      hash: 'h1',
      version: 1,
      parserVersion: '0.1.0',
      schemaVersion: '1.0.0',
      timestamps: { createdAt: new Date(), updatedAt: new Date() }
    };

    const tx = await storage.beginTransaction();
    await storage.upsertNodes([node]);

    const inTxNode = await storage.getNode('node-1');
    expect(inTxNode).toBeDefined();
    expect(inTxNode?.id).toBe('node-1');

    await tx.commit();

    const postCommitNode = await storage.getNode('node-1');
    expect(postCommitNode).toBeDefined();
    expect(postCommitNode?.id).toBe('node-1');
  });

  it('should discard staged changes on rollback', async () => {
    const storage = new MemoryGraphStorage();
    const node: IGraphNode = {
      id: 'node-2',
      kind: 'class',
      displayName: 'MyClass2',
      qualifiedName: 'MyClass2',
      filePath: 'file.ts',
      metadata: {
        visibility: 'public',
        language: 'typescript',
        modifiers: [],
        annotations: [],
        attributes: {}
      },
      hash: 'h2',
      version: 1,
      parserVersion: '0.1.0',
      schemaVersion: '1.0.0',
      timestamps: { createdAt: new Date(), updatedAt: new Date() }
    };

    const tx = await storage.beginTransaction();
    await storage.upsertNodes([node]);
    
    await tx.rollback();

    const postRollbackNode = await storage.getNode('node-2');
    expect(postRollbackNode).toBeUndefined();
  });
});
