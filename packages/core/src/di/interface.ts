export type Token<T = any> = string | symbol | { new (...args: any[]): T };

export interface IDIContainer {
  register<T>(token: Token<T>, provider: { new (...args: any[]): T }): void;
  registerInstance<T>(token: Token<T>, instance: T): void;
  resolve<T>(token: Token<T>): T;
  clear(): void;
}
