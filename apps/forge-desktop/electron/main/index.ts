import { app, BrowserWindow } from 'electron';
import * as path from 'path';
import { DesktopContainer } from './container/desktop-container';
import { CoreModule } from './modules/core.module';
import { IpcModule } from './modules/ipc.module';
import { WindowModule } from './modules/window.module';
import { WorkspaceModule } from './modules/workspace.module';
import { ThemeModule } from './modules/theme.module';
import { TerminalModule } from './modules/terminal.module';
import { SessionModule } from './modules/session.module';
import { PerformanceModule } from './modules/performance.module';
import { StartupModule } from './modules/startup.module';
import { AiModule } from './modules/ai.module';
import { T } from './container/tokens';
import type { IStartupManager, IWindowService } from './container/service-interfaces';

// ─── Constants ──────────────────────────────────────────────────────────────
const isDev = process.env.NODE_ENV === 'development' || !app.isPackaged;

// ─── Startup & Container Lifecycle ──────────────────────────────────────────
let container: DesktopContainer;
let startupManager: IStartupManager;

app.whenReady().then(async () => {
  container = new DesktopContainer({
    environment: isDev ? 'development' : 'production',
  });

  // Load all architectural modules in dependency order
  container.loadModule(new CoreModule());
  container.loadModule(new IpcModule());
  container.loadModule(new WindowModule());
  container.loadModule(new WorkspaceModule());
  container.loadModule(new ThemeModule());
  container.loadModule(new TerminalModule());
  container.loadModule(new SessionModule());
  container.loadModule(new PerformanceModule());
  container.loadModule(new AiModule());
  container.loadModule(new StartupModule(container));

  startupManager = container.resolve<IStartupManager>(T.IStartupManager);
  await startupManager.boot();

  app.on('activate', async () => {
    // macOS: re-create window when dock icon is clicked and no windows are open
    if (BrowserWindow.getAllWindows().length === 0) {
      const windowService = container.resolve<IWindowService>(T.IWindowService);
      await windowService.createMainWindow();
    }
  });
});

app.on('window-all-closed', () => {
  // On macOS apps conventionally stay alive until the user quits explicitly
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('before-quit', (event) => {
  if (startupManager) {
    event.preventDefault();
    startupManager.shutdown().then(() => {
      app.exit(0);
    }).catch((err) => {
      console.error('[Forge] Shutdown error:', err);
      app.exit(1);
    });
  }
});

// ─── Security: prevent new-window navigation ────────────────────────────────
app.on('web-contents-created', (_event, contents) => {
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

