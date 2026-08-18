/**
 * result-normalizer.ts — Tool Result Payload Normalizer
 *
 * Normalizes raw or legacy tool return objects into canonical payload shapes
 * before contract validation and entity extraction.
 */
import { ExecutionResult } from '../contracts/execution-envelope';
export declare class ResultNormalizer {
    /**
     * Normalizes an ExecutionResult envelope.
     */
    normalize<T>(result: ExecutionResult<T>): ExecutionResult<T>;
}
