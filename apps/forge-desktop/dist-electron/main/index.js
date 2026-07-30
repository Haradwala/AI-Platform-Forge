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
const electron_1 = require("electron");
const path = __importStar(require("path"));
const desktop_container_1 = require("./container/desktop-container");
const core_module_1 = require("./modules/core.module");
const ipc_module_1 = require("./modules/ipc.module");
const window_module_1 = require("./modules/window.module");
const workspace_module_1 = require("./modules/workspace.module");
const theme_module_1 = require("./modules/theme.module");
const terminal_module_1 = require("./modules/terminal.module");
const session_module_1 = require("./modules/session.module");
const performance_module_1 = require("./modules/performance.module");
const startup_module_1 = require("./modules/startup.module");
const ai_module_1 = require("./modules/ai.module");
const tokens_1 = require("./container/tokens");
// ─── Constants ──────────────────────────────────────────────────────────────
const isDev = process.env.NODE_ENV === 'development' || !electron_1.app.isPackaged;
// ─── Startup & Container Lifecycle ──────────────────────────────────────────
let container;
let startupManager;
electron_1.app.whenReady().then(async () => {
    container = new desktop_container_1.DesktopContainer({
        environment: isDev ? 'development' : 'production',
    });
    // Load all architectural modules in dependency order
    container.loadModule(new core_module_1.CoreModule());
    container.loadModule(new ipc_module_1.IpcModule());
    container.loadModule(new window_module_1.WindowModule());
    container.loadModule(new workspace_module_1.WorkspaceModule());
    container.loadModule(new theme_module_1.ThemeModule());
    container.loadModule(new terminal_module_1.TerminalModule());
    container.loadModule(new session_module_1.SessionModule());
    container.loadModule(new performance_module_1.PerformanceModule());
    container.loadModule(new ai_module_1.AiModule());
    container.loadModule(new startup_module_1.StartupModule(container));
    startupManager = container.resolve(tokens_1.T.IStartupManager);
    await startupManager.boot();
    electron_1.app.on('activate', async () => {
        // macOS: re-create window when dock icon is clicked and no windows are open
        if (electron_1.BrowserWindow.getAllWindows().length === 0) {
            const windowService = container.resolve(tokens_1.T.IWindowService);
            await windowService.createMainWindow();
        }
    });
});
electron_1.app.on('window-all-closed', () => {
    // On macOS apps conventionally stay alive until the user quits explicitly
    if (process.platform !== 'darwin') {
        electron_1.app.quit();
    }
});
electron_1.app.on('before-quit', (event) => {
    if (startupManager) {
        event.preventDefault();
        startupManager.shutdown().then(() => {
            electron_1.app.exit(0);
        }).catch((err) => {
            console.error('[Forge] Shutdown error:', err);
            electron_1.app.exit(1);
        });
    }
});
// ─── Security: prevent new-window navigation ────────────────────────────────
electron_1.app.on('web-contents-created', (_event, contents) => {
    contents.setWindowOpenHandler(() => ({ action: 'deny' }));
    contents.on('will-navigate', (event, url) => {
        const parsedUrl = new URL(url);
        const allowedOrigins = isDev
            ? ['http://localhost:5173']
            : [`file://${path.join(__dirname, '..', '..', 'dist')}`];
        if (!allowedOrigins.some((origin) => url.startsWith(origin))) {
            console.warn(`[Security] Blocked navigation to: ${parsedUrl.origin}`);
            event.preventDefault();
        }
    });
});
//# sourceMappingURL=index.js.map