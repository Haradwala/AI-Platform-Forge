import { IRuntimeService } from './runtime-service';
export declare class RuntimeKernel {
    private readonly registry;
    private started;
    register(service: IRuntimeService): void;
    unregister(id: string): void;
    getService<T extends IRuntimeService>(id: string): T;
    getServices(): IRuntimeService[];
    start(): Promise<void>;
    stop(): Promise<void>;
    diagnostics(): Record<string, any>;
}
