/**
 * claude-runtime.ts
 *
 * Claude Code CLI Runtime implementation.
 */
import { BaseCLIRuntime } from './cli-runtime';
import type { ICLIManager } from '../../../container/service-interfaces';
export declare class ClaudeCodeRuntime extends BaseCLIRuntime {
    readonly id = "claude-code-cli";
    readonly name = "Claude Code CLI";
    readonly defaultExecutable = "claude";
    readonly defaultArgs: string[];
    constructor(cliManager: ICLIManager);
    listAvailableModels(): Promise<string[]>;
}
