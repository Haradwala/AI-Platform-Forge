"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileSink = void 0;
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
/**
 * FileSink — writes structured log entries to a daily rotating log file.
 *
 * Path: <logDir>/forge-YYYY-MM-DD.log
 * Format: JSON Lines — one JSON object per line.
 *
 * - Opens the file lazily on first write.
 * - Rotates the file descriptor when the calendar day changes.
 * - flush() flushes pending writes.
 * - dispose() closes the file descriptor.
 */
class FileSink {
    logDir;
    name = 'FileSink';
    fd = null;
    currentDate = '';
    queue = [];
    flushing = false;
    constructor(logDir) {
        this.logDir = logDir;
        fs.mkdirSync(logDir, { recursive: true });
    }
    write(entry) {
        const line = JSON.stringify({
            ts: entry.timestamp,
            level: entry.level,
            ns: entry.namespace,
            msg: entry.message,
            args: entry.args.length > 0 ? entry.args : undefined,
        }) + '\n';
        this.queue.push(line);
        this.drainQueue();
    }
    async flush() {
        await new Promise((resolve) => {
            const drain = () => {
                if (this.queue.length === 0) {
                    resolve();
                    return;
                }
                setTimeout(drain, 5);
            };
            drain();
        });
    }
    dispose() {
        if (this.fd !== null) {
            try {
                fs.closeSync(this.fd);
            }
            catch { /* no-op */ }
            this.fd = null;
        }
    }
    // ─── Private ───────────────────────────────────────────────────────────────
    drainQueue() {
        if (this.flushing || this.queue.length === 0)
            return;
        this.flushing = true;
        const ensureFd = () => {
            const today = new Date().toISOString().substring(0, 10); // YYYY-MM-DD
            if (this.currentDate !== today) {
                this.dispose(); // close old fd
                this.currentDate = today;
                const filePath = path.join(this.logDir, `forge-${today}.log`);
                this.fd = fs.openSync(filePath, 'a');
            }
        };
        // Batch all queued lines into one write
        try {
            ensureFd();
            const batch = this.queue.splice(0, this.queue.length).join('');
            if (this.fd !== null) {
                fs.writeSync(this.fd, batch);
            }
        }
        catch (err) {
            console.error('[FileSink] Write error:', err);
        }
        finally {
            this.flushing = false;
            if (this.queue.length > 0)
                this.drainQueue();
        }
    }
}
exports.FileSink = FileSink;
//# sourceMappingURL=file-sink.js.map