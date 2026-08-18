/**
 * knowledge-interpreter-registry.ts
 *
 * Open/Closed Registry mapping ExecutionResultKind to IKnowledgeInterpreter strategies.
 * Accepts strategies via Dependency Injection.
 */
import type { ExecutionResult } from '../../contracts/execution-envelope';
import type { KnowledgeFact } from '../response-types';
import type { IKnowledgeInterpreter } from './knowledge-interpreter-strategy';
export declare class KnowledgeInterpreterRegistry {
    private readonly strategyMap;
    constructor(interpreters?: IKnowledgeInterpreter[]);
    register(interpreter: IKnowledgeInterpreter): void;
    interpret(result: ExecutionResult<any>): KnowledgeFact[];
}
