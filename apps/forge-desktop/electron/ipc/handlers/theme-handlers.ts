import type { IIpcRouter, IThemeService } from '../../main/container/service-interfaces';
import { T } from '../../main/container/tokens';
import { IDesktopContainer } from '../../main/container/interfaces';
import { IIpcContext } from '../interfaces';

/**
 * Registers theme IPC handlers.
 */
export function registerThemeHandlers(router: IIpcRouter, container: IDesktopContainer): void {
  const themeService = container.resolve<IThemeService>(T.IThemeService);

  router.handle('theme:list', async () => {
    return themeService.listThemes();
  });

  router.handle('theme:get-active', async () => {
    return themeService.getActiveTheme();
  });

  router.handle('theme:set', async (ctx: IIpcContext) => {
    const themeId = ctx.args[0] as string;
    await themeService.loadTheme(themeId);
    return { success: true };
  });
}
