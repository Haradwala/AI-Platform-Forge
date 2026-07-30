"use strict";
/**
 * cli-capabilities.ts — Phase 19 Generic CLI Runtime
 *
 * Capabilities contract reported by every CLI agent adapter.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.createCapabilities = createCapabilities;
function createCapabilities(overrides) {
    return {
        streaming: true,
        images: false,
        tools: true,
        resume: true,
        memory: false,
        mcp: false,
        approval: true,
        vision: false,
        json: true,
        structuredOutput: true,
        ...overrides,
    };
}
//# sourceMappingURL=cli-capabilities.js.map