import { IModuleLoader, IForgeModule, IForgeContext } from '../interfaces';

export class ModuleLoader implements IModuleLoader {
  private modules = new Map<string, IForgeModule>();
  private loadedModules: IForgeModule[] = [];

  registerModule(module: IForgeModule): void {
    if (this.modules.has(module.name)) {
      throw new Error(`ModuleLoader: Duplicate module registration detected for name: ${module.name}`);
    }
    this.modules.set(module.name, module);
  }

  getRegisteredModules(): IForgeModule[] {
    return Array.from(this.modules.values());
  }

  async loadModules(context: IForgeContext): Promise<void> {
    const sorted = this.resolveDependencies();
    context.logger.info(`ModuleLoader: Resolved modules startup order: ${sorted.map(m => m.name).join(' -> ')}`);

    for (const module of sorted) {
      if (module.initialize) {
        context.logger.debug(`ModuleLoader: Initializing module: ${module.name}`);
        await module.initialize(context);
      }
    }

    for (const module of sorted) {
      if (module.start) {
        context.logger.debug(`ModuleLoader: Starting module: ${module.name}`);
        await module.start(context);
      }
      this.loadedModules.push(module);
    }
  }

  async unloadModules(context: IForgeContext): Promise<void> {
    const reverseSorted = [...this.loadedModules].reverse();
    
    for (const module of reverseSorted) {
      if (module.stop) {
        context.logger.debug(`ModuleLoader: Stopping module: ${module.name}`);
        try {
          await module.stop(context);
        } catch (err) {
          context.logger.error(`ModuleLoader: Error stopping module: ${module.name}`, err as Error);
        }
      }
    }

    for (const module of reverseSorted) {
      if (module.dispose) {
        context.logger.debug(`ModuleLoader: Disposing module: ${module.name}`);
        try {
          await module.dispose(context);
        } catch (err) {
          context.logger.error(`ModuleLoader: Error disposing module: ${module.name}`, err as Error);
        }
      }
    }

    this.loadedModules = [];
  }

  private resolveDependencies(): IForgeModule[] {
    const sorted: IForgeModule[] = [];
    const visited = new Map<string, 'VISITING' | 'VISITED'>();

    const visit = (moduleName: string) => {
      const state = visited.get(moduleName);
      if (state === 'VISITING') {
        throw new Error(`ModuleLoader: Circular dependency detected involving module: ${moduleName}`);
      }
      if (state === 'VISITED') {
        return;
      }

      const module = this.modules.get(moduleName);
      if (!module) {
        throw new Error(`ModuleLoader: Missing dependency module: ${moduleName}`);
      }

      visited.set(moduleName, 'VISITING');

      for (const dep of module.dependencies) {
        visit(dep);
      }

      visited.set(moduleName, 'VISITED');
      sorted.push(module);
    };

    for (const name of this.modules.keys()) {
      visit(name);
    }

    return sorted;
  }
}
