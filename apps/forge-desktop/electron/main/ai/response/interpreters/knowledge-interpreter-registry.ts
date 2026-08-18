/**
 * knowledge-interpreter-registry.ts
 *
 * Open/Closed Registry mapping ExecutionResultKind to IKnowledgeInterpreter strategies.
 * Accepts strategies via Dependency Injection.
 */

import { ExecutionResultKind } from '../../contracts/execution-result-kind';
import type { ExecutionResult } from '../../contracts/execution-envelope';
import type { KnowledgeFact } from '../response-types';
import type { IKnowledgeInterpreter } from './knowledge-interpreter-strategy';

export class KnowledgeInterpreterRegistry {
  private readonly strategyMap = new Map<ExecutionResultKind, IKnowledgeInterpreter>();

  constructor(interpreters: IKnowledgeInterpreter[] = []) {
    for (const interpreter of interpreters) {
      this.register(interpreter);
    }
  }

  register(interpreter: IKnowledgeInterpreter): void {
    this.strategyMap.set(interpreter.kind, interpreter);
  }

  interpret(result: ExecutionResult<any>): KnowledgeFact[] {
    if (!result || !result.kind) return [];
    const strategy = this.strategyMap.get(result.kind);
    if (!strategy) return [];
    return strategy.interpret(result);
  }
}
