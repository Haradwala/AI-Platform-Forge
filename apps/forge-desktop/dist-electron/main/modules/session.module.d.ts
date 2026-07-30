import type { IContainerModule, IDesktopContainer } from '../container/interfaces';
export declare class SessionModule implements IContainerModule {
    readonly name = "SessionModule";
    readonly dependencies: string[];
    register(container: IDesktopContainer): void;
}
