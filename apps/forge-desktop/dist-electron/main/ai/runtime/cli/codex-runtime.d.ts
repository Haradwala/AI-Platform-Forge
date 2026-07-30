/**
 * codex-runtime.ts
 *
 * Codex CLI Runtime implementation.
 */
import { BaseCLIRuntime } from './cli-runtime';
import type { ICLIManager } from '../../../container/service-interfaces';
export declare class CodexCLIRuntime extends BaseCLIRuntime {
    readonly id = "codex-cli";
    readonly name = "Codex CLI";
    readonly defaultExecutable = "codex";
    readonly defaultArgs: string[];
    constructor(cliManager: ICLIManager);
    listAvailableModels(): Promise<string[]>;
}
