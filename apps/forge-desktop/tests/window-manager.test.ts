import { describe, it, expect, vi, beforeEach } from 'vitest';
import { WindowManager } from '../electron/main/window-manager';

// ─── Mock electron ────────────────────────────────────────────────────────────
// electron cannot run in the jsdom test environment — we mock the entire module.

const mockBrowserWindow = {
  loadURL:             vi.fn().mockResolvedValue(undefined),
  loadFile:            vi.fn().mockResolvedValue(undefined),
  once:                vi.fn((event: string, cb: () => void) => { if (event === 'ready-to-show') cb(); }),
  on:                  vi.fn(),
  show:                vi.fn(),
  focus:               vi.fn(),
  close:               vi.fn(),
  maximize:            vi.fn(),
  unmaximize:          vi.fn(),
  minimize:            vi.fn(),
  setFullScreen:       vi.fn(),
  isMaximized:         vi.fn().mockReturnValue(false),
  isMinimized:         vi.fn().mockReturnValue(false),
  isFullScreen:        vi.fn().mockReturnValue(false),
  isFocused:           vi.fn().mockReturnValue(true),
  getBounds:           vi.fn().mockReturnValue({ x: 100, y: 100, width: 1280, height: 800 }),
  webContents: {
    openDevTools:        vi.fn(),
    setWindowOpenHandler: vi.fn(),
  },
};

vi.mock('electron', () => ({
  BrowserWindow: vi.fn().mockImplementation(() => mockBrowserWindow),
  shell: { openExternal: vi.fn() },
  app: { isPackaged: false },
}));

vi.mock('path', async () => {
  const actual = await vi.importActual<typeof import('path')>('path');
  return actual;
});

// ─── Tests ────────────────────────────────────────────────────────────────────

describe('WindowManager', () => {
  let manager: WindowManager;

  beforeEach(() => {
    vi.clearAllMocks();
    manager = new WindowManager({
      isDev: true,
      devServerUrl: 'http://localhost:5173',
    });
  });

  it('should be instantiated with options', () => {
    expect(manager).toBeDefined();
  });

  it('should return null for getMainWindow before any window is created', () => {
    expect(manager.getMainWindow()).toBeNull();
  });

  it('should return null for getWindowState before any window is created', () => {
    expect(manager.getWindowState()).toBeNull();
  });

  it('should create a BrowserWindow and load dev server URL in dev mode', async () => {
    await manager.createMainWindow();
    expect(mockBrowserWindow.loadURL).toHaveBeenCalledWith('http://localhost:5173');
    expect(mockBrowserWindow.webContents.openDevTools).toHaveBeenCalled();
  });

  it('should load a file in production mode', async () => {
    const prodManager = new WindowManager({ isDev: false, devServerUrl: '' });
    await prodManager.createMainWindow();
    expect(mockBrowserWindow.loadFile).toHaveBeenCalled();
    expect(mockBrowserWindow.webContents.openDevTools).not.toHaveBeenCalled();
  });

  it('should show and focus the window on ready-to-show', async () => {
    await manager.createMainWindow();
    expect(mockBrowserWindow.show).toHaveBeenCalled();
    expect(mockBrowserWindow.focus).toHaveBeenCalled();
  });

  it('should return the main window after creation', async () => {
    await manager.createMainWindow();
    expect(manager.getMainWindow()).toBe(mockBrowserWindow);
  });

  it('should return a valid IWindowState after creation', async () => {
    await manager.createMainWindow();
    const state = manager.getWindowState();
    expect(state).not.toBeNull();
    expect(state?.width).toBe(1280);
    expect(state?.height).toBe(800);
    expect(state?.isMaximized).toBe(false);
    expect(state?.isFocused).toBe(true);
  });

  it('should call maximize on the window', async () => {
    await manager.createMainWindow();
    manager.maximize();
    expect(mockBrowserWindow.maximize).toHaveBeenCalled();
  });

  it('should call minimize on the window', async () => {
    await manager.createMainWindow();
    manager.minimize();
    expect(mockBrowserWindow.minimize).toHaveBeenCalled();
  });

  it('should call close on the window', async () => {
    await manager.createMainWindow();
    manager.close();
    expect(mockBrowserWindow.close).toHaveBeenCalled();
  });

  it('should toggle fullscreen', async () => {
    await manager.createMainWindow();
    manager.toggleFullscreen();
    expect(mockBrowserWindow.setFullScreen).toHaveBeenCalledWith(true);
  });

  it('should not throw when calling window controls before window is created', () => {
    expect(() => manager.maximize()).not.toThrow();
    expect(() => manager.minimize()).not.toThrow();
    expect(() => manager.close()).not.toThrow();
    expect(() => manager.toggleFullscreen()).not.toThrow();
  });
});
