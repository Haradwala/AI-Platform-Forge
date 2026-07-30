import type { IDesktopContainer } from '../../main/container/interfaces';
import type { ISessionManager, IIpcRouter } from '../../main/container/service-interfaces';
import { T } from '../../main/container/tokens';
import { IIpcContext } from '../interfaces';

export function registerSessionHandlers(router: IIpcRouter, container: IDesktopContainer): void {
  const sessionManager = container.resolve<ISessionManager>(T.ISessionManager);

  router.handle('session:save', async (ctx: IIpcContext) => {
    const state = ctx.args[0];
    await sessionManager.save(state);
    return { success: true };
  });

  router.handle('session:restore', async () => {
    const data = await sessionManager.restore();
    return data;
  });

  router.handle('session:clear', async () => {
    await sessionManager.clear();
    return { success: true };
  });
}
