import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import * as path from 'path';

// ─── Mock Electron ────────────────────────────────────────────────────────────
vi.mock('electron', () => {
  return {
    app: {
      isPackaged: true,
      getPath: () => path.join(process.cwd(), 'temp', 'user-data'),
      whenReady: () => Promise.resolve(),
    },
    BrowserWindow: class {},
    shell: {
      openExternal: vi.fn(),
    },
  };
});

import { DesktopContainer } from '../electron/main/container/desktop-container';
import { CoreModule } from '../electron/main/modules/core.module';
import { WorkspaceModule } from '../electron/main/modules/workspace.module';
import { WindowModule } from '../electron/main/modules/window.module';
import { SessionModule } from '../electron/main/modules/session.module';
import { T } from '../electron/main/container/tokens';
import { ISessionManager } from '../electron/main/container/service-interfaces';
import { SessionManager } from '../electron/main/session-manager';
import * as fs from 'fs';

describe('SessionManager', () => {
  let container: DesktopContainer;
  let service: SessionManager;
  const tempDir = path.join(__dirname, 'temp_session_test');
  const tempSessionFile = path.join(tempDir, '.forge', 'session.json');

  beforeEach(async () => {
    if (fs.existsSync(tempDir)) {
      fs.rmSync(tempDir, { recursive: true, force: true });
    }

    container = new DesktopContainer({ environment: 'test' });
    container.loadModule(new CoreModule());
    container.loadModule(new WindowModule());
    container.loadModule(new WorkspaceModule());
    container.loadModule(new SessionModule());
    await container.initializeAll();

    service = container.resolve<ISessionManager>(T.ISessionManager) as SessionManager;
    service.setFallbackSessionPath(tempSessionFile);
  });

  afterEach(() => {
    if (fs.existsSync(tempDir)) {
      fs.rmSync(tempDir, { recursive: true, force: true });
    }
  });

  it('saves session variables to file successfully', async () => {
    await service.save();

    expect(fs.existsSync(tempSessionFile)).toBe(true);
    const raw = fs.readFileSync(tempSessionFile, 'utf-8');
    const data = JSON.parse(raw);
    expect(data.version).toBe('1.0.0');
    expect(data).toHaveProperty('lastSaved');
  });

  it('restores and logs session attributes without crash', async () => {
    await service.save();
    await expect(service.restore()).resolves.not.toThrow();
  });

  it('saves and restores custom session state successfully', async () => {
    const customState = {
      editor: {
        activeTabPath: 'foo.ts',
        tabs: [{ path: 'foo.ts', name: 'foo.ts', content: 'hello' }]
      }
    };
    await service.save(customState);

    expect(fs.existsSync(tempSessionFile)).toBe(true);
    const raw = fs.readFileSync(tempSessionFile, 'utf-8');
    const data = JSON.parse(raw);
    expect(data.state).toEqual(customState);

    const restored = await service.restore();
    expect(restored.state).toEqual(customState);
  });

  it('clears session configuration file completely', async () => {
    await service.save();
    expect(fs.existsSync(tempSessionFile)).toBe(true);

    await service.clear();
    expect(fs.existsSync(tempSessionFile)).toBe(false);
  });
});
