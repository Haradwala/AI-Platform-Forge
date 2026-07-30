import { IRuntimeService } from './runtime-service';

export class RuntimeRegistry {
  private readonly services = new Map<string, IRuntimeService>();

  register(service: IRuntimeService): void {
    if (this.services.has(service.id)) {
      throw new Error(`[RuntimeRegistry] Service already registered: ${service.id}`);
    }
    this.services.set(service.id, service);
  }

  unregister(id: string): void {
    this.services.delete(id);
  }

  getService<T extends IRuntimeService>(id: string): T {
    const service = this.services.get(id);
    if (!service) {
      throw new Error(`[RuntimeRegistry] Service not found: ${id}`);
    }
    return service as T;
  }

  getAll(): IRuntimeService[] {
    return Array.from(this.services.values());
  }

  getSortedServices(): IRuntimeService[] {
    const visited = new Set<string>();
    const temp = new Set<string>();
    const result: IRuntimeService[] = [];

    const visit = (id: string) => {
      if (temp.has(id)) {
        throw new Error(`[RuntimeRegistry] Circular dependency detected: ${id}`);
      }
      if (!visited.has(id)) {
        temp.add(id);
        const service = this.services.get(id);
        if (service) {
          for (const dep of service.dependencies) {
            visit(dep);
          }
        }
        temp.delete(id);
        visited.add(id);
        const s = this.services.get(id);
        if (s) result.push(s);
      }
    };

    for (const id of this.services.keys()) {
      visit(id);
    }

    return result;
  }
}
