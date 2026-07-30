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

export function createCapabilities(overrides?: Partial<CLICapabilities>): CLICapabilities {
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
