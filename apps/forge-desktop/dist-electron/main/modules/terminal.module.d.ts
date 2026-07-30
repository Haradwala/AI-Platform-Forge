import type { IContainerModule, IDesktopContainer } from '../container/interfaces';
export declare class TerminalModule implements IContainerModule {
    readonly name = "TerminalModule";
    readonly dependencies: string[];
    register(container: IDesktopContainer): void;
}
