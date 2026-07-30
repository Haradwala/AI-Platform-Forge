"use strict";
/**
 * capability-matcher.ts — Phase 25-28 Runtime Capability Matcher
 *
 * Evaluates requested capabilities in ExecutionRequest against runtime capabilities.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.CapabilityMatcher = void 0;
class CapabilityMatcher {
    /**
     * Filters candidates that satisfy all required capabilities of the ExecutionRequest.
     */
    matchCandidates(request, candidates) {
        return candidates.filter((candidate) => {
            if (!candidate.isAvailable)
                return false;
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
exports.CapabilityMatcher = CapabilityMatcher;
//# sourceMappingURL=capability-matcher.js.map