/**
 * fact-interpreter.ts
 *
 * FactInterpreter / KnowledgeInterpreter — delegates execution result
 * interpretation to KnowledgeInterpreterRegistry strategy handlers.
 */

import type { IExecutionResult } from '../execution/execution-types';
import type { ExecutionResult } from '../contracts/execution-envelope';
import type { GroundedContext, RepositoryFact, TerminalFact, KnowledgeFact } from './response-types';
import { KnowledgeInterpreterRegistry } from './interpreters/knowledge-interpreter-registry';
import {
  WorkspaceStatsKnowledgeInterpreter,
  FileListKnowledgeInterpreter,
  SearchResultsKnowledgeInterpreter,
  FileContentKnowledgeInterpreter,
  TerminalOutputKnowledgeInterpreter,
  GitDiffKnowledgeInterpreter,
  ErrorTraceKnowledgeInterpreter,
} from './interpreters/knowledge-interpreter-strategy';

export class FactInterpreter {
  private readonly registry: KnowledgeInterpreterRegistry;

  constructor(registry?: KnowledgeInterpreterRegistry) {
    this.registry =
      registry ||
      new KnowledgeInterpreterRegistry([
        new WorkspaceStatsKnowledgeInterpreter(),
        new FileListKnowledgeInterpreter(),
        new SearchResultsKnowledgeInterpreter(),
        new FileContentKnowledgeInterpreter(),
        new TerminalOutputKnowledgeInterpreter(),
        new GitDiffKnowledgeInterpreter(),
        new ErrorTraceKnowledgeInterpreter(),
      ]);
  }

  /**
   * Interprets normalized ExecutionResult envelopes into GroundedContext facts.
   */
  interpret(executionResults: readonly IExecutionResult[]): GroundedContext {
    const repositoryFacts: RepositoryFact[] = [];
    const terminalFacts: TerminalFact[] = [];
    const knowledgeFacts: KnowledgeFact[] = [];

    for (const exec of executionResults) {
      if (exec.status !== 'completed' || !exec.result) {
        continue;
      }

      const envelope = exec.result as ExecutionResult<any>;
      const interpreted = this.registry.interpret(envelope);

      for (const fact of interpreted) {
        knowledgeFacts.push(fact);
        if (fact.kind === 'terminal_output') {
          terminalFacts.push(fact as TerminalFact);
        } else {
          repositoryFacts.push(fact as RepositoryFact);
        }
      }
    }

    return {
      executionResults,
      repositoryFacts: Object.freeze(repositoryFacts),
      terminalFacts: Object.freeze(terminalFacts),
      knowledgeFacts: Object.freeze(knowledgeFacts),
    };
  }
}
