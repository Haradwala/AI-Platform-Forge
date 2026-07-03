import { IForgeContext, IForgeModule } from '../interfaces';
import { ConfigService, Logger, DIContainer, EventBus } from '@forge/core';
import { ServiceRegistry } from '../registry/service-registry';
import { LifecycleManager } from '../lifecycle/manager';
import { HealthManager } from '../health/health-manager';
import { ModuleLoader } from './module-loader';
import { ForgeContext } from './context';
import { LifecycleState } from '../interfaces/lifecycle';

export class BootstrapEngine {
  private loader = new ModuleLoader();

  registerModule(module: IForgeModule): void {
    this.loader.registerModule(module);
  }

  async bootstrap(configOverrides?: Record<string, any>): Promise<IForgeContext> {
    const config = new ConfigService(configOverrides);
    const logger = new Logger();
    const eventBus = new EventBus();
    const di = new DIContainer();

    di.registerInstance('config', config);
    di.registerInstance('logger', logger);
    di.registerInstance('eventBus', eventBus);

    logger.info('BootstrapEngine: Initializing Forge Core Runtime...');

    const lifecycle = new LifecycleManager();
    lifecycle.setEventBus(eventBus);
    
    const services = new ServiceRegistry();
    const health = new HealthManager(eventBus);

    di.registerInstance('lifecycle', lifecycle);
    di.registerInstance('services', services);
    di.registerInstance('health', health);

    const context = new ForgeContext(
      logger,
      config,
      di,
      eventBus,
      services,
      lifecycle,
      health
    );

    di.registerInstance('context', context);

    try {
      await lifecycle.transitionTo(LifecycleState.INITIALIZING);
      await lifecycle.transitionTo(LifecycleState.STARTING);
      
      logger.info('BootstrapEngine: Loading registered modules...');
      await this.loader.loadModules(context);

      await lifecycle.transitionTo(LifecycleState.RUNNING);
      
      logger.info('BootstrapEngine: Forge OS is fully running.');
      return context;
    } catch (err) {
      logger.error('BootstrapEngine: Critical failure during bootstrap cycle.', err as Error);
      await lifecycle.transitionTo(LifecycleState.FAILED);
      throw err;
    }
  }

  async shutdown(context: IForgeContext): Promise<void> {
    const logger = context.logger;
    const lifecycle = context.lifecycle;

    logger.info('BootstrapEngine: Initiating graceful shutdown...');

    try {
      await lifecycle.transitionTo(LifecycleState.STOPPING);
      await this.loader.unloadModules(context);
      await lifecycle.transitionTo(LifecycleState.DISPOSING);
      await context.services.dispose();
      await lifecycle.transitionTo(LifecycleState.STOPPED);
      
      logger.info('BootstrapEngine: Forge OS stopped cleanly.');
    } catch (err) {
      logger.error('BootstrapEngine: Error during shutdown cycle.', err as Error);
      if (lifecycle.getState() !== LifecycleState.FAILED) {
        try {
          await lifecycle.transitionTo(LifecycleState.FAILED);
        } catch {
          // Ignore secondary transitions errors on hard failures
        }
      }
      throw err;
    }
  }
}
