/**
 * external-stream-parser.ts — Phase 18 External Runtime Foundation
 *
 * Normalizes output stdout/stderr streams into standardized stream events:
 * token, message, tool_call, status, error, progress, complete.
 */
import { EventEmitter } from 'events';
export declare class ExternalStreamParser extends EventEmitter {
    private buffer;
    /**
     * Pushes raw stdout/stderr chunks into the parser.
     */
    writeChunk(chunk: string | Buffer): void;
    /**
     * Flushes any remaining data when process terminates.
     */
    flush(): void;
    private parseLine;
    private mapJsonEventType;
    private emitEvent;
}
