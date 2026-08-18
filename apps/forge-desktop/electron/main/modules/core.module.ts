import type { IContainerModule, IDesktopContainer } from '../container/interfaces';
import type { IDesktopLogger, IDesktopEventBus } from '../container/service-interfaces';
import { T } from '../container/tokens';
import { DesktopLogger } from '../logging/desktop-logger';
import { ConsoleSink } from '../logging/console-sink';

// ─── EventBus stub (replaced by full DesktopEventBus in Epic 10) ─────────────

import { EventEmitter } from 'events';

import type { IWindowRegistry } from '../window-registry';

class StubDesktopEventBus implements IDesktopEventBus {
  private emitter = new EventEmitter();
  constructor(private readonly windowRegistryResolver?: () => IWindowRegistry | null) {}

  emit(topic: string, payload: unknown) {
    this.emitter.emit(topic, payload);
    try {
      const registry = this.windowRegistryResolver?.();
      if (registry) {
        for (const entry of registry.getAll()) {
          if (entry.window && !entry.window.isDestroyed()) {
            entry.window.webContents.send(topic, payload);
          }
        }
      }
    } catch {
      // Non-fatal if window registry is unmounted or window is destroyed
    }
  }
  on(topic: string, listener: (payload: unknown) => void) {
    this.emitter.on(topic, listener);
    return () => { this.emitter.off(topic, listener); };
  }
  off(topic: string, listener: (payload: unknown) => void) {
    this.emitter.off(topic, listener);
  }
}

// ─── Module ───────────────────────────────────────────────────────────────────

/**
 * CoreModule — registers IDesktopLogger (real DesktopLogger) and IDesktopEventBus.
 * Must be loaded first; all other modules depend on it.
 *
 * Epic 19 wired: DesktopLogger with ConsoleSink replaces the previous stub.
 * Epic 10 wired: StubDesktopEventBus replaced by full DesktopEventBus.
 */
export class CoreModule implements IContainerModule {
  readonly name = 'CoreModule';
  readonly dependencies: readonly string[] = [];

  constructor(private readonly options?: {
    minLevel?: 'debug' | 'info' | 'warn' | 'error';
    noConsole?: boolean;
  }) {}

  register(container: IDesktopContainer): void {
    container.registerSingleton<IDesktopLogger>({
      token:        T.IDesktopLogger,
      name:         'IDesktopLogger',
      lifetime:     'singleton',
      dependencies: [],
      factory: () => {
        const logger = new DesktopLogger({
          namespace: 'Forge',
          minLevel:  this.options?.minLevel ?? 'debug',
        });
        if (!this.options?.noConsole) {
          logger.addSink(new ConsoleSink(process.env.NODE_ENV !== 'test'));
        }
        return logger;
      },
      dispose: (logger) => (logger as unknown as DesktopLogger).dispose(),
    });

    container.registerSingleton<IDesktopEventBus>({
      token:        T.IDesktopEventBus,
      name:         'IDesktopEventBus',
      lifetime:     'singleton',
      dependencies: [],
      factory:      (resolver) => new StubDesktopEventBus(() => resolver.tryResolve<IWindowRegistry>(T.IWindowRegistry) ?? null),
    });
  }
}
