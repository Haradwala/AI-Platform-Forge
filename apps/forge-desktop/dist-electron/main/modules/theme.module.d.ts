import type { IContainerModule, IDesktopContainer } from '../container/interfaces';
export declare class ThemeModule implements IContainerModule {
    readonly name = "ThemeModule";
    readonly dependencies: string[];
    register(container: IDesktopContainer): void;
}
