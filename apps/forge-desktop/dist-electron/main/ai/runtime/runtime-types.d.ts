/**
 * runtime-types.ts
 *
 * Canonical type definitions for the Forge AI Runtime layer.
 *
 * "Runtime" is the generic term for any system that can execute AI requests:
 * local LLMs (Ollama, LM Studio), cloud APIs (OpenAI, Gemini, Anthropic),
 * CLI tools (Claude Code, Gemini CLI, Aider), MCP servers, or future agents.
 *
 * Backward-compatible with the existing IAiProvider / IProviderRegistry surface.
 */
import type { IAiProvider } from '../../container/service-interfaces';
/**
 * Broad category of an AI runtime.
 *
 * - `local`  — runs on the user's machine (Ollama, LM Studio)
 * - `cloud`  — remote API call (OpenAI, Gemini, Anthropic, Groq, OpenRouter)
 * - `cli`    — shell subprocess (Claude Code, Gemini CLI, Aider)
 * - `mcp`    — Model Context Protocol server
 * - `agent`  — downloadable autonomous agent
 */
export type RuntimeType = 'local' | 'cloud' | 'cli' | 'mcp' | 'agent';
export interface RuntimeHealth {
    /** Whether the runtime responded successfully to a ping. */
    readonly healthy: boolean;
    /** Round-trip latency in milliseconds. -1 if check was not attempted. */
    readonly latencyMs: number;
    /** Human-readable error message when healthy is false. */
    readonly error?: string;
}
/**
 * IAiRuntime — extends IAiProvider with runtime-layer metadata.
 *
 * Existing code that accepts IAiProvider continues to work unchanged because
 * IAiRuntime satisfies the IAiProvider contract.
 */
export interface IAiRuntime extends IAiProvider {
    /** Broad category of this runtime. */
    readonly runtimeType: RuntimeType;
    /**
     * Perform a lightweight availability check.
     * Local runtimes ping their server; cloud runtimes validate their API key.
     */
    healthCheck(): Promise<RuntimeHealth>;
    /**
     * Optional lifecycle hook — called once when the runtime is activated.
     * Reserved for Phase 2+ runtimes that require async setup (e.g. loading a
     * CLI subprocess, connecting to an MCP server).
     * Phase 1 implementations may omit this.
     */
    initialize?(): Promise<void>;
    /**
     * Optional lifecycle hook — called when the runtime is deactivated or the
     * application shuts down.
     * Phase 1 implementations may omit this.
     */
    dispose?(): Promise<void>;
}
/**
 * IRuntimeRegistry — type-safe version of the legacy IProviderRegistry,
 * operating over IAiRuntime instead of IAiProvider.
 */
export interface IRuntimeRegistry {
    register(runtime: IAiRuntime): void;
    getById(id: string): IAiRuntime | null;
    getAll(): IAiRuntime[];
}
/** Metadata exposed by the list() method. */
export interface RuntimeListEntry {
    readonly id: string;
    readonly name: string;
    readonly runtimeType: RuntimeType;
}
/**
 * IRuntimeManager — active-runtime lifecycle on top of IRuntimeRegistry.
 *
 * Also satisfies IProviderRegistry for backward compatibility:
 * getById() / getAll() on IRuntimeManager return IAiRuntime, which
 * structurally satisfies IAiProvider (same id, name, generateStream,
 * listAvailableModels fields).
 */
export interface IRuntimeManager extends IRuntimeRegistry {
    /**
     * Set the active runtime by id.
     * Throws if no runtime with that id is registered.
     */
    activate(id: string): void;
    /**
     * Return the currently active runtime.
     * Defaults to the first registered runtime if activate() was never called.
     */
    active(): IAiRuntime;
    /**
     * Refresh model lists for all local runtimes in the background.
     * Never throws; errors are silently swallowed.
     */
    discover(): Promise<void>;
    /**
     * Ping every registered runtime and return a health snapshot.
     * Each entry is independent; one failure does not affect others.
     */
    health(): Promise<Record<string, RuntimeHealth>>;
    /**
     * Return a lightweight metadata list of all registered runtimes.
     * Suitable for serialising over IPC.
     */
    list(): RuntimeListEntry[];
}
