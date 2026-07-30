import type { IServiceScope, IServiceDescriptor, IServiceResolver, ServiceToken } from './interfaces';
/**
 * ServiceScope — provides a named resolution context where scoped services
 * live as singletons. When the scope is disposed, all scoped instances are
 * destroyed in reverse-creation order.
 */
export declare class ServiceScope implements IServiceScope, IServiceResolver {
    readonly name: string;
    private readonly instances;
    private readonly creationOrder;
    private readonly descriptors;
    private readonly singletonInstances;
    private disposed;
    constructor(name: string, descriptors: ReadonlyMap<ServiceToken, IServiceDescriptor>, singletonInstances: ReadonlyMap<ServiceToken, unknown>);
    resolve<T>(token: ServiceToken): T;
    tryResolve<T>(token: ServiceToken): T | null;
    dispose(): Promise<void>;
    private assertNotDisposed;
}
