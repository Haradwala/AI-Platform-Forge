"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PerformanceModule = void 0;
const tokens_1 = require("../container/tokens");
const performance_monitor_1 = require("../performance-monitor");
class PerformanceModule {
    name = 'PerformanceModule';
    dependencies = ['CoreModule'];
    register(container) {
        container.registerSingleton({
            token: tokens_1.T.IPerformanceMonitor,
            name: 'IPerformanceMonitor',
            lifetime: 'singleton',
            dependencies: [tokens_1.T.IDesktopLogger],
            factory: () => new performance_monitor_1.PerformanceMonitor(container.resolve(tokens_1.T.IDesktopLogger)),
        });
    }
}
exports.PerformanceModule = PerformanceModule;
//# sourceMappingURL=performance.module.js.map