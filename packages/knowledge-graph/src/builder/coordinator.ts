import { IParseResult } from '@forge/shared';
import { IEventBus } from '@forge/core';
import { IGraphStorage } from '../storage/storage';
import { NodeBuilder, generateStableNodeId } from './node-builder';
import { EdgeBuilder } from './edge-builder';
import { GraphValidator } from './validator';

export class GraphBuilderCoordinator {
  private readonly nodeBuilder = new NodeBuilder();
  private readonly edgeBuilder = new EdgeBuilder();
  private readonly validator = new GraphValidator();

  constructor(
    private readonly storage: IGraphStorage,
    private readonly eventBus: IEventBus
  ) {}

  async buildFileGraph(
    workspaceId: string,
    filePath: string,
    parseResult: IParseResult,
    fileHash: string
  ): Promise<void> {
    const timestamp = new Date();
    this.eventBus.publish('graph.started', { timestamp });

    const fileNodeId = generateStableNodeId(workspaceId, filePath, '');
    const existingFileNode = await this.storage.getNode(fileNodeId);
    if (existingFileNode && existingFileNode.hash === fileHash) {
      this.eventBus.publish('graph.completed', {
        durationMs: 0,
        nodesCount: 0,
        edgesCount: 0,
        timestamp: new Date()
      });
      return;
    }

    const tx = await this.storage.beginTransaction();

    try {
      const newNodes = this.nodeBuilder.buildNodes(workspaceId, filePath, parseResult, fileHash);
      const newEdges = this.edgeBuilder.buildEdges(workspaceId, filePath, parseResult, newNodes);

      await this.storage.upsertNodes(newNodes);
      await this.storage.upsertEdges(newEdges);

      const combinedNodes = await this.storage.getAllNodes();
      const combinedEdges = await this.storage.getAllEdges();

      const validation = this.validator.validate(combinedNodes, combinedEdges);
      if (!validation.isValid) {
        throw new Error(`GraphBuilderCoordinator: Validation failed: ${validation.errors.join('; ')}`);
      }

      const startTime = Date.now();
      await tx.commit();
      const durationMs = Date.now() - startTime;

      for (const node of newNodes) {
        this.eventBus.publish('graph.node.created', { nodeId: node.id, node, timestamp: new Date() });
      }
      for (const edge of newEdges) {
        this.eventBus.publish('graph.edge.created', { edgeId: edge.id, edge, timestamp: new Date() });
      }

      this.eventBus.publish('graph.completed', {
        durationMs,
        nodesCount: newNodes.length,
        edgesCount: newEdges.length,
        timestamp: new Date()
      });
    } catch (err) {
      await tx.rollback();
      throw err;
    }
  }
}
