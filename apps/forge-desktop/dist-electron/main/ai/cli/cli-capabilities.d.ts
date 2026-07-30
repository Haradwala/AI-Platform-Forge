/**
 * cli-capabilities.ts — Phase 19 Generic CLI Runtime
 *
 * Capabilities contract reported by every CLI agent adapter.
 */
export interface CLICapabilities {
    streaming: boolean;
    images: boolean;
    tools: boolean;
    resume: boolean;
    memory: boolean;
    mcp: boolean;
    approval: boolean;
    vision: boolean;
    json: boolean;
    structuredOutput: boolean;
}
export declare function createCapabilities(overrides?: Partial<CLICapabilities>): CLICapabilities;
