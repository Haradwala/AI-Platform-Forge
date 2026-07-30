/**
 * runtime-scorer.ts — Phase 25-28 Multi-Factor Dynamic Runtime Scorer
 *
 * Scores candidate runtimes based on Capability, Availability, Health, Historical Success,
 * Latency, User Preference, and Offline/Local priority.
 */
import { ExecutionRequest } from '../contracts/execution-contracts';
import { RuntimeCandidateInfo } from './capability-matcher';
export interface ScoredRuntimeCandidate {
    candidate: RuntimeCandidateInfo;
    score: number;
    breakdown: {
        capabilityScore: number;
        healthScore: number;
        latencyScore: number;
        historicalScore: number;
        preferenceScore: number;
        offlineScore: number;
    };
}
export declare class RuntimeScorer {
    scoreCandidates(request: ExecutionRequest, candidates: RuntimeCandidateInfo[], historicalScores?: Record<string, number>): ScoredRuntimeCandidate[];
}
