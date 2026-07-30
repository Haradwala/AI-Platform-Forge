import type { IThemeService } from './container/service-interfaces';
import type { IDesktopLogger } from './container/service-interfaces';

export class ThemeService implements IThemeService {
  private activeTheme = 'forge-dark';
  private readonly logger: IDesktopLogger;

  constructor(logger: IDesktopLogger) {
    this.logger = logger;
  }

  async loadTheme(id: string): Promise<void> {
    this.activeTheme = id;
    this.logger.info(`[ThemeService] Loaded theme: ${id}`);
  }

  getActiveTheme(): string {
    return this.activeTheme;
  }

  listThemes(): string[] {
    return ['forge-dark', 'forge-light'];
  }
}
export default ThemeService;
