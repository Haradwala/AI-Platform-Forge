import * as crypto from 'crypto';
import { IParseResult, IGraphNode, IStructuredMetadata } from '@forge/shared';

export function sha256(content: string): string {
  return crypto.createHash('sha256').update(content).digest('hex');
}

export function generateStableNodeId(workspaceId: string, filePath: string, qualifiedName: string): string {
  const normalizedPath = filePath.replace(/\\/g, '/').toLowerCase();
  return sha256(`${workspaceId}:${normalizedPath}:${qualifiedName}`);
}

export class NodeBuilder {
  buildNodes(
    workspaceId: string,
    filePath: string,
    parseResult: IParseResult,
    fileHash: string
  ): IGraphNode[] {
    const nodes: IGraphNode[] = [];
    const timestamp = new Date();

    const fileId = generateStableNodeId(workspaceId, filePath, '');
    const fileMetadata: IStructuredMetadata = {
      visibility: 'public',
      language: 'markdown',
      documentation: 'Workspace file node',
      modifiers: [],
      annotations: [],
      attributes: {}
    };

    const fileNode: IGraphNode = {
      id: fileId,
      kind: 'file',
      displayName: filePath.split(/[\\/]/).pop() || '',
      qualifiedName: '',
      filePath,
      metadata: fileMetadata,
      hash: fileHash,
      version: 1,
      parserVersion: '0.1.0',
      schemaVersion: '1.0.0',
      timestamps: { createdAt: timestamp, updatedAt: timestamp }
    };
    nodes.push(fileNode);

    for (const sym of parseResult.symbols) {
      const nodeId = generateStableNodeId(workspaceId, filePath, sym.name);
      
      const structuredMetadata: IStructuredMetadata = {
        visibility: sym.visibility,
        language: 'markdown',
        documentation: sym.documentation,
        modifiers: [],
        annotations: [],
        attributes: {}
      };

      const node: IGraphNode = {
        id: nodeId,
        kind: sym.kind as any,
        displayName: sym.name,
        qualifiedName: sym.name,
        filePath,
        metadata: structuredMetadata,
        range: sym.range,
        hash: sha256(sym.name),
        version: 1,
        parserVersion: '0.1.0',
        schemaVersion: '1.0.0',
        timestamps: { createdAt: timestamp, updatedAt: timestamp }
      };
      nodes.push(node);
    }

    return nodes;
  }
}
