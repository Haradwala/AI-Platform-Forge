/**
 * cli-runtime.ts
 *
 * Base abstract class for CLI Runtimes (Claude Code, Gemini CLI, Codex CLI, Aider, Goose).
 * Bridges external CLI tools managed by CLIManager to Forge's IAiRuntime layer.
 */
import type { IAiRuntime, RuntimeHealth } from '../runtime-types';
import type { IAiTokenStream, ICLIManager } from '../../../container/service-interfaces';
export declare abstract class BaseCLIRuntime implements IAiRuntime {
    protected readonly cliManager: ICLIManager;
    abstract readonly id: string;
    abstract readonly name: string;
    readonly runtimeType = "cli";
    abstract readonly defaultExecutable: string;
    abstract readonly defaultArgs: string[];
    private activeSession;
    constructor(cliManager: ICLIManager);
    healthCheck(): Promise<RuntimeHealth>;
    generateStream(prompt: string, options?: Record<string, any>, signal?: AbortSignal): Promise<IAiTokenStream>;
    listAvailableModels(): Promise<string[]>;
}
