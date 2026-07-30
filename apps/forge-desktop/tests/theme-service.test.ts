import { describe, it, expect } from 'vitest';
import { DesktopContainer } from '../electron/main/container/desktop-container';
import { ThemeModule } from '../electron/main/modules/theme.module';
import { CoreModule } from '../electron/main/modules/core.module';
import { T } from '../electron/main/container/tokens';
import { IThemeService } from '../electron/main/container/service-interfaces';

describe('ThemeService Main Process', () => {
  it('registers in container and manages active themes', async () => {
    const container = new DesktopContainer();
    container.loadModule(new CoreModule());
    container.loadModule(new ThemeModule());
    await container.initializeAll();

    const service = container.resolve<IThemeService>(T.IThemeService);
    expect(service.getActiveTheme()).toBe('forge-dark');
    expect(service.listThemes()).toContain('forge-light');

    await service.loadTheme('forge-light');
    expect(service.getActiveTheme()).toBe('forge-light');
  });
});
