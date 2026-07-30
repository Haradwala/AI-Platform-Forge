/**
 * cli-stream.ts
 *
 * Line-buffered stream processing with event listeners and backpressure control.
 */
import { EventEmitter } from 'events';
import type { Readable } from 'stream';
export declare class CLIStream extends EventEmitter {
    private stdoutBuffer;
    private stderrBuffer;
    attachStdout(stream: Readable): void;
    attachStderr(stream: Readable): void;
    flush(): void;
}
