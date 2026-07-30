"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InternalPlatform = void 0;
class InternalPlatform {
    static container = null;
    static initialize(container) {
        this.container = container;
    }
    static getService(token) {
        if (!this.container) {
            throw new Error('[InternalPlatform] Not initialized with DI container.');
        }
        return this.container.resolve(token);
    }
}
exports.InternalPlatform = InternalPlatform;
//# sourceMappingURL=internal-platform.js.map