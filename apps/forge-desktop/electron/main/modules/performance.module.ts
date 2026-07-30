import type { IContainerModule, IDesktopContainer } from '../container/interfaces';
import type { IPerformanceMonitor } from '../container/service-interfaces';
import { T } from '../container/tokens';
import { PerformanceMonitor } from '../performance-monitor';

export class PerformanceModule implements IContainerModule {
  readonly name = 'PerformanceModule';
  readonly dependencies = ['CoreModule'];

  register(container: IDesktopContainer): void {
    container.registerSingleton<IPerformanceMonitor>({
      token:        T.IPerformanceMonitor,
      name:         'IPerformanceMonitor',
      lifetime:     'singleton',
      dependencies: [T.IDesktopLogger],
      factory:      () => new PerformanceMonitor(container.resolve(T.IDesktopLogger)),
    });
  }
}

