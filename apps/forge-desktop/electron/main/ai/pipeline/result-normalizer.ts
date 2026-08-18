/**
 * result-normalizer.ts — Tool Result Payload Normalizer
 *
 * Normalizes raw or legacy tool return objects into canonical payload shapes
 * before contract validation and entity extraction.
 */

import { ExecutionResult } from '../contracts/execution-envelope';
import { ExecutionResultKind } from '../contracts/execution-result-kind';

export class ResultNormalizer {
  /**
   * Normalizes an ExecutionResult envelope.
   */
  normalize<T>(result: ExecutionResult<T>): ExecutionResult<T> {
    if (!result || !result.payload || typeof result.payload !== 'object') {
      return result;
    }

    const payload = { ...result.payload } as Record<string, any>;

    switch (result.kind) {
      case ExecutionResultKind.FILE_LIST: {
        // Normalize aliases: changedFiles, paths, items -> files
        if (!payload.files) {
          payload.files = payload.changedFiles || payload.paths || payload.items || [];
        }
        if (Array.isArray(payload.files)) {
          payload.files = payload.files
            .map((f: any) => (typeof f === 'string' ? f : f?.filePath || f?.file || f?.name))
            .filter((f: any) => typeof f === 'string' && f.trim() !== '' && f !== 'workspace');
          payload.total = payload.total ?? payload.files.length;
        }
        break;
      }

      case ExecutionResultKind.SEARCH_RESULTS: {
        if (Array.isArray(payload.results)) {
          payload.results = payload.results.filter(
            (r: any) => r && typeof r.filePath === 'string' && r.filePath !== 'workspace'
          );
        }
        break;
      }

      case ExecutionResultKind.WORKSPACE_STATS: {
        if (payload.stats && typeof payload.stats === 'object') {
          payload.filesCount = payload.stats.filesCount ?? payload.filesCount ?? 0;
          payload.symbolsCount = payload.stats.symbolsCount ?? payload.symbolsCount ?? 0;
          payload.circularDependenciesCount = payload.stats.circularDependenciesCount ?? 0;
          payload.languages = payload.stats.languages ?? [];
          payload.projects = payload.stats.projects ?? [];
        }
        break;
      }
    }

    return {
      ...result,
      payload: payload as unknown as T,
    };
  }
}
