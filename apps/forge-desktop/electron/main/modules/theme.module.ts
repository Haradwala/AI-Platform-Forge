import type { IContainerModule, IDesktopContainer } from '../container/interfaces';
import type { IThemeService } from '../container/service-interfaces';
import { T } from '../container/tokens';
import { ThemeService } from '../theme-service';

export class ThemeModule implements IContainerModule {
  readonly name = 'ThemeModule';
  readonly dependencies = ['CoreModule'];

  register(container: IDesktopContainer): void {
    container.registerSingleton<IThemeService>({
      token:        T.IThemeService,
      name:         'IThemeService',
      lifetime:     'singleton',
      dependencies: [T.IDesktopLogger],
      factory:      () => new ThemeService(container.resolve(T.IDesktopLogger)),
    });
  }
}

