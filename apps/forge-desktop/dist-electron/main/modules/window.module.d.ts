import type { IContainerModule, IDesktopContainer } from '../container/interfaces';
/**
 * WindowModule — registers the WindowRegistry and WindowService in the container.
 *
 * Dependencies:
 * - CoreModule (provides T.IDesktopLogger)
 */
export declare class WindowModule implements IContainerModule {
    readonly name = "WindowModule";
    readonly dependencies: string[];
    register(container: IDesktopContainer): void;
}
