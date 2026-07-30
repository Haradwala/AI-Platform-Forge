"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ThemeService = void 0;
class ThemeService {
    activeTheme = 'forge-dark';
    logger;
    constructor(logger) {
        this.logger = logger;
    }
    async loadTheme(id) {
        this.activeTheme = id;
        this.logger.info(`[ThemeService] Loaded theme: ${id}`);
    }
    getActiveTheme() {
        return this.activeTheme;
    }
    listThemes() {
        return ['forge-dark', 'forge-light'];
    }
}
exports.ThemeService = ThemeService;
exports.default = ThemeService;
//# sourceMappingURL=theme-service.js.map