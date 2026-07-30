/**
 * cli-stream.ts
 *
 * Line-buffered stream processing with event listeners and backpressure control.
 */

import { EventEmitter } from 'events';
import type { Readable } from 'stream';

export class CLIStream extends EventEmitter {
  private stdoutBuffer = '';
  private stderrBuffer = '';

  attachStdout(stream: Readable): void {
    stream.on('data', (chunk: Buffer | string) => {
      const text = chunk.toString();
      this.emit('stdout', text);
      this.stdoutBuffer += text;

      const lines = this.stdoutBuffer.split('\n');
      this.stdoutBuffer = lines.pop() || '';
      for (const line of lines) {
        this.emit('line', line);
      }
    });
  }

  attachStderr(stream: Readable): void {
    stream.on('data', (chunk: Buffer | string) => {
      const text = chunk.toString();
      this.emit('stderr', text);
      this.stderrBuffer += text;

      const lines = this.stderrBuffer.split('\n');
      this.stderrBuffer = lines.pop() || '';
      for (const line of lines) {
        this.emit('stderrLine', line);
      }
    });
  }

  flush(): void {
    if (this.stdoutBuffer) {
      this.emit('line', this.stdoutBuffer);
      this.stdoutBuffer = '';
    }
    if (this.stderrBuffer) {
      this.emit('stderrLine', this.stderrBuffer);
      this.stderrBuffer = '';
    }
  }
}
