import { describe, it, expect, vi, beforeEach } from 'vitest';
import { DesktopLogger } from '../electron/main/logging/desktop-logger';
import { ConsoleSink } from '../electron/main/logging/console-sink';
import type { ILogEntry, ILogSink } from '../electron/main/logging/interfaces';

// ─── Spy sink ─────────────────────────────────────────────────────────────────

class SpySink implements ILogSink {
  readonly name = 'SpySink';
  readonly entries: ILogEntry[] = [];
  write(entry: ILogEntry): void { this.entries.push(entry); }
  lastEntry(): ILogEntry | undefined { return this.entries[this.entries.length - 1]; }
  clear(): void { this.entries.length = 0; }
}

// ─── Tests ────────────────────────────────────────────────────────────────────

describe('DesktopLogger — basic logging', () => {
  let logger: DesktopLogger;
  let spy: SpySink;

  beforeEach(() => {
    spy    = new SpySink();
    logger = new DesktopLogger({ namespace: 'Test', sinks: [spy] });
  });

  it('debug() writes a debug entry', () => {
    logger.debug('hello debug');
    expect(spy.entries).toHaveLength(1);
    expect(spy.lastEntry()!.level).toBe('debug');
    expect(spy.lastEntry()!.message).toBe('hello debug');
  });

  it('info() writes an info entry', () => {
    logger.info('hello info');
    expect(spy.lastEntry()!.level).toBe('info');
  });

  it('warn() writes a warn entry', () => {
    logger.warn('hello warn');
    expect(spy.lastEntry()!.level).toBe('warn');
  });

  it('error() writes an error entry', () => {
    logger.error('hello error');
    expect(spy.lastEntry()!.level).toBe('error');
  });

  it('entry includes correct namespace', () => {
    logger.info('msg');
    expect(spy.lastEntry()!.namespace).toBe('Test');
  });

  it('entry includes extra args', () => {
    logger.info('msg', { key: 'value' });
    expect(spy.lastEntry()!.args[0]).toEqual({ key: 'value' });
  });

  it('entry has a timestamp (ms)', () => {
    const before = Date.now();
    logger.info('ts test');
    const after = Date.now();
    expect(spy.lastEntry()!.timestamp).toBeGreaterThanOrEqual(before);
    expect(spy.lastEntry()!.timestamp).toBeLessThanOrEqual(after);
  });
});

describe('DesktopLogger — level filtering', () => {
  it('filters messages below minLevel', () => {
    const spy = new SpySink();
    const logger = new DesktopLogger({ sinks: [spy], minLevel: 'warn' });
    logger.debug('silent');
    logger.info('also silent');
    logger.warn('visible');
    logger.error('also visible');
    expect(spy.entries).toHaveLength(2);
    expect(spy.entries.map((e) => e.level)).toEqual(['warn', 'error']);
  });

  it('logs all levels when minLevel is debug', () => {
    const spy = new SpySink();
    const logger = new DesktopLogger({ sinks: [spy], minLevel: 'debug' });
    logger.debug('d'); logger.info('i'); logger.warn('w'); logger.error('e');
    expect(spy.entries).toHaveLength(4);
  });
});

describe('DesktopLogger — child loggers', () => {
  it('child() inherits parent namespace prefixed', () => {
    const spy = new SpySink();
    const parent = new DesktopLogger({ namespace: 'App', sinks: [spy] });
    const child = parent.child('WorkspaceService');
    child.info('namespaced');
    expect(spy.lastEntry()!.namespace).toBe('App:WorkspaceService');
  });

  it('child logger shares sinks with parent', () => {
    const spy = new SpySink();
    const parent = new DesktopLogger({ namespace: 'App', sinks: [spy] });
    const child = parent.child('Child');
    parent.info('from parent');
    child.info('from child');
    expect(spy.entries).toHaveLength(2);
  });

  it('nested child() stacks namespaces', () => {
    const spy = new SpySink();
    const root = new DesktopLogger({ namespace: 'Forge', sinks: [spy] });
    const a = root.child('A');
    const b = a.child('B');
    b.info('deep');
    expect(spy.lastEntry()!.namespace).toBe('Forge:A:B');
  });
});

describe('DesktopLogger — sink management', () => {
  it('addSink() routes logs to new sink', () => {
    const spy2 = new SpySink();
    const logger = new DesktopLogger({ namespace: 'X' });
    logger.addSink(spy2);
    logger.info('added');
    expect(spy2.entries).toHaveLength(1);
  });

  it('removeSink() stops routing to that sink', () => {
    const spy = new SpySink();
    const logger = new DesktopLogger({ namespace: 'X', sinks: [spy] });
    logger.info('before remove');
    logger.removeSink('SpySink');
    logger.info('after remove');
    expect(spy.entries).toHaveLength(1);
  });

  it('sink error does not propagate to caller', () => {
    const throwingSink: ILogSink = {
      name: 'Thrower',
      write: () => { throw new Error('sink explosion'); },
    };
    const logger = new DesktopLogger({ sinks: [throwingSink] });
    expect(() => logger.info('safe')).not.toThrow();
  });
});

describe('DesktopLogger — dispose', () => {
  it('dispose() calls dispose on sinks', () => {
    const mockSink: ILogSink = { name: 'Mock', write: vi.fn(), dispose: vi.fn() };
    const logger = new DesktopLogger({ sinks: [mockSink] });
    logger.dispose();
    expect(mockSink.dispose).toHaveBeenCalled();
  });

  it('flush() calls flush on all sinks', async () => {
    const mockSink: ILogSink = { name: 'Mock', write: vi.fn(), flush: vi.fn().mockResolvedValue(undefined) };
    const logger = new DesktopLogger({ sinks: [mockSink] });
    await logger.flush();
    expect(mockSink.flush).toHaveBeenCalled();
  });
});

describe('ConsoleSink', () => {
  it('write() does not throw', () => {
    const sink = new ConsoleSink(false);
    const entry: ILogEntry = {
      level: 'info', namespace: 'Test', message: 'hello', args: [], timestamp: Date.now(),
    };
    expect(() => sink.write(entry)).not.toThrow();
  });
});
