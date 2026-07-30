/**
 * application.module.ts — Composition Module for Application Layer Services
 *
 * Registers application services (Workspace, Terminal, Git, Runtime, Agent, Engineering)
 * in DesktopContainer, keeping application boundary separate from action infrastructure.
 */
import type { IDesktopContainer, IContainerModule } from '../container/interfaces';
export declare class ApplicationModule implements IContainerModule {
    readonly name = "ApplicationModule";
    register(container: IDesktopContainer): void;
    static register(container: IDesktopContainer): void;
}
