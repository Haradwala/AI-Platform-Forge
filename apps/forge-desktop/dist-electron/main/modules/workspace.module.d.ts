import type { IContainerModule, IDesktopContainer } from '../container/interfaces';
/**
 * WorkspaceModule — registers the WorkspaceService.
 *
 * Dependencies:
 * - CoreModule (provides T.IDesktopLogger, T.IDesktopEventBus)
 * - WindowModule (provides T.IWindowRegistry)
 */
export declare class WorkspaceModule implements IContainerModule {
    readonly name = "WorkspaceModule";
    readonly dependencies: string[];
    register(container: IDesktopContainer): void;
}
