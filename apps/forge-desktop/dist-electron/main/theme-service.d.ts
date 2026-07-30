import type { IThemeService } from './container/service-interfaces';
import type { IDesktopLogger } from './container/service-interfaces';
export declare class ThemeService implements IThemeService {
    private activeTheme;
    private readonly logger;
    constructor(logger: IDesktopLogger);
    loadTheme(id: string): Promise<void>;
    getActiveTheme(): string;
    listThemes(): string[];
}
export default ThemeService;
