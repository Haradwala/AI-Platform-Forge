import React, { useEffect, useRef } from 'react';
import { Terminal } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';
import 'xterm/css/xterm.css';

export const TerminalPanel: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const terminalRef = useRef<Terminal | null>(null);
  const fitAddonRef = useRef<FitAddon | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const sessionId = `session-${Date.now()}-${Math.floor(Math.random() * 1000000)}`;

    // ── 1. Initialize xterm.js ───────────────────────────────────────────────
    const term = new Terminal({
      cols: 80,
      rows: 24,
      theme: {
        background: '#0d0d11',
        foreground: '#e2e2e8',
        cursor: '#6366f1',
        cursorAccent: '#0d0d11',
        selectionBackground: 'rgba(99, 102, 241, 0.3)',
        black: '#1e1e2e',
        red: '#f38ba8',
        green: '#a6e3a1',
        yellow: '#f9e2af',
        blue: '#89b4fa',
        magenta: '#cba6f7',
        cyan: '#89dceb',
        white: '#cdd6f4',
        brightBlack: '#45475a',
        brightRed: '#f38ba8',
        brightGreen: '#a6e3a1',
        brightYellow: '#f9e2af',
        brightBlue: '#89b4fa',
        brightMagenta: '#cba6f7',
        brightCyan: '#89dceb',
        brightWhite: '#cdd6f4',
      },
      fontSize: 12,
      fontFamily: '"JetBrains Mono", "Fira Code", "Cascadia Code", Consolas, monospace',
      cursorBlink: true,
      allowTransparency: true,
      scrollback: 5000,
    });

    const fitAddon = new FitAddon();
    term.loadAddon(fitAddon);
    fitAddonRef.current = fitAddon;
    terminalRef.current = term;
    term.open(containerRef.current);
    // Defer fit until the browser has fully committed layout (two frames).
    // Single rAF is sometimes still too early in Electron when the terminal
    // panel transitions from hidden to visible — the viewport dimensions are
    // still 0 on the first frame. Double rAF ensures layout has settled.
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        const addon = fitAddonRef.current;
        const termObj = terminalRef.current as any;
        if (addon && termObj?.element && termObj?._core?._viewport) {
          try { addon.fit(); } catch { /* disposed before frame */ }
        }
      });
    });

    // ── 2. Connect to Electron node-pty via forge.terminal bridge ────────────
    let isSpawned = false;
    const cleanupFns: Array<() => void> = [];
    let spawnTimeout: any = null;

    if (typeof window !== 'undefined' && window.forge?.terminal) {
      const forgeTerminal = window.forge.terminal;

      // Debounce spawning to prevent React StrictMode duplicate spawn/kill cycles
      spawnTimeout = setTimeout(() => {
        isSpawned = true;
        forgeTerminal.create(sessionId).catch((err: unknown) => {
          term.writeln(`\r\n\x1b[1;31m[Terminal] Failed to create session: ${err}\x1b[0m\r\n`);
        });

        // Forward user keystrokes → pty
        term.onData((data: string) => {
          forgeTerminal.write(sessionId, data);
        });
      }, 100);

      // Receive pty output and write it to the xterm.js display
      const unsubData = forgeTerminal.onData(sessionId, (data: string) => {
        term.write(data);
      });
      cleanupFns.push(unsubData);

      // Listen for pty process exit
      const unsubExit = forgeTerminal.onExit(sessionId, ({ exitCode }) => {
        term.writeln(`\r\n\x1b[1;33m[Terminal] Session exited (code ${exitCode}).\x1b[0m`);
      });
      cleanupFns.push(unsubExit);
    } else {
      // ── Fallback: local web mock (non-Electron / dev browser context) ─────
      term.writeln('\x1b[1;32mForge Terminal\x1b[0m \x1b[90m(local mock — not running in Electron)\x1b[0m');
      term.write('\r\nPS C:\\forge> ');
      term.onData((data: string) => {
        if (data === '\r') {
          term.write('\r\nPS C:\\forge> ');
        } else if (data === '\x7f') {
          // Backspace
          term.write('\b \b');
        } else {
          term.write(data);
        }
      });
    }

    // ── 3. Handle resize with FitAddon + ResizeObserver ─────────────────────
    const resizeObserver = new ResizeObserver(() => {
      const container = containerRef.current;
      const term = terminalRef.current;
      if (!container || !term || !term.element) return;

      // Visibility & Geometry guards: never call fit when element has height <= 10px (collapsed)
      const { clientWidth, clientHeight } = container;
      if (clientWidth <= 10 || clientHeight <= 10) return;

      requestAnimationFrame(() => {
        if (!containerRef.current || !terminalRef.current || !terminalRef.current.element) return;
        try {
          const addon = fitAddonRef.current;
          const termObj = terminalRef.current as any;
          if (addon && termObj?._core?._viewport) {
            addon.fit();
            const { cols, rows } = terminalRef.current;
            if (typeof window !== 'undefined' && window.forge?.terminal && isSpawned && cols > 0 && rows > 0) {
              window.forge.terminal.resize(sessionId, cols, rows);
            }
          }
        } catch {
          // Fit may throw if terminal or viewport is disposed
        }
      });
    });
    resizeObserver.observe(containerRef.current);

    // ── Cleanup ──────────────────────────────────────────────────────────────
    return () => {
      if (spawnTimeout) {
        clearTimeout(spawnTimeout);
      }
      resizeObserver.disconnect();
      cleanupFns.forEach((fn) => fn());
      if (typeof window !== 'undefined' && window.forge?.terminal) {
        if (isSpawned) {
          window.forge.terminal.kill(sessionId);
        }
      }
      term.dispose();
    };
  }, []);

  return React.createElement('div', {
    ref: containerRef,
    id: 'forge-terminal-container',
    className: 'w-full h-full bg-[#0d0d11] p-1 overflow-hidden',
    style: { minHeight: '80px' },
  });
};

export default TerminalPanel;
