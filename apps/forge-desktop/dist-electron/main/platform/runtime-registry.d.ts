import { IRuntimeService } from './runtime-service';
export declare class RuntimeRegistry {
    private readonly services;
    register(service: IRuntimeService): void;
    unregister(id: string): void;
    getService<T extends IRuntimeService>(id: string): T;
    getAll(): IRuntimeService[];
    getSortedServices(): IRuntimeService[];
}
