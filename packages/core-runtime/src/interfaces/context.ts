import { ILogger, IConfigService, IDIContainer, IEventBus } from '@forge/core';
import { IWorkspace } from '@forge/shared';
import { IServiceRegistry } from './services';
import { ILifecycleManager } from './lifecycle';
import { IHealthManager } from './health';

export interface IForgeContext {
  readonly logger: ILogger;
  readonly config: IConfigService;
  readonly di: IDIContainer;
  readonly eventBus: IEventBus;
  readonly services: IServiceRegistry;
  readonly lifecycle: ILifecycleManager;
  readonly health: IHealthManager;
  readonly workspace?: IWorkspace;
}
