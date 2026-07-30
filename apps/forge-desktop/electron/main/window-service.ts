/**
 * WindowService — IPC facade over the real BrowserWindow.
 *
 * All window operations go through WindowService.
 * No other file may call BrowserWindow methods directly.
 * Receives its BrowserWindow reference via IWindowRegistry.
 */

import { BrowserWindow, shell, app } from 'electron';
import * as path from 'path';
import type { IWindowRegistry } from './window-registry';
import type { IWindowService, IWindowState, IDesktopLogger } from './container/service-interfaces';

export class WindowService implements IWindowService {
  constructor(
    private readonly registry: IWindowRegistry,
    private readonly logger: IDesktopLogger,
  ) {}

  private get win(): BrowserWindow | null {
    return this.registry.get('main');
  }

  async createMainWindow(): Promise<void> {
    if (this.registry.has('main')) {
      this.logger.warn('[WindowService] createMainWindow(): main window already exists');
      return;
    }

    const isDev = process.env.NODE_ENV === 'development' || !app.isPackaged;
    const devServerUrl = 'http://localhost:5173';

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

    // ── Register lifecycle listeners BEFORE loading content ────────────────────
    let windowShown = false;
    const showWindow = () => {
      if (!windowShown) {
        windowShown = true;
        win.show();
        win.focus();
      }
    };

    win.once('ready-to-show', () => {
      showWindow();
    });

    win.webContents?.on?.('did-finish-load', () => {
      showWindow();
    });

    // ── Open external links in the OS browser ─────────────────────────────────
    win.webContents.setWindowOpenHandler(({ url }) => {
      if (url.startsWith('https://') || url.startsWith('http://')) {
        shell.openExternal(url);
      }
      return { action: 'deny' };
    });

    // ── Load URL ──────────────────────────────────────────────────────────────
    if (isDev) {
      await win.loadURL(devServerUrl);
      win.webContents.openDevTools({ mode: 'detach' });
    } else {
      await win.loadFile(
        path.join(__dirname, '..', '..', 'dist', 'index.html'),
      );
    }

    // ── Register in the registry ──────────────────────────────────────────────
    this.registry.register('main', win);
    this.logger.info('[WindowService] Main window created and registered.');

    // ── Application Menu Configuration ───────────────────────────────────────
    this.setupApplicationMenu(win);
  }

  private setupApplicationMenu(win: BrowserWindow): void {
    try {
      const { Menu } = require('electron');
      const template: Array<any> = [
        {
          label: 'File',
          submenu: [
            {
              label: 'Open Folder...',
              accelerator: 'CmdOrCtrl+O',
              click: () => {
                win.webContents.send('menu:open-folder');
              }
            },
            { type: 'separator' },
            { role: 'quit' }
          ]
        },
        {
          label: 'Edit',
          submenu: [
            { role: 'undo' },
            { role: 'redo' },
            { type: 'separator' },
            { role: 'cut' },
            { role: 'copy' },
            { role: 'paste' },
            { role: 'selectAll' }
          ]
        },
        {
          label: 'View',
          submenu: [
            { role: 'reload' },
            { role: 'forceReload' },
            { role: 'toggleDevTools' },
            { type: 'separator' },
            {
              label: 'Terminal',
              accelerator: 'Ctrl+`',
              click: () => {
                win.webContents.send('menu:toggle-terminal');
              }
            },
            {
              label: 'Command Palette...',
              accelerator: 'CmdOrCtrl+Shift+P',
              click: () => {
                win.webContents.send('menu:toggle-command-palette');
              }
            },
            { type: 'separator' },
            { role: 'resetZoom' },
            { role: 'zoomIn' },
            { role: 'zoomOut' },
            { type: 'separator' },
            { role: 'togglefullscreen' }
          ]
        },
        {
          label: 'Window',
          submenu: [
            { role: 'minimize' },
            { role: 'zoom' },
            ...(process.platform === 'darwin'
              ? [
                  { type: 'separator' },
                  { role: 'front' },
                  { type: 'separator' },
                  { role: 'window' }
                ]
              : [
                  { role: 'close' }
                ])
          ]
        }
      ];

      if (process.platform === 'darwin') {
        template.unshift({
          label: app.name,
          submenu: [
            { role: 'about' },
            { type: 'separator' },
            { role: 'services' },
            { type: 'separator' },
            { role: 'hide' },
            { role: 'hideOthers' },
            { role: 'unhide' },
            { type: 'separator' },
            { role: 'quit' }
          ]
        });
      }

      const menu = Menu.buildFromTemplate(template);
      Menu.setApplicationMenu(menu);
    } catch (err) {
      this.logger.warn(`[WindowService] Failed to set application menu (likely mock context): ${err}`);
    }
  }

  closeMainWindow(): void {
    this.close();
  }

  maximize(): void {
    const w = this.win;
    if (!w) { this.logger.warn('[WindowService] maximize(): main window not found'); return; }
    w.maximize();
  }

  minimize(): void {
    const w = this.win;
    if (!w) { this.logger.warn('[WindowService] minimize(): main window not found'); return; }
    w.minimize();
  }

  restore(): void {
    const w = this.win;
    if (!w) { this.logger.warn('[WindowService] restore(): main window not found'); return; }
    if (w.isMaximized()) w.restore();
    if (w.isMinimized()) w.restore();
  }

  toggleFullscreen(): void {
    const w = this.win;
    if (!w) { this.logger.warn('[WindowService] toggleFullscreen(): main window not found'); return; }
    w.setFullScreen(!w.isFullScreen());
  }

  close(): void {
    const w = this.win;
    if (!w) return;
    w.close();
  }

  focus(): void {
    const w = this.win;
    if (!w) return;
    if (w.isMinimized()) w.restore();
    w.focus();
  }

  hide(): void {
    this.win?.hide();
  }

  show(): void {
    this.win?.show();
  }

  setTitle(title: string): void {
    this.win?.setTitle(title);
  }

  flashFrame(flag: boolean): void {
    this.win?.flashFrame(flag);
  }

  getState(): IWindowState | null {
    const w = this.win;
    if (!w) return null;
    const [width, height] = w.getSize();
    const bounds = w.getBounds();
    return {
      width,
      height,
      x: bounds.x,
      y: bounds.y,
      isMaximized:  w.isMaximized(),
      isMinimized:  w.isMinimized(),
      isFullScreen: w.isFullScreen(),
      isFocused:    w.isFocused(),
    };
  }

  private getAppIconPath(): string | undefined {
    const assetsDir = path.join(__dirname, '..', '..', '..', '..', 'assets', 'icons');
    switch (process.platform) {
      case 'win32':  return path.join(assetsDir, 'icon.ico');
      case 'darwin': return path.join(assetsDir, 'icon.icns');
      default:       return path.join(assetsDir, 'icon.png');
    }
  }
}
