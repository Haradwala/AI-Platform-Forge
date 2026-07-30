import * as pty from 'node-pty';
import * as os from 'os';
import type { ITerminalService, IDesktopLogger, IDesktopEventBus } from './container/service-interfaces';

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
export class TerminalService implements ITerminalService {
  private readonly logger: IDesktopLogger;
  private readonly eventBus: IDesktopEventBus;
  private readonly sessions = new Map<string, pty.IPty>();

  constructor(logger: IDesktopLogger, eventBus: IDesktopEventBus) {
    this.logger = logger;
    this.eventBus = eventBus;
  }

  // ── Helpers ────────────────────────────────────────────────────────────────

  private getShell(): { shell: string; args: string[] } {
    if (os.platform() === 'win32') {
      return { shell: 'powershell.exe', args: [] };
    }
    return { shell: process.env.SHELL ?? '/bin/bash', args: [] };
  }

  // ── ITerminalService ───────────────────────────────────────────────────────

  async create(id: string): Promise<void> {
    if (this.sessions.has(id)) {
      this.logger.warn(`[TerminalService] Session "${id}" already exists.`);
      return;
    }

    const { shell, args } = this.getShell();

    let ptyProcess: pty.IPty;
    try {
      ptyProcess = pty.spawn(shell, args, {
        name: 'xterm-256color',
        cols: 80,
        rows: 24,
        cwd: process.env.HOME ?? process.cwd(),
        env: process.env as Record<string, string>,
      });
    } catch (err) {
      this.logger.error(`[TerminalService] Failed to spawn pty for session "${id}":`, err);
      throw err;
    }

    this.sessions.set(id, ptyProcess);
    this.logger.info(`[TerminalService] Created session "${id}" — PID: ${ptyProcess.pid}`);

    // Forward pty output to the event bus (which terminal-handlers bridges to IPC)
    ptyProcess.onData((data: string) => {
      this.eventBus.emit(`terminal:data:${id}`, data);
    });

    ptyProcess.onExit(({ exitCode, signal }) => {
      this.logger.info(`[TerminalService] Session "${id}" exited (code=${exitCode}, signal=${signal})`);
      this.sessions.delete(id);
      // Notify renderer that this terminal is gone
      this.eventBus.emit(`terminal:exit:${id}`, { exitCode, signal });
    });
  }

  write(id: string, data: string): void {
    const session = this.sessions.get(id);
    if (!session) {
      this.logger.warn(`[TerminalService] write() — session "${id}" not found.`);
      return;
    }
    session.write(data);
  }

  resize(id: string, cols: number, rows: number): void {
    const session = this.sessions.get(id);
    if (!session) return;
    const safeCols = Math.max(2, cols);
    const safeRows = Math.max(1, rows);
    try {
      session.resize(safeCols, safeRows);
    } catch (err) {
      // Some platforms throw if the process has already exited — ignore
      this.logger.debug(`[TerminalService] resize() ignored for "${id}":`, err);
    }
  }

  async kill(id: string): Promise<void> {
    const session = this.sessions.get(id);
    if (!session) return;
    try {
      session.kill();
    } catch (err) {
      // Process already exited or AttachConsole failed — ignore gracefully
      this.logger.debug(`[TerminalService] Session "${id}" already exited on kill:`, err);
    }
    this.sessions.delete(id);
    this.logger.info(`[TerminalService] Killed session "${id}".`);
  }

  /** Returns the number of active pty sessions. */
  get sessionCount(): number {
    return this.sessions.size;
  }
}

export default TerminalService;
