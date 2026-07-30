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
export declare class TerminalService implements ITerminalService {
    private readonly logger;
    private readonly eventBus;
    private readonly sessions;
    constructor(logger: IDesktopLogger, eventBus: IDesktopEventBus);
    private getShell;
    create(id: string): Promise<void>;
    write(id: string, data: string): void;
    resize(id: string, cols: number, rows: number): void;
    kill(id: string): Promise<void>;
    /** Returns the number of active pty sessions. */
    get sessionCount(): number;
}
export default TerminalService;
