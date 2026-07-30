import type { IIpcRouter, IWindowService } from '../../main/container/service-interfaces';

/**
 * Window IPC handlers — registered on the IPC router.
 *
 * All channels follow: window:*
 * Handler returns are typed for preload type safety.
 */

export function registerWindowHandlers(
  router: IIpcRouter,
  windowService: IWindowService,
): void {
  router.handle('window:maximize',         async () => { windowService.maximize(); });
  router.handle('window:minimize',         async () => { windowService.minimize(); });
  router.handle('window:restore',          async () => { windowService.restore(); });
  router.handle('window:toggleFullscreen', async () => { windowService.toggleFullscreen(); });
  router.handle('window:close',            async () => { windowService.close(); });
  router.handle('window:focus',            async () => { windowService.focus(); });
  router.handle('window:hide',             async () => { windowService.hide(); });
  router.handle('window:show',             async () => { windowService.show(); });
  router.handle('window:getState',         async () => windowService.getState());
  router.handle('window:setTitle',         async (ctx) => {
    const title = ctx.args[0] as string;
    windowService.setTitle(title);
  });
}
