import { IForgeContext } from '../interfaces/context';
import { ILogger, IConfigService, IDIContainer, IEventBus } from '@forge/core';
import { IServiceRegistry } from '../interfaces/services';
import { ILifecycleManager } from '../interfaces/lifecycle';
import { IHealthManager } from '../interfaces/health';
import { IWorkspace } from '@forge/shared';

export class ForgeContext implements IForgeContext {
  constructor(
    public readonly logger: ILogger,
    public readonly config: IConfigService,
    public readonly di: IDIContainer,
    public readonly eventBus: IEventBus,
    public readonly services: IServiceRegistry,
    public readonly lifecycle: ILifecycleManager,
    public readonly health: IHealthManager,
    public readonly workspace?: IWorkspace
  ) {}
}
