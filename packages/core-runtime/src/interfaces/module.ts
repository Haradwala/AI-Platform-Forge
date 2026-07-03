import { IForgeContext } from './context';
import { HealthStatus } from './health';

export interface IForgeModule {
  readonly name: string;
  readonly version: string;
  readonly dependencies: string[];
  
  initialize?(context: IForgeContext): Promise<void>;
  start?(context: IForgeContext): Promise<void>;
  stop?(context: IForgeContext): Promise<void>;
  dispose?(context: IForgeContext): Promise<void>;
  checkHealth?(): Promise<HealthStatus>;
}

export interface IModuleLoader {
  registerModule(module: IForgeModule): void;
  loadModules(context: IForgeContext): Promise<void>;
  unloadModules(context: IForgeContext): Promise<void>;
  getRegisteredModules(): IForgeModule[];
}
