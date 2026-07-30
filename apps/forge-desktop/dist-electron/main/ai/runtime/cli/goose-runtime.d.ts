/**
 * goose-runtime.ts
 *
 * Goose CLI Runtime implementation.
 */
import { BaseCLIRuntime } from './cli-runtime';
import type { ICLIManager } from '../../../container/service-interfaces';
export declare class GooseCLIRuntime extends BaseCLIRuntime {
    readonly id = "goose-cli";
    readonly name = "Goose CLI Agent";
    readonly defaultExecutable = "goose";
    readonly defaultArgs: string[];
    constructor(cliManager: ICLIManager);
    listAvailableModels(): Promise<string[]>;
}
