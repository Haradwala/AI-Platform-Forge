/**
 * gemini-runtime.ts
 *
 * Gemini CLI Runtime implementation.
 */
import { BaseCLIRuntime } from './cli-runtime';
import type { ICLIManager } from '../../../container/service-interfaces';
export declare class GeminiCLIRuntime extends BaseCLIRuntime {
    readonly id = "gemini-cli";
    readonly name = "Gemini CLI";
    readonly defaultExecutable = "gemini";
    readonly defaultArgs: string[];
    constructor(cliManager: ICLIManager);
    listAvailableModels(): Promise<string[]>;
}
