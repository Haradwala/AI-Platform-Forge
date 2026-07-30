"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ThemeModule = void 0;
const tokens_1 = require("../container/tokens");
const theme_service_1 = require("../theme-service");
class ThemeModule {
    name = 'ThemeModule';
    dependencies = ['CoreModule'];
    register(container) {
        container.registerSingleton({
            token: tokens_1.T.IThemeService,
            name: 'IThemeService',
            lifetime: 'singleton',
            dependencies: [tokens_1.T.IDesktopLogger],
            factory: () => new theme_service_1.ThemeService(container.resolve(tokens_1.T.IDesktopLogger)),
        });
    }
}
exports.ThemeModule = ThemeModule;
//# sourceMappingURL=theme.module.js.map