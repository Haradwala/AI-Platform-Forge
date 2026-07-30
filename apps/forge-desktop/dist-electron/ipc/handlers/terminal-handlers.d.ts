import type { IDesktopContainer } from '../../main/container/interfaces';
import type { IIpcRouter } from '../../main/container/service-interfaces';
/**
 * Terminal IPC handlers — wires terminal IPC channels to TerminalService (node-pty).
 *
 * Data flow (main → renderer):
 *   TerminalService.create() → IDesktopEventBus.emit(`terminal:data:<id>`) →
 *   terminal-handlers (subscribed) → ctx.sender.send(`terminal:data:<id>`, data) →
 *   preload terminal.onData() → xterm.js
 *
 * Data flow (renderer → main):
 *   xterm.js keypress → forge.terminal.write() → IPC → TerminalService.write() → pty
 */
export declare function registerTerminalHandlers(router: IIpcRouter, container: IDesktopContainer): void;
