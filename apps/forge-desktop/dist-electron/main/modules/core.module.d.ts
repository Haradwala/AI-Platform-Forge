import type { IContainerModule, IDesktopContainer } from '../container/interfaces';
/**
 * CoreModule — registers IDesktopLogger (real DesktopLogger) and IDesktopEventBus.
 * Must be loaded first; all other modules depend on it.
 *
 * Epic 19 wired: DesktopLogger with ConsoleSink replaces the previous stub.
 * Epic 10 wired: StubDesktopEventBus replaced by full DesktopEventBus.
 */
export declare class CoreModule implements IContainerModule {
    private readonly options?;
    readonly name = "CoreModule";
    readonly dependencies: readonly string[];
    constructor(options?: {
        minLevel?: "debug" | "info" | "warn" | "error";
        noConsole?: boolean;
    } | undefined);
    register(container: IDesktopContainer): void;
}
