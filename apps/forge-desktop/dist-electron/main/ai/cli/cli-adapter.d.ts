/**
 * cli-adapter.ts — Phase 19 Generic CLI Runtime
 *
 * Interface contract that must be implemented by any provider-specific CLI agent adapter.
 */
import type { CLICapabilities } from './cli-capabilities';
import type { NormalizedStreamEvent } from '../external/external-types';
export interface CLIAdapter {
    readonly id: string;
    readonly name: string;
    readonly version: string;
    /**
     * Checks if the binary / agent executable is installed and available on system.
     */
    detect(): Promise<boolean>;
    /**
     * Returns the command / binary name to execute (e.g. "claude", "gemini", "aider").
     */
    command(): string;
    /**
     * Constructs CLI flags and arguments for a prompt execution turn.
     */
    arguments(prompt: string, options?: Record<string, unknown>): string[];
    /**
     * Returns environment variable overrides for process invocation.
     */
    environment(options?: Record<string, unknown>): Record<string, string>;
    /**
     * Resolves target working directory for execution.
     */
    workingDirectory(options?: Record<string, unknown>): string;
    supportsStreaming(): boolean;
    supportsApproval(): boolean;
    supportsTools(): boolean;
    supportsImages(): boolean;
    supportsMCP(): boolean;
    supportsResume(): boolean;
    getCapabilities(): CLICapabilities;
    parseOutput(chunk: string): NormalizedStreamEvent[];
    parseProgress(chunk: string): number | null;
    parseErrors(chunk: string): string | null;
    parseToolCalls(chunk: string): Array<{
        name: string;
        args: Record<string, unknown>;
    }>;
}
