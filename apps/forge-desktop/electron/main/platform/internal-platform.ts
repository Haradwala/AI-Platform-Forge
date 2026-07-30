import { IDesktopContainer } from '../container/interfaces';

export class InternalPlatform {
  private static container: IDesktopContainer | null = null;

  static initialize(container: IDesktopContainer): void {
    this.container = container;
  }

  static getService<T>(token: any): T {
    if (!this.container) {
      throw new Error('[InternalPlatform] Not initialized with DI container.');
    }
    return this.container.resolve<T>(token);
  }
}
