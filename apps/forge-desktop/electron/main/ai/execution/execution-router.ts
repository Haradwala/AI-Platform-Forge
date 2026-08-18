/**
 * execution-router.ts — Semantic Goal Router & Execution Sources
 *
 * Routes semantic ExecutionGoal intents across execution sources (MemoryExecutionSource, WorkspaceExecutionSource).
 * MemoryExecutionSource queries session.entities (IEntityStore) directly without prompt parsing.
 */

import type { ISessionServices } from '../session/session-context-manager';
import { ExecutionGoal } from '../contracts/execution-goal';
import { ExecutionResultKind } from '../contracts/execution-result-kind';
import { ExecutionEntityExtractor } from '../memory/extraction/execution-entity-extractor';

export { ExecutionGoal } from '../contracts/execution-goal';
export { ExecutionResultKind } from '../contracts/execution-result-kind';

export interface IExecutionSourceResult {
  success: boolean;
  data: any;
  formattedResponse?: string;
  source: string;
}

export interface IExecutionSource {
  readonly id: string;
  readonly priority: number;
  canResolve(goal: ExecutionGoal, session?: ISessionServices): boolean;
  resolve(goal: ExecutionGoal, session?: ISessionServices): Promise<IExecutionSourceResult | null>;
}

export class MemoryExecutionSource implements IExecutionSource {
  readonly id = 'memory_execution_source';
  readonly priority = 1;

  constructor(private readonly extractor: ExecutionEntityExtractor = new ExecutionEntityExtractor()) {}

  canResolve(goal: ExecutionGoal, session?: ISessionServices): boolean {
    if (!session) return false;

    // Check entity store first
    if (session.entities) {
      if (goal === ExecutionGoal.WORKSPACE_STATISTICS) {
        return !!session.entities.getLatest(ExecutionResultKind.WORKSPACE_STATS);
      }
      if (goal === ExecutionGoal.FILE_LIST) {
        return !!session.entities.getLatest(ExecutionResultKind.FILE_LIST);
      }
      if (goal === ExecutionGoal.FILE_CONTENT) {
        return !!session.entities.getLatest(ExecutionResultKind.FILE_CONTENT);
      }
    }

    // Fallback to event timeline extraction
    const events = session.execution?.getEvents();
    if (!events || events.length === 0) return false;

    if (goal === ExecutionGoal.WORKSPACE_STATISTICS) {
      return !!this.extractor.getLatestEntity(events, 'file_count');
    }
    if (goal === ExecutionGoal.FILE_LIST) {
      return !!this.extractor.getLatestEntity(events, 'file_list');
    }
    return false;
  }

  async resolve(goal: ExecutionGoal, session?: ISessionServices): Promise<IExecutionSourceResult | null> {
    if (!session) return null;

    // 1. WORKSPACE_STATISTICS Goal
    if (goal === ExecutionGoal.WORKSPACE_STATISTICS) {
      const statsEntity = session.entities?.getLatest(ExecutionResultKind.WORKSPACE_STATS) ||
                          this.extractor.getLatestEntity(session.execution.getEvents(), 'file_count');
      if (statsEntity && typeof statsEntity.value === 'number') {
        return {
          success: true,
          data: statsEntity.value,
          formattedResponse: `There were ${statsEntity.value} files recorded in workspace memory.`,
          source: 'memory',
        };
      }
    }

    // 2. FILE_LIST Goal
    if (goal === ExecutionGoal.FILE_LIST) {
      const listEntity = session.entities?.getLatest(ExecutionResultKind.FILE_LIST) ||
                         this.extractor.getLatestEntity(session.execution.getEvents(), 'file_list');
      if (listEntity && Array.isArray(listEntity.value)) {
        const items = listEntity.value as string[];
        const total = items.length;
        const displayLimit = 100;
        const slice = items.slice(0, displayLimit);

        let formatted = `Project Files Memory (${total} total files):\n` + slice.map((f: string) => `- ${f}`).join('\n');
        if (total > displayLimit) {
          formatted += `\n\n... and ${total - displayLimit} more files.`;
        }

        return {
          success: true,
          data: items,
          formattedResponse: formatted,
          source: 'memory',
        };
      }
    }

    return null;
  }
}

export class WorkspaceExecutionSource implements IExecutionSource {
  readonly id = 'workspace_execution_source';
  readonly priority = 10;

  canResolve(): boolean {
    return true; // Fallback workspace tool executor
  }

  async resolve(): Promise<IExecutionSourceResult | null> {
    return null; // Signals orchestrator to execute standard pipeline plan via ExecutionEngine
  }
}

export class ExecutionRouter {
  readonly sources: IExecutionSource[] = [];

  registerSource(source: IExecutionSource): void {
    this.sources.push(source);
    this.sources.sort((a, b) => a.priority - b.priority);
  }

  async resolveGoal(goal: ExecutionGoal, session?: ISessionServices): Promise<IExecutionSourceResult | null> {
    for (const src of this.sources) {
      if (src.canResolve(goal, session)) {
        const result = await src.resolve(goal, session);
        if (result) return result;
      }
    }
    return null;
  }
}
