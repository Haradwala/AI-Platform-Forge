/**
 * TerminalPanel.tsx — Stateful Terminal Panel with Lifecycle Management
 */

import React, { useEffect, useRef } from 'react';
import { Terminal } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';
import 'xterm/css/xterm.css';
import { PanelLifecycleRegistry } from '../../components/dock/PanelLifecycleRegistry';

export const TerminalPanel: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const terminalRef = useRef<Terminal | null>(null);
  const fitAddonRef = useRef<FitAddon | null>(null);
  const resizeObserverRef = useRef<ResizeObserver | null>(null);
  const sessionIdRef = useRef<string>(`session-${Date.now()}-${Math.floor(Math.random() * 1000000)}`);
  const isSpawnedRef = useRef<boolean>(false);
  const isSuspendedRef = useRef<boolean>(false);

  useEffect(() => {
    if (!containerRef.current) return;
    const sessionId = sessionIdRef.current;

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

    // Perform initial double-rAF layout fit
    const performFit = () => {
      if (isSuspendedRef.current) return;
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          const addon = fitAddonRef.current;
          const termObj = terminalRef.current as any;
          if (addon && termObj?.element && termObj?._core?._viewport && !isSuspendedRef.current) {
            try {
              addon.fit();
              const { cols, rows } = terminalRef.current!;
              if (typeof window !== 'undefined' && window.forge?.terminal && isSpawnedRef.current && cols > 0 && rows > 0) {
                window.forge.terminal.resize(sessionId, cols, rows);
              }
            } catch {
              /* term disposed before frame */
            }
          }
        });
      });
    };

    performFit();

    // ── 2. Connect to Electron node-pty via forge.terminal bridge ────────────
    const cleanupFns: Array<() => void> = [];
    let spawnTimeout: any = null;

    if (typeof window !== 'undefined' && window.forge?.terminal) {
      const forgeTerminal = window.forge.terminal;

      spawnTimeout = setTimeout(() => {
        isSpawnedRef.current = true;
        forgeTerminal.create(sessionId).catch((err: unknown) => {
          term.writeln(`\r\n\x1b[1;31m[Terminal] Failed to create session: ${err}\x1b[0m\r\n`);
        });

        term.onData((data: string) => {
          if (isSpawnedRef.current && !isSuspendedRef.current) {
            forgeTerminal.write(sessionId, data);
          }
        });
      }, 100);

      const unsubData = forgeTerminal.onData(sessionId, (data: string) => {
        term.write(data);
      });
      cleanupFns.push(unsubData);

      const unsubExit = forgeTerminal.onExit(sessionId, ({ exitCode }) => {
        term.writeln(`\r\n\x1b[1;33m[Terminal] Session exited (code ${exitCode}).\x1b[0m`);
      });
      cleanupFns.push(unsubExit);
    } else {
      // Local web mock fallback
      term.writeln('\x1b[1;32mForge Terminal\x1b[0m \x1b[90m(local mock — not running in Electron)\x1b[0m');
      term.write('\r\nPS C:\\forge> ');
      term.onData((data: string) => {
        if (data === '\r') {
          term.write('\r\nPS C:\\forge> ');
        } else if (data === '\x7f') {
          term.write('\b \b');
        } else {
          term.write(data);
        }
      });
    }

    // ── 3. ResizeObserver Setup & Teardown ─────────────────────────────────────
    const setupResizeObserver = () => {
      if (resizeObserverRef.current) return;
      const observer = new ResizeObserver(() => {
        const container = containerRef.current;
        const term = terminalRef.current;
        if (!container || !term || !term.element || isSuspendedRef.current) return;

        const { clientWidth, clientHeight } = container;
        if (clientWidth <= 10 || clientHeight <= 10) return;

        performFit();
      });
      observer.observe(containerRef.current!);
      resizeObserverRef.current = observer;
    };

    const stopResizeObserver = () => {
      if (resizeObserverRef.current) {
        resizeObserverRef.current.disconnect();
        resizeObserverRef.current = null;
      }
    };

    setupResizeObserver();

    // ── 4. Register Panel Lifecycle Callbacks ──────────────────────────────────
    PanelLifecycleRegistry.register('terminal', {
      suspend: () => {
        isSuspendedRef.current = true;
        stopResizeObserver();
      },
      resume: () => {
        isSuspendedRef.current = false;
        setupResizeObserver();
        performFit();
      },
      dispose: () => {
        if (spawnTimeout) clearTimeout(spawnTimeout);
        stopResizeObserver();
        cleanupFns.forEach((fn) => fn());
        if (typeof window !== 'undefined' && window.forge?.terminal && isSpawnedRef.current) {
          window.forge.terminal.kill(sessionId);
        }
        term.dispose();
      },
    });

    // ── Cleanup on complete unmount ───────────────────────────────────────────
    return () => {
      PanelLifecycleRegistry.dispose('terminal');
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
