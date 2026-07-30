import type { IContainerModule, IDesktopContainer } from '../container/interfaces';
export declare class PerformanceModule implements IContainerModule {
    readonly name = "PerformanceModule";
    readonly dependencies: string[];
    register(container: IDesktopContainer): void;
}
