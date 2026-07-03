import { IService, IServiceRegistry } from '../interfaces/services';

export class ServiceRegistry implements IServiceRegistry {
  private services = new Map<string, IService | (() => IService)>();
  private instances = new Map<string, IService>();
  private resolving = new Map<string, Promise<any>>();

  register(name: string, service: IService | (() => IService), lazy = false): void {
    if (this.services.has(name)) {
      throw new Error(`ServiceRegistry: Service with name "${name}" is already registered.`);
    }
    this.services.set(name, service);
    if (!lazy && typeof service !== 'function') {
      this.instances.set(name, service);
    }
  }

  exists(name: string): boolean {
    return this.services.has(name);
  }

  list(): string[] {
    return Array.from(this.services.keys());
  }

  async resolve<T extends IService>(name: string): Promise<T> {
    if (this.instances.has(name)) {
      return this.instances.get(name) as T;
    }

    const service = this.services.get(name);
    if (!service) {
      throw new Error(`ServiceRegistry: Service "${name}" not found.`);
    }

    if (this.resolving.has(name)) {
      return this.resolving.get(name);
    }

    const resolvePromise = (async () => {
      let instance: IService;
      if (typeof service === 'function') {
        instance = service();
      } else {
        instance = service;
      }

      if (instance.initialize) {
        await instance.initialize();
      }

      this.instances.set(name, instance);
      this.resolving.delete(name);
      return instance;
    })();

    this.resolving.set(name, resolvePromise);
    return resolvePromise as Promise<T>;
  }

  async dispose(): Promise<void> {
    const list = Array.from(this.instances.keys()).reverse();
    for (const name of list) {
      const instance = this.instances.get(name);
      if (instance && instance.dispose) {
        try {
          await instance.dispose();
        } catch (err) {
          console.error(`ServiceRegistry: Error disposing service "${name}":`, err);
        }
      }
    }
    this.instances.clear();
    this.services.clear();
    this.resolving.clear();
  }
}
