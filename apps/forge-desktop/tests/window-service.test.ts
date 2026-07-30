import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('electron', () => {
  return {
    app: {
      isPackaged: true,
      getPath: () => '/mock/path',
      whenReady: () => Promise.resolve(),
    },
    BrowserWindow: class {},
    shell: {
      openExternal: vi.fn(),
    },
  };
});

import { WindowRegistry } from '../electron/main/window-registry';
import { WindowService } from '../electron/main/window-service';
import type { IDesktopLogger } from '../electron/main/container/service-interfaces';


// ─── Mock Electron BrowserWindow ──────────────────────────────────────────────

function makeMockWindow(overrides: Partial<Record<string, unknown>> = {}): Electron.BrowserWindow {
  const listeners = new Map<string, Set<() => void>>();

  return {
    maximize:      vi.fn(),
    minimize:      vi.fn(),
    restore:       vi.fn(),
    close:         vi.fn(),
    focus:         vi.fn(),
    hide:          vi.fn(),
    show:          vi.fn(),
    setTitle:      vi.fn(),
    flashFrame:    vi.fn(),
    setFullScreen: vi.fn(),
    isMaximized:   vi.fn().mockReturnValue(false),
    isMinimized:   vi.fn().mockReturnValue(false),
    isFullScreen:  vi.fn().mockReturnValue(false),
    isFocused:     vi.fn().mockReturnValue(true),
    getSize:       vi.fn().mockReturnValue([1280, 800]),
    getPosition:   vi.fn().mockReturnValue([100, 100]),
    getBounds:     vi.fn().mockReturnValue({ x: 100, y: 100, width: 1280, height: 800 }),
    once:          vi.fn().mockImplementation((event: string, cb: () => void) => {
      if (!listeners.has(event)) listeners.set(event, new Set());
      listeners.get(event)!.add(cb);
    }),
    emit: (event: string) => listeners.get(event)?.forEach((fn) => fn()),
    ...overrides,
  } as unknown as Electron.BrowserWindow;
}

function makeLogger(): IDesktopLogger {
  return { info: vi.fn(), warn: vi.fn(), error: vi.fn(), debug: vi.fn() };
}

// ─── WindowRegistry tests ─────────────────────────────────────────────────────

describe('WindowRegistry', () => {
  let registry: WindowRegistry;

  beforeEach(() => { registry = new WindowRegistry(); });

  it('starts with count 0', () => {
    expect(registry.count()).toBe(0);
  });

  it('registers and retrieves a window by id', () => {
    const win = makeMockWindow();
    registry.register('main', win);
    expect(registry.get('main')).toBe(win);
  });

  it('has() returns true after registration', () => {
    registry.register('main', makeMockWindow());
    expect(registry.has('main')).toBe(true);
  });

  it('count() increments on register', () => {
    registry.register('main', makeMockWindow());
    expect(registry.count()).toBe(1);
  });

  it('unregister() removes the window', () => {
    registry.register('main', makeMockWindow());
    registry.unregister('main');
    expect(registry.get('main')).toBeNull();
    expect(registry.count()).toBe(0);
  });

  it('throws on duplicate registration', () => {
    registry.register('main', makeMockWindow());
    expect(() => registry.register('main', makeMockWindow())).toThrow('already registered');
  });

  it('auto-unregisters when window emits "closed"', () => {
    const win = makeMockWindow();
    registry.register('main', win);
    (win as any).emit('closed');
    expect(registry.has('main')).toBe(false);
  });

  it('getAll() returns all registered windows', () => {
    registry.register('a', makeMockWindow());
    registry.register('b', makeMockWindow());
    expect(registry.getAll()).toHaveLength(2);
  });
});

// ─── WindowService tests ──────────────────────────────────────────────────────

describe('WindowService — window operations', () => {
  let registry: WindowRegistry;
  let service: WindowService;
  let win: Electron.BrowserWindow;
  let logger: IDesktopLogger;

  beforeEach(() => {
    registry = new WindowRegistry();
    logger   = makeLogger();
    win      = makeMockWindow();
    registry.register('main', win);
    service  = new WindowService(registry, logger);
  });

  it('maximize() calls window.maximize()', () => {
    service.maximize();
    expect(win.maximize).toHaveBeenCalled();
  });

  it('minimize() calls window.minimize()', () => {
    service.minimize();
    expect(win.minimize).toHaveBeenCalled();
  });

  it('restore() calls window.restore() when maximized', () => {
    vi.mocked(win.isMaximized).mockReturnValue(true);
    service.restore();
    expect(win.restore).toHaveBeenCalled();
  });

  it('toggleFullscreen() sets fullscreen to opposite', () => {
    vi.mocked(win.isFullScreen).mockReturnValue(false);
    service.toggleFullscreen();
    expect(win.setFullScreen).toHaveBeenCalledWith(true);
  });

  it('close() calls window.close()', () => {
    service.close();
    expect(win.close).toHaveBeenCalled();
  });

  it('focus() calls window.focus()', () => {
    service.focus();
    expect(win.focus).toHaveBeenCalled();
  });

  it('hide() calls window.hide()', () => {
    service.hide();
    expect(win.hide).toHaveBeenCalled();
  });

  it('show() calls window.show()', () => {
    service.show();
    expect(win.show).toHaveBeenCalled();
  });

  it('setTitle() calls window.setTitle()', () => {
    service.setTitle('Forge — workspace');
    expect(win.setTitle).toHaveBeenCalledWith('Forge — workspace');
  });

  it('flashFrame() calls window.flashFrame()', () => {
    service.flashFrame(true);
    expect(win.flashFrame).toHaveBeenCalledWith(true);
  });
});

describe('WindowService — getState()', () => {
  it('returns correct IWindowState', () => {
    const registry = new WindowRegistry();
    const win = makeMockWindow();
    registry.register('main', win);
    const service = new WindowService(registry, makeLogger());
    const state = service.getState();
    expect(state).toEqual({
      width: 1280, height: 800,
      x: 100,     y: 100,
      isMaximized:  false,
      isMinimized:  false,
      isFullScreen: false,
      isFocused:    true,
    });
  });

  it('returns null when no main window is registered', () => {
    const registry = new WindowRegistry();
    const service = new WindowService(registry, makeLogger());
    expect(service.getState()).toBeNull();
  });
});

describe('WindowService — null safety (no main window)', () => {
  let service: WindowService;
  let logger: IDesktopLogger;

  beforeEach(() => {
    logger  = makeLogger();
    service = new WindowService(new WindowRegistry(), logger);
  });

  it('maximize() warns when main window missing', () => {
    service.maximize();
    expect(logger.warn).toHaveBeenCalled();
  });

  it('minimize() warns when main window missing', () => {
    service.minimize();
    expect(logger.warn).toHaveBeenCalled();
  });

  it('close() does not throw when main window missing', () => {
    expect(() => service.close()).not.toThrow();
  });
});
