/**
 * capability-matcher.ts — Phase 25-28 Runtime Capability Matcher
 *
 * Evaluates requested capabilities in ExecutionRequest against runtime capabilities.
 */
import { ExecutionRequest } from '../contracts/execution-contracts';
export interface RuntimeCandidateInfo {
    id: string;
    name: string;
    type: string;
    isAvailable: boolean;
    capabilities: Record<string, boolean>;
    latencyMs?: number;
    health?: 'healthy' | 'degraded' | 'unhealthy';
}
export declare class CapabilityMatcher {
    /**
     * Filters candidates that satisfy all required capabilities of the ExecutionRequest.
     */
    matchCandidates(request: ExecutionRequest, candidates: RuntimeCandidateInfo[]): RuntimeCandidateInfo[];
}
