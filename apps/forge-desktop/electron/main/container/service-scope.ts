import type { IServiceScope, IServiceDescriptor, IServiceResolver, ServiceToken } from './interfaces';
import { UnregisteredServiceError, CircularDependencyError } from './errors';

/**
 * ServiceScope — provides a named resolution context where scoped services
 * live as singletons. When the scope is disposed, all scoped instances are
 * destroyed in reverse-creation order.
 */
export class ServiceScope implements IServiceScope, IServiceResolver {
  readonly name: string;

  private readonly instances = new Map<ServiceToken, unknown>();
  private readonly creationOrder: ServiceToken[] = [];
  private readonly descriptors: ReadonlyMap<ServiceToken, IServiceDescriptor>;
  private readonly singletonInstances: ReadonlyMap<ServiceToken, unknown>;
  private disposed = false;

  constructor(
    name: string,
    descriptors: ReadonlyMap<ServiceToken, IServiceDescriptor>,
    singletonInstances: ReadonlyMap<ServiceToken, unknown>,
  ) {
    this.name = name;
    this.descriptors = descriptors;
    this.singletonInstances = singletonInstances;
  }

  // ── IServiceResolver ───────────────────────────────────────────────────────

  resolve<T>(token: ServiceToken): T {
    this.assertNotDisposed();

    // Singletons are always resolved from the parent container
    const singleton = this.singletonInstances.get(token);
    if (singleton !== undefined) return singleton as T;

    const descriptor = this.descriptors.get(token);
    if (!descriptor) {
      throw new UnregisteredServiceError(token, `scope "${this.name}"`);
    }

    // Scoped — return scope-local instance if already created
    if (descriptor.lifetime === 'scoped') {
      if (this.instances.has(token)) {
        return this.instances.get(token) as T;
      }
      const instance = descriptor.factory(this);
      this.instances.set(token, instance);
      this.creationOrder.push(token);
      return instance as T;
    }

    // Transient — new instance each time
    if (descriptor.lifetime === 'transient') {
      return descriptor.factory(this) as T;
    }

    throw new UnregisteredServiceError(token, `scope "${this.name}" (unknown lifetime)`);
  }

  tryResolve<T>(token: ServiceToken): T | null {
    try {
      return this.resolve<T>(token);
    } catch {
      return null;
    }
  }

  // ── Dispose ───────────────────────────────────────────────────────────────

  async dispose(): Promise<void> {
    if (this.disposed) return;
    this.disposed = true;

    // Dispose in reverse creation order
    const reversed = [...this.creationOrder].reverse();
    for (const token of reversed) {
      const instance = this.instances.get(token);
      const descriptor = this.descriptors.get(token);
      if (instance !== undefined && descriptor?.dispose) {
        try {
          await descriptor.dispose(instance);
        } catch (err) {
          console.error(
            `[ServiceScope "${this.name}"] Error disposing "${descriptor.name}":`,
            err,
          );
        }
      }
    }

    this.instances.clear();
    this.creationOrder.length = 0;
  }

  // ── Helpers ───────────────────────────────────────────────────────────────

  private assertNotDisposed(): void {
    if (this.disposed) {
      throw new Error(`ServiceScope "${this.name}" has already been disposed.`);
    }
  }
}
