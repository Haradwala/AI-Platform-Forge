/**
 * external-stream-parser.ts — Phase 18 External Runtime Foundation
 *
 * Normalizes output stdout/stderr streams into standardized stream events:
 * token, message, tool_call, status, error, progress, complete.
 */

import { EventEmitter } from 'events';
import type { NormalizedStreamEvent, StreamEventType } from './external-types';

export class ExternalStreamParser extends EventEmitter {
  private buffer: string = '';

  /**
   * Pushes raw stdout/stderr chunks into the parser.
   */
  writeChunk(chunk: string | Buffer): void {
    const text = typeof chunk === 'string' ? chunk : chunk.toString('utf-8');
    this.buffer += text;

    const lines = this.buffer.split(/\r?\n/);
    // Keep incomplete line in buffer
    this.buffer = lines.pop() || '';

    for (const line of lines) {
      if (line.trim()) {
        this.parseLine(line.trim());
      }
    }
  }

  /**
   * Flushes any remaining data when process terminates.
   */
  flush(): void {
    if (this.buffer.trim()) {
      this.parseLine(this.buffer.trim());
      this.buffer = '';
    }
    this.emitEvent('complete', { status: 'completed' });
  }

  private parseLine(line: string): void {
    // 1. Check if JSON-RPC or JSON structured log event
    if (line.startsWith('{') && line.endsWith('}')) {
      try {
        const json = JSON.parse(line);
        if (json.type) {
          this.emitEvent(this.mapJsonEventType(json.type), {
            text: json.text || json.content || json.message,
            toolName: json.toolName || json.tool_name,
            toolArgs: json.args || json.params,
            error: json.error,
            status: json.status,
            progress: json.progress,
          });
          return;
        }
      } catch {
        // Fall through to plain text parsing if JSON parse fails
      }
    }

    // 2. Check for tool execution markers
    if (line.includes('[TOOL_CALL]') || line.includes('Tool:')) {
      this.emitEvent('tool_call', {
        toolName: line.replace(/.*\[TOOL_CALL\]\s*/, '').split(' ')[0],
        message: line,
      });
      return;
    }

    // 3. Check for error markers
    if (line.toLowerCase().includes('error:') || line.startsWith('ERR!')) {
      this.emitEvent('error', { error: line });
      return;
    }

    // 4. Default stream token/message line
    this.emitEvent('token', { text: line + '\n' });
  }

  private mapJsonEventType(type: string): StreamEventType {
    switch (type) {
      case 'token':
      case 'chunk':
      case 'delta':
        return 'token';
      case 'tool':
      case 'tool_call':
        return 'tool_call';
      case 'status':
        return 'status';
      case 'error':
        return 'error';
      case 'progress':
        return 'progress';
      case 'complete':
      case 'done':
        return 'complete';
      default:
        return 'message';
    }
  }

  private emitEvent(type: StreamEventType, payload: NormalizedStreamEvent['payload']): void {
    const event: NormalizedStreamEvent = {
      type,
      payload,
      timestamp: Date.now(),
    };
    this.emit('event', event);
    this.emit(type, event);
  }
}
