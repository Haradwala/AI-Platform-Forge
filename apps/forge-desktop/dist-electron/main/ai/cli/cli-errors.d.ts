/**
 * cli-errors.ts — Phase 19 Generic CLI Runtime
 *
 * Custom error hierarchy for CLI runtime operations, discovery, launching, adapters, and stream parsing.
 */
export declare class CLIError extends Error {
    readonly code?: string | undefined;
    constructor(message: string, code?: string | undefined);
}
export declare class DiscoveryError extends CLIError {
    readonly executablePath?: string | undefined;
    constructor(message: string, executablePath?: string | undefined);
}
export declare class LaunchError extends CLIError {
    readonly command?: string | undefined;
    constructor(message: string, command?: string | undefined);
}
export declare class AdapterError extends CLIError {
    readonly adapterId?: string | undefined;
    constructor(message: string, adapterId?: string | undefined);
}
export declare class ParsingError extends CLIError {
    readonly rawChunk?: string | undefined;
    constructor(message: string, rawChunk?: string | undefined);
}
