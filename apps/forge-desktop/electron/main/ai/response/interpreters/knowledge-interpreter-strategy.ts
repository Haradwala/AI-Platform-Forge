/**
 * knowledge-interpreter-strategy.ts
 *
 * Modular strategy implementations converting normalized ExecutionResult<T>
 * envelopes into decoupled KnowledgeFact objects.
 */

import { ExecutionResultKind } from '../../contracts/execution-result-kind';
import type { ExecutionResult } from '../../contracts/execution-envelope';
import type {
  KnowledgeFact,
  WorkspaceStatisticsFact,
  RepositoryFileListFact,
  WorkspaceSearchFact,
  FileContentFact,
  TerminalFact,
  GitDiffFact,
  ErrorTraceFact,
  SearchMatch,
} from '../response-types';

export interface IKnowledgeInterpreter {
  readonly kind: ExecutionResultKind;
  interpret(result: ExecutionResult<any>): KnowledgeFact[];
}

export class WorkspaceStatsKnowledgeInterpreter implements IKnowledgeInterpreter {
  readonly kind = ExecutionResultKind.WORKSPACE_STATS;

  interpret(result: ExecutionResult<any>): KnowledgeFact[] {
    const payload = result.payload || {};
    const filesCount = payload.filesCount ?? payload.stats?.filesCount ?? 0;

    const fact: WorkspaceStatisticsFact = {
      kind: 'workspace_statistics',
      fileCount: filesCount,
      symbolsCount: payload.symbolsCount ?? 0,
      circularDependenciesCount: payload.circularDependenciesCount ?? 0,
      languages: Array.isArray(payload.languages) ? payload.languages : [],
      projects: Array.isArray(payload.projects) ? payload.projects : [],
    };
    return [fact];
  }
}

export class FileListKnowledgeInterpreter implements IKnowledgeInterpreter {
  readonly kind = ExecutionResultKind.FILE_LIST;

  interpret(result: ExecutionResult<any>): KnowledgeFact[] {
    const payload = result.payload || {};
    const rawFiles = payload.files || (Array.isArray(payload.results) ? payload.results : []);
    const files = rawFiles.map((f: any) => (typeof f === 'string' ? f : f?.filePath || f?.file || String(f)));

    const fact: RepositoryFileListFact = {
      kind: 'file_list',
      files,
      total: payload.total ?? files.length,
    };
    return [fact];
  }
}

export class SearchResultsKnowledgeInterpreter implements IKnowledgeInterpreter {
  readonly kind = ExecutionResultKind.SEARCH_RESULTS;

  interpret(result: ExecutionResult<any>): KnowledgeFact[] {
    const payload = result.payload || {};
    const rawResults: any[] = Array.isArray(payload.results) ? payload.results : [];
    const matches: SearchMatch[] = rawResults.map((r) => ({
      filePath: r.filePath || r.file || 'unknown',
      line: typeof r.line === 'number' ? r.line : undefined,
      text: r.text || r.snippet || '',
    }));

    const fact: WorkspaceSearchFact = {
      kind: 'workspace_search',
      query: payload.query || '',
      matches,
      totalMatches: matches.length,
    };
    return [fact];
  }
}

export class FileContentKnowledgeInterpreter implements IKnowledgeInterpreter {
  readonly kind = ExecutionResultKind.FILE_CONTENT;

  interpret(result: ExecutionResult<any>): KnowledgeFact[] {
    const payload = result.payload || {};
    const fact: FileContentFact = {
      kind: 'file_content',
      path: payload.filePath || 'unknown',
      content: typeof payload.content === 'string' ? payload.content : JSON.stringify(payload),
    };
    return [fact];
  }
}

export class TerminalOutputKnowledgeInterpreter implements IKnowledgeInterpreter {
  readonly kind = ExecutionResultKind.TERMINAL_OUTPUT;

  interpret(result: ExecutionResult<any>): KnowledgeFact[] {
    const payload = result.payload || {};
    const fact: TerminalFact = {
      kind: 'terminal_output',
      command: payload.command || 'terminal_command',
      stdout: typeof payload.stdout === 'string' ? payload.stdout : (typeof payload.output === 'string' ? payload.output : JSON.stringify(payload)),
      stderr: payload.stderr || undefined,
      exitCode: typeof payload.exitCode === 'number' ? payload.exitCode : 0,
    };
    return [fact];
  }
}

export class GitDiffKnowledgeInterpreter implements IKnowledgeInterpreter {
  readonly kind = ExecutionResultKind.GIT_DIFF;

  interpret(result: ExecutionResult<any>): KnowledgeFact[] {
    const payload = result.payload || {};
    const fact: GitDiffFact = {
      kind: 'git_diff',
      diff: typeof payload.diff === 'string' ? payload.diff : '',
    };
    return [fact];
  }
}

export class ErrorTraceKnowledgeInterpreter implements IKnowledgeInterpreter {
  readonly kind = ExecutionResultKind.ERROR_TRACE;

  interpret(result: ExecutionResult<any>): KnowledgeFact[] {
    const payload = result.payload || {};
    const fact: ErrorTraceFact = {
      kind: 'error_trace',
      error: payload.error || payload.message || 'Unknown error occurred',
    };
    return [fact];
  }
}
