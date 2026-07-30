import type { IContainerModule, IDesktopContainer } from '../container/interfaces';
/**
 * StartupModule — registers the real StartupManager (not the stub).
 *
 * StartupManager requires the IDesktopContainer itself so it can:
 * - Call container.validate() in Stage 1
 * - Call container.initializeAll() in Stage 2
 * - Call container.freeze() in Stage 8
 * - Call container.shutdownAll() during shutdown
 *
 * Must be the last module loaded.
 */
export declare class StartupModule implements IContainerModule {
    private readonly container;
    readonly name = "StartupModule";
    readonly dependencies: string[];
    constructor(container: IDesktopContainer);
    register(container: IDesktopContainer): void;
}
