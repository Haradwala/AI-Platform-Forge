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
exports.TerminalService = void 0;
const pty = __importStar(require("node-pty"));
const os = __importStar(require("os"));
/**
 * TerminalService — Production implementation using node-pty.
 *
 * Each terminal session is a real OS pseudo-terminal (pty) process.
 * - Windows: PowerShell by default
 * - macOS/Linux: the user's $SHELL (fallback: /bin/bash)
 *
 * Data flow:
 *   pty.onData  → IDesktopEventBus.emit(`terminal:data:<id>`)  → IPC → renderer (xterm.js)
 *   renderer    → IPC → TerminalService.write(id, data)         → pty.write(data)
 *   renderer    → IPC → TerminalService.resize(id, cols, rows)  → pty.resize(cols, rows)
 *   renderer    → IPC → TerminalService.kill(id)               → pty.kill()
 */
class TerminalService {
    logger;
    eventBus;
    sessions = new Map();
    constructor(logger, eventBus) {
        this.logger = logger;
        this.eventBus = eventBus;
    }
    // ── Helpers ────────────────────────────────────────────────────────────────
    getShell() {
        if (os.platform() === 'win32') {
            return { shell: 'powershell.exe', args: [] };
        }
        return { shell: process.env.SHELL ?? '/bin/bash', args: [] };
    }
    // ── ITerminalService ───────────────────────────────────────────────────────
    async create(id) {
        if (this.sessions.has(id)) {
            this.logger.warn(`[TerminalService] Session "${id}" already exists.`);
            return;
        }
        const { shell, args } = this.getShell();
        let ptyProcess;
        try {
            ptyProcess = pty.spawn(shell, args, {
                name: 'xterm-256color',
                cols: 80,
                rows: 24,
                cwd: process.env.HOME ?? process.cwd(),
                env: process.env,
            });
        }
        catch (err) {
            this.logger.error(`[TerminalService] Failed to spawn pty for session "${id}":`, err);
            throw err;
        }
        this.sessions.set(id, ptyProcess);
        this.logger.info(`[TerminalService] Created session "${id}" — PID: ${ptyProcess.pid}`);
        // Forward pty output to the event bus (which terminal-handlers bridges to IPC)
        ptyProcess.onData((data) => {
            this.eventBus.emit(`terminal:data:${id}`, data);
        });
        ptyProcess.onExit(({ exitCode, signal }) => {
            this.logger.info(`[TerminalService] Session "${id}" exited (code=${exitCode}, signal=${signal})`);
            this.sessions.delete(id);
            // Notify renderer that this terminal is gone
            this.eventBus.emit(`terminal:exit:${id}`, { exitCode, signal });
        });
    }
    write(id, data) {
        const session = this.sessions.get(id);
        if (!session) {
            this.logger.warn(`[TerminalService] write() — session "${id}" not found.`);
            return;
        }
        session.write(data);
    }
    resize(id, cols, rows) {
        const session = this.sessions.get(id);
        if (!session)
            return;
        const safeCols = Math.max(2, cols);
        const safeRows = Math.max(1, rows);
        try {
            session.resize(safeCols, safeRows);
        }
        catch (err) {
            // Some platforms throw if the process has already exited — ignore
            this.logger.debug(`[TerminalService] resize() ignored for "${id}":`, err);
        }
    }
    async kill(id) {
        const session = this.sessions.get(id);
        if (!session)
            return;
        try {
            session.kill();
        }
        catch (err) {
            // Process already exited or AttachConsole failed — ignore gracefully
            this.logger.debug(`[TerminalService] Session "${id}" already exited on kill:`, err);
        }
        this.sessions.delete(id);
        this.logger.info(`[TerminalService] Killed session "${id}".`);
    }
    /** Returns the number of active pty sessions. */
    get sessionCount() {
        return this.sessions.size;
    }
}
exports.TerminalService = TerminalService;
exports.default = TerminalService;
//# sourceMappingURL=terminal-service.js.map