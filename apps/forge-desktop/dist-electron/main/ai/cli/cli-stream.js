"use strict";
/**
 * cli-stream.ts
 *
 * Line-buffered stream processing with event listeners and backpressure control.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.CLIStream = void 0;
const events_1 = require("events");
class CLIStream extends events_1.EventEmitter {
    stdoutBuffer = '';
    stderrBuffer = '';
    attachStdout(stream) {
        stream.on('data', (chunk) => {
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
    attachStderr(stream) {
        stream.on('data', (chunk) => {
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
    flush() {
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
exports.CLIStream = CLIStream;
//# sourceMappingURL=cli-stream.js.map