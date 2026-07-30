import { describe, it, expect, vi, beforeEach } from 'vitest';
import { IpcRouter } from '../electron/ipc/ipc-router';
import { LoggerMiddleware, MetricsMiddleware } from '../electron/ipc/ipc-middleware';
import { IIpcContext, IIpcMiddleware } from '../electron/ipc/interfaces';

// ─── Mock electron ────────────────────────────────────────────────────────────
// vi.hoisted ensures the mock object is available before vi.mock() factory runs.

const { mockIpcMain } = vi.hoisted(() => ({
  mockIpcMain: {
    handle:        vi.fn(),
    removeHandler: vi.fn(),
  },
}));

vi.mock('electron', () => ({
  ipcMain: mockIpcMain,
  app: { getVersion: vi.fn().mockReturnValue('0.1.0') },
}));

// ─── Helper to build a fake IpcMainInvokeEvent ────────────────────────────────

function makeFakeEvent(windowId = 1) {
  return { sender: { id: windowId } } as any;
}

// ─── Tests ────────────────────────────────────────────────────────────────────

describe('IpcRouter — handler registration', () => {
  let router: IpcRouter;

  beforeEach(() => {
    vi.clearAllMocks();
    router = new IpcRouter();
  });

  it('should dispatch to a registered handler', async () => {
    const handler = vi.fn().mockResolvedValue('hello');
    router.handle('test:greet', handler);

    const response = await router.dispatch('test:greet', makeFakeEvent(), []);
    expect(response.ok).toBe(true);
    expect(response.data).toBe('hello');
    expect(handler).toHaveBeenCalledOnce();
  });

  it('should return ok:false for unregistered channels', async () => {
    const response = await router.dispatch('unknown:channel', makeFakeEvent(), []);
    expect(response.ok).toBe(false);
    expect(response.error).toContain('No handler registered');
  });

  it('should pass args from the event to the handler', async () => {
    const handler = vi.fn().mockImplementation(async (ctx: IIpcContext) => ctx.args[0]);
    router.handle('test:echo', handler);

    const response = await router.dispatch('test:echo', makeFakeEvent(), ['payload']);
    expect(response.data).toBe('payload');
  });

  it('should include windowId in context', async () => {
    let capturedCtx: IIpcContext | undefined;
    router.handle('test:ctx', async (ctx) => { capturedCtx = ctx; return null; });

    await router.dispatch('test:ctx', makeFakeEvent(42), []);
    expect(capturedCtx?.windowId).toBe(42);
  });

  it('should match pattern handlers', async () => {
    const handler = vi.fn().mockResolvedValue('pattern-match');
    router.handlePattern('workspace:*', handler);

    const response = await router.dispatch('workspace:open-folder', makeFakeEvent(), []);
    expect(response.ok).toBe(true);
    expect(response.data).toBe('pattern-match');
  });

  it('should prefer exact handler over pattern handler', async () => {
    const exact   = vi.fn().mockResolvedValue('exact');
    const pattern = vi.fn().mockResolvedValue('pattern');

    router.handle('workspace:ping', exact);
    router.handlePattern('workspace:*', pattern);

    const response = await router.dispatch('workspace:ping', makeFakeEvent(), []);
    expect(response.data).toBe('exact');
    expect(exact).toHaveBeenCalled();
    expect(pattern).not.toHaveBeenCalled();
  });

  it('should catch handler errors and return ok:false', async () => {
    router.handle('test:throws', async () => { throw new Error('boom'); });

    const response = await router.dispatch('test:throws', makeFakeEvent(), []);
    expect(response.ok).toBe(false);
    expect(response.error).toBe('boom');
  });
});

describe('IpcRouter — middleware pipeline', () => {
  let router: IpcRouter;

  beforeEach(() => {
    vi.clearAllMocks();
    router = new IpcRouter();
  });

  it('should execute middleware in registration order', async () => {
    const order: number[] = [];

    const mw1: IIpcMiddleware = {
      name: 'first',
      handle: async (ctx, next) => { order.push(1); await next(); order.push(4); },
    };
    const mw2: IIpcMiddleware = {
      name: 'second',
      handle: async (ctx, next) => { order.push(2); await next(); order.push(3); },
    };

    router.use(mw1);
    router.use(mw2);
    router.handle('test:order', async () => { order.push(99); return null; });

    await router.dispatch('test:order', makeFakeEvent(), []);
    expect(order).toEqual([1, 2, 99, 3, 4]);
  });

  it('should still reach handler when middleware calls next()', async () => {
    const handler = vi.fn().mockResolvedValue('reached');
    router.use(new LoggerMiddleware());
    router.handle('test:reach', handler);

    const response = await router.dispatch('test:reach', makeFakeEvent(), []);
    expect(response.ok).toBe(true);
    expect(handler).toHaveBeenCalled();
  });

  it('middleware can short-circuit by not calling next()', async () => {
    const handler = vi.fn().mockResolvedValue('should-not-reach');
    const blocker: IIpcMiddleware = {
      name: 'blocker',
      handle: async (ctx, _next) => { ctx.response = 'blocked'; },
    };

    router.use(blocker);
    router.handle('test:block', handler);

    await router.dispatch('test:block', makeFakeEvent(), []);
    expect(handler).not.toHaveBeenCalled();
  });
});

describe('MetricsMiddleware', () => {
  it('should record latency for dispatched channels', async () => {
    const metrics = new MetricsMiddleware();
    const router = new IpcRouter();
    router.use(metrics);
    router.handle('perf:test', async () => 'ok');

    await router.dispatch('perf:test', makeFakeEvent(), []);
    await router.dispatch('perf:test', makeFakeEvent(), []);

    const snap = metrics.snapshot();
    expect(snap).toHaveProperty('perf:test');
    expect(typeof snap['perf:test']).toBe('number');
  });

  it('should reset latency records', async () => {
    const metrics = new MetricsMiddleware();
    const router = new IpcRouter();
    router.use(metrics);
    router.handle('perf:reset', async () => 'ok');

    await router.dispatch('perf:reset', makeFakeEvent(), []);
    metrics.reset();

    expect(metrics.snapshot()).toEqual({});
  });
});

describe('IpcRouter — attach / detach', () => {
  it('should call ipcMain.handle for each registered channel on attach()', () => {
    const router = new IpcRouter();
    router.handle('system:ping', async () => 'pong');
    router.handle('system:version', async () => '1.0.0');
    router.attach();

    expect(mockIpcMain.handle).toHaveBeenCalledTimes(2);
    expect(mockIpcMain.handle).toHaveBeenCalledWith('system:ping', expect.any(Function));
    expect(mockIpcMain.handle).toHaveBeenCalledWith('system:version', expect.any(Function));
  });

  it('should call ipcMain.removeHandler on detach()', () => {
    const router = new IpcRouter();
    router.handle('system:ping', async () => 'pong');
    router.attach();
    router.detach();

    expect(mockIpcMain.removeHandler).toHaveBeenCalledWith('system:ping');
  });
});
