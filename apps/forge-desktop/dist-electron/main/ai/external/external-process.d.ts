/**
 * external-process.ts — Phase 18 External Runtime Foundation
 *
 * Low-level child process wrapper managing spawn, stdio, signals, cwd, env, and exit codes.
 */
import { EventEmitter } from 'events';
import type { ExternalProcessOptions } from './external-types';
export declare class ExternalProcess extends EventEmitter {
    private readonly options;
    private child;
    private isRunningState;
    private exitCode;
    constructor(options: ExternalProcessOptions);
    /**
     * Spawns the underlying process.
     */
    spawnProcess(): void;
    /**
     * Writes payload data to process stdin.
     */
    writeStdin(data: string): boolean;
    /**
     * Sends a POSIX or Windows signal to the process.
     */
    kill(signal?: NodeJS.Signals): void;
    isRunning(): boolean;
    getPid(): number | undefined;
    getExitCode(): number | null;
    dispose(): void;
}
