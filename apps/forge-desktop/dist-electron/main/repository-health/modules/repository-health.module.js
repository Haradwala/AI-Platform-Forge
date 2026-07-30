"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RepositoryHealthModule = void 0;
const repository_health_application_service_1 = require("../application/repository-health-application-service");
const health_ipc_handlers_1 = require("../ipc/health-ipc-handlers");
class RepositoryHealthModule {
    healthService;
    constructor(eventBus) {
        this.healthService = new repository_health_application_service_1.RepositoryHealthApplicationService(eventBus);
    }
    getService() {
        return this.healthService;
    }
    registerIpc(ipcRouter) {
        (0, health_ipc_handlers_1.registerHealthIpcHandlers)(ipcRouter, this.healthService);
    }
}
exports.RepositoryHealthModule = RepositoryHealthModule;
//# sourceMappingURL=repository-health.module.js.map