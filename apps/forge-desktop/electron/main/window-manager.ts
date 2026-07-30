import { BrowserWindow, shell } from 'electron';
import * as path from 'path';

// ─── Types ───────────────────────────────────────────────────────────────────

export interface WindowManagerOptions {
  readonly isDev: boolean;
  readonly devServerUrl: string;
}

export interface IWindowState {
  readonly isMaximized: boolean;
  readonly isMinimized: boolean;
  readonly isFullscreen: boolean;
  readonly isFocused: boolean;
  readonly width: number;
  readonly height: number;
  readonly x: number | undefined;
  readonly y: number | undefined;
}

// ─── WindowManager ───────────────────────────────────────────────────────────

/**
 * WindowManager owns the main BrowserWindow lifecycle.
 *
 * Responsibilities:
 * - Create and configure the main BrowserWindow
 * - Load the renderer (Vite dev server or production dist)
 * - Expose typed window state queries
 * - Forward window state changes to the renderer (Epic 3+ via IPC)
 *
 * Epic 7 (Window Service) will extend this with the full IWindowService contract.
 * Epic 11 (Window Registry) will register windows here for multi-window support.
 */
export class WindowManager {
  private mainWindow: BrowserWindow | null = null;
  private readonly options: WindowManagerOptions;

  constructor(options: WindowManagerOptions) {
    this.options = options;
  }

  // ── Public API ─────────────────────────────────────────────────────────────

  async createMainWindow(): Promise<BrowserWindow> {
    const win = new BrowserWindow({
      width: 1280,
      height: 800,
      minWidth: 800,
      minHeight: 600,
      show: false, // prevent flash of unstyled content — shown after ready-to-show
      titleBarStyle: 'hiddenInset', // macOS: native traffic lights, custom title bar area
      frame: process.platform !== 'darwin', // Windows/Linux: use OS frame; macOS: frameless
      backgroundColor: '#0f0f13', // match --forge-bg to prevent white flash
      webPreferences: {
        preload: path.join(__dirname, '..', 'preload', 'index.js'),
        contextIsolation: true,   // Security: renderer cannot access Node APIs
        nodeIntegration: false,   // Security: no require() in renderer
        sandbox: false,           // preload needs access to Node APIs
        webSecurity: true,
        allowRunningInsecureContent: false,
        experimentalFeatures: false,
      },
      icon: this.getAppIconPath(),
    });

    // ── Load URL ──────────────────────────────────────────────────────────────
    if (this.options.isDev) {
      await win.loadURL(this.options.devServerUrl);
      win.webContents.openDevTools({ mode: 'detach' });
    } else {
      await win.loadFile(
        path.join(__dirname, '..', '..', 'dist', 'index.html'),
      );
    }

    // ── Show after paint ──────────────────────────────────────────────────────
    win.once('ready-to-show', () => {
      win.show();
      win.focus();
    });

    // ── Open external links in the OS browser ─────────────────────────────────
    win.webContents.setWindowOpenHandler(({ url }) => {
      if (url.startsWith('https://') || url.startsWith('http://')) {
        shell.openExternal(url);
      }
      return { action: 'deny' };
    });

    // ── Cleanup ───────────────────────────────────────────────────────────────
    win.on('closed', () => {
      this.mainWindow = null;
    });

    this.mainWindow = win;
    return win;
  }

  getMainWindow(): BrowserWindow | null {
    return this.mainWindow;
  }

  getWindowState(): IWindowState | null {
    if (!this.mainWindow) return null;
    const bounds = this.mainWindow.getBounds();
    return {
      isMaximized:  this.mainWindow.isMaximized(),
      isMinimized:  this.mainWindow.isMinimized(),
      isFullscreen: this.mainWindow.isFullScreen(),
      isFocused:    this.mainWindow.isFocused(),
      width:  bounds.width,
      height: bounds.height,
      x: bounds.x,
      y: bounds.y,
    };
  }

  maximize(): void {
    this.mainWindow?.maximize();
  }

  unmaximize(): void {
    this.mainWindow?.unmaximize();
  }

  minimize(): void {
    this.mainWindow?.minimize();
  }

  close(): void {
    this.mainWindow?.close();
  }

  toggleFullscreen(): void {
    if (!this.mainWindow) return;
    this.mainWindow.setFullScreen(!this.mainWindow.isFullScreen());
  }

  // ── Private helpers ────────────────────────────────────────────────────────

  private getAppIconPath(): string | undefined {
    const assetsDir = path.join(__dirname, '..', '..', '..', '..', 'assets', 'icons');
    switch (process.platform) {
      case 'win32':  return path.join(assetsDir, 'icon.ico');
      case 'darwin': return path.join(assetsDir, 'icon.icns');
      default:       return path.join(assetsDir, 'icon.png');
    }
  }
}
