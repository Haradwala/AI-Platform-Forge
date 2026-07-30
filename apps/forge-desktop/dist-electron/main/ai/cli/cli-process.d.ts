/**
 * cli-process.ts
 *
 * Child process wrapper managing spawn, stdin writing, termination, restarts, timeouts,
 * and graceful process kill logic.
 */
import type { CLISessionOptions, CLISessionStatus } from './cli-types';
import { CLIStream } from './cli-stream';
export declare class CLIProcess {
    private readonly command;
    private readonly args;
    private readonly options;
    private childProcess;
    private currentStatus;
    private timeoutTimer;
    readonly stream: CLIStream;
    constructor(command: string, args: string[] | undefined, options: CLISessionOptions);
    spawn(): void;
    write(input: string): void;
    terminate(): void;
    kill(): void;
    restart(): void;
    status(): CLISessionStatus;
    getPid(): number | undefined;
    private clearTimeoutTimer;
}
