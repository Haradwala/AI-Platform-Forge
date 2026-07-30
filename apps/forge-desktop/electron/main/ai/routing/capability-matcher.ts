/**
 * capability-matcher.ts — Phase 25-28 Runtime Capability Matcher
 *
 * Evaluates requested capabilities in ExecutionRequest against runtime capabilities.
 */

import { ExecutionRequest, RuntimeCapability } from '../contracts/execution-contracts';

export interface RuntimeCandidateInfo {
  id: string;
  name: string;
  type: string;
  isAvailable: boolean;
  capabilities: Record<string, boolean>;
  latencyMs?: number;
  health?: 'healthy' | 'degraded' | 'unhealthy';
}

export class CapabilityMatcher {
  /**
   * Filters candidates that satisfy all required capabilities of the ExecutionRequest.
   */
  matchCandidates(request: ExecutionRequest, candidates: RuntimeCandidateInfo[]): RuntimeCandidateInfo[] {
    return candidates.filter((candidate) => {
      if (!candidate.isAvailable) return false;

      // Check each required capability
      for (const reqCap of request.capabilities) {
        if (!candidate.capabilities || !candidate.capabilities[reqCap]) {
          // If required capability is vision/reasoning/mcp, strictly enforce
          if (['vision', 'reasoning', 'mcp', 'images'].includes(reqCap)) {
            return false;
          }
        }
      }

      // Check local requirement
      if (request.requiresLocal && candidate.type !== 'cli' && candidate.type !== 'local' && candidate.id !== 'ollama') {
        return false;
      }

      return true;
    });
  }
}
