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
exports.WindowManager = void 0;
const electron_1 = require("electron");
const path = __importStar(require("path"));
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
class WindowManager {
    mainWindow = null;
    options;
    constructor(options) {
        this.options = options;
    }
    // ── Public API ─────────────────────────────────────────────────────────────
    async createMainWindow() {
        const win = new electron_1.BrowserWindow({
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
                contextIsolation: true, // Security: renderer cannot access Node APIs
                nodeIntegration: false, // Security: no require() in renderer
                sandbox: false, // preload needs access to Node APIs
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
        }
        else {
            await win.loadFile(path.join(__dirname, '..', '..', 'dist', 'index.html'));
        }
        // ── Show after paint ──────────────────────────────────────────────────────
        win.once('ready-to-show', () => {
            win.show();
            win.focus();
        });
        // ── Open external links in the OS browser ─────────────────────────────────
        win.webContents.setWindowOpenHandler(({ url }) => {
            if (url.startsWith('https://') || url.startsWith('http://')) {
                electron_1.shell.openExternal(url);
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
    getMainWindow() {
        return this.mainWindow;
    }
    getWindowState() {
        if (!this.mainWindow)
            return null;
        const bounds = this.mainWindow.getBounds();
        return {
            isMaximized: this.mainWindow.isMaximized(),
            isMinimized: this.mainWindow.isMinimized(),
            isFullscreen: this.mainWindow.isFullScreen(),
            isFocused: this.mainWindow.isFocused(),
            width: bounds.width,
            height: bounds.height,
            x: bounds.x,
            y: bounds.y,
        };
    }
    maximize() {
        this.mainWindow?.maximize();
    }
    unmaximize() {
        this.mainWindow?.unmaximize();
    }
    minimize() {
        this.mainWindow?.minimize();
    }
    close() {
        this.mainWindow?.close();
    }
    toggleFullscreen() {
        if (!this.mainWindow)
            return;
        this.mainWindow.setFullScreen(!this.mainWindow.isFullScreen());
    }
    // ── Private helpers ────────────────────────────────────────────────────────
    getAppIconPath() {
        const assetsDir = path.join(__dirname, '..', '..', '..', '..', 'assets', 'icons');
        switch (process.platform) {
            case 'win32': return path.join(assetsDir, 'icon.ico');
            case 'darwin': return path.join(assetsDir, 'icon.icns');
            default: return path.join(assetsDir, 'icon.png');
        }
    }
}
exports.WindowManager = WindowManager;
//# sourceMappingURL=window-manager.js.map