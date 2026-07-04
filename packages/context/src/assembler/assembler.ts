import {
  ICandidateContext,
  IContextPackage,
  IIntent,
  IContextTrace,
  IContextDiagnostics,
  IContextTraceItem,
  ISymbol,
  IGraphEdge
} from '@forge/shared';
import * as crypto from 'crypto';

export class ContextAssembler {
  assemblePackage(
    workspaceId: string,
    request: string,
    intent: IIntent,
    finalCandidates: ICandidateContext[],
    planningTimeMs: number,
    retrievalTimeMs: number,
    rankingTimeMs: number,
    compressionTimeMs: number,
    cacheHit: boolean,
    candidatesCount: number,
    discardedCount: number,
    compressedCount: number
  ): IContextPackage {
    const timestamp = new Date();
    const startTime = Date.now();

    const files: { path: string; content: string; hash: string }[] = [];
    const symbols: ISymbol[] = [];
    const relationships: IGraphEdge[] = [];
    const traceItems: IContextTraceItem[] = [];

    let finalTokenCount = 0;

    for (const cand of finalCandidates) {
      finalTokenCount += cand.estimatedTokens;

      const traceItem: IContextTraceItem = {
        candidateId: cand.id,
        selectionReason: `Selected via ${cand.metadata.retrievalSource} (relevance score: ${cand.relevanceScore.toFixed(2)})`,
        retrievalSource: cand.metadata.retrievalSource,
        rankingScore: cand.relevanceScore,
        graphDistance: cand.graphDistance,
        compressionApplied: cand.estimatedTokens < Math.ceil(cand.content.length / 4) ? ['StructuralCompressor'] : []
      };
      traceItems.push(traceItem);

      if (cand.type === 'file' || cand.type === 'documentation') {
        files.push({
          path: cand.path,
          content: cand.content,
          hash: crypto.createHash('sha256').update(cand.content).digest('hex')
        });
      }

      if (cand.nodeAssociation) {
        symbols.push({
          id: cand.nodeAssociation.id,
          name: cand.nodeAssociation.displayName,
          kind: cand.nodeAssociation.kind as any,
          range: cand.nodeAssociation.range || { start: { line: 0, column: 0, offset: 0 }, end: { line: 0, column: 0, offset: 0 } },
          selectionRange: cand.nodeAssociation.range || { start: { line: 0, column: 0, offset: 0 }, end: { line: 0, column: 0, offset: 0 } },
          visibility: cand.nodeAssociation.metadata.visibility,
          childrenIds: []
        });
      }
    }

    const assemblyTimeMs = Date.now() - startTime;

    const metrics: IContextDiagnostics = {
      planningTimeMs,
      retrievalTimeMs,
      rankingTimeMs,
      compressionTimeMs,
      assemblyTimeMs,
      cacheHit,
      candidatesCount,
      discardedCount,
      compressedCount,
      finalTokenCount
    };

    const trace: IContextTrace = {
      traceItems,
      metrics
    };

    const id = crypto
      .createHash('sha256')
      .update(`${request}:${intent.type}:${finalTokenCount}`)
      .digest('hex');

    return {
      id,
      workspaceId,
      request,
      intent,
      files,
      symbols,
      relationships,
      trace,
      timestamp
    };
  }
}
