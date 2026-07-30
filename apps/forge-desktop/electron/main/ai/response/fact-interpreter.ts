/**
 * fact-interpreter.ts
 *
 * FactInterpreter — interprets raw IExecutionResult[] items into
 * structured GroundedContext facts (RepositoryFact, TerminalFact).
 *
 * Responsibilities:
 *  - Separate interpretation logic from ResponseContextBuilder
 *  - Match tool execution results by toolId in a type-safe manner
 *  - Construct immutable RepositoryFact and TerminalFact discriminated unions
 *  - Preserve raw executionResults alongside interpreted facts
 *
 * Canonical Architecture Rule:
 *  Execution layers never produce prompts. Response layers never inspect tools.
 *  GroundedContext is the only contract crossing that boundary.
 */

import type { IExecutionResult } from '../execution/execution-types';
import type {
  GroundedContext,
  RepositoryFact,
  TerminalFact,
  WorkspaceSearchFact,
  DirectoryListingFact,
  FileContentFact,
  SearchMatch,
} from './response-types';

export class FactInterpreter {
  /**
   * Interprets raw IExecutionResult[] items into a structured, immutable GroundedContext.
   */
  interpret(executionResults: readonly IExecutionResult[]): GroundedContext {
    const repositoryFacts: RepositoryFact[] = [];
    const terminalFacts: TerminalFact[] = [];

    for (const exec of executionResults) {
      if (exec.status !== 'completed' || !exec.result) {
        continue;
      }

      const res = exec.result;
      const toolId = exec.toolId;

      switch (toolId) {
        case 'search_workspace': {
          const rawResults: any[] = Array.isArray(res.results) ? res.results : [];
          const matches: SearchMatch[] = rawResults.map((r) => ({
            filePath: r.filePath || r.file || 'unknown',
            line: typeof r.line === 'number' ? r.line : undefined,
            text: r.text || r.snippet || '',
          }));

          const fact: WorkspaceSearchFact = {
            kind: 'workspace_search',
            query: res.query || '',
            matches,
            totalMatches: matches.length,
          };
          repositoryFacts.push(fact);
          break;
        }

        case 'read_file': {
          if (typeof res.content === 'string') {
            const fact: FileContentFact = {
              kind: 'file_content',
              path: res.filePath || 'unknown',
              content: res.content,
            };
            repositoryFacts.push(fact);
          }
          break;
        }

        case 'list_dir': {
          const items: string[] = Array.isArray(res.items) ? res.items : [];
          const fact: DirectoryListingFact = {
            kind: 'directory_listing',
            path: res.folderPath || undefined,
            items,
          };
          repositoryFacts.push(fact);
          break;
        }

        case 'run_terminal_command': {
          const fact: TerminalFact = {
            command: res.command || 'terminal_command',
            stdout: typeof res.output === 'string' ? res.output : JSON.stringify(res),
            stderr: res.stderr || undefined,
            exitCode: typeof res.exitCode === 'number' ? res.exitCode : 0,
          };
          terminalFacts.push(fact);
          break;
        }

        default: {
          // Future tool facts can be handled here cleanly
          break;
        }
      }
    }

    return {
      executionResults,
      repositoryFacts: Object.freeze(repositoryFacts),
      terminalFacts: Object.freeze(terminalFacts),
    };
  }
}
