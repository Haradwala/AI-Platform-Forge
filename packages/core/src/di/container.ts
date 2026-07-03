import { Token, IDIContainer } from './interface';

export class DIContainer implements IDIContainer {
  private instances = new Map<Token, any>();
  private mappings = new Map<Token, { new (...args: any[]): any }>();

  register<T>(token: Token<T>, provider: { new (...args: any[]): T }): void {
    this.mappings.set(token, provider);
  }

  registerInstance<T>(token: Token<T>, instance: T): void {
    this.instances.set(token, instance);
  }

  resolve<T>(token: Token<T>): T {
    if (this.instances.has(token)) {
      return this.instances.get(token);
    }
    const target = this.mappings.get(token);
    if (!target) {
      throw new Error(`DIContainer: No provider registered for token: ${String(token)}`);
    }
    // Perform injection by passing this container as the first argument to target constructor
    const instance = new target(this);
    this.instances.set(token, instance);
    return instance;
  }

  clear(): void {
    this.instances.clear();
    this.mappings.clear();
  }
}
