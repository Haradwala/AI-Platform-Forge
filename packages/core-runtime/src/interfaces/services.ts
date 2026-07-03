export interface IService {
  name: string;
  initialize?(): Promise<void>;
  dispose?(): Promise<void>;
}

export interface IServiceRegistry {
  register(name: string, service: IService | (() => IService), lazy?: boolean): void;
  resolve<T extends IService>(name: string): Promise<T>;
  exists(name: string): boolean;
  list(): string[];
  dispose(): Promise<void>;
}
