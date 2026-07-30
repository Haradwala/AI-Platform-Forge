/**
 * aider-runtime.ts
 *
 * Aider CLI Runtime implementation.
 */
import { BaseCLIRuntime } from './cli-runtime';
import type { ICLIManager } from '../../../container/service-interfaces';
export declare class AiderCLIRuntime extends BaseCLIRuntime {
    readonly id = "aider-cli";
    readonly name = "Aider CLI";
    readonly defaultExecutable = "aider";
    readonly defaultArgs: string[];
    constructor(cliManager: ICLIManager);
    listAvailableModels(): Promise<string[]>;
}
