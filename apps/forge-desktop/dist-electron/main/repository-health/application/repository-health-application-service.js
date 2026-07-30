"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RepositoryHealthApplicationService = void 0;
const repository_health_orchestrator_1 = require("../orchestrator/repository-health-orchestrator");
class RepositoryHealthApplicationService {
    orchestrator;
    constructor(eventBus) {
        this.orchestrator = new repository_health_orchestrator_1.RepositoryHealthOrchestrator(eventBus);
    }
    async scanRepository(rootPath, options) {
        return this.orchestrator.runFullScan(rootPath, options);
    }
    async getHealthReport() {
        return this.orchestrator.getLatestReport();
    }
    async getSnapshot() {
        return this.orchestrator.getLatestSnapshot();
    }
    async getFindings(severity, category) {
        const all = this.orchestrator.getFindings();
        return all.filter((f) => {
            if (severity && f.severity !== severity)
                return false;
            if (category && f.category !== category)
                return false;
            return true;
        });
    }
}
exports.RepositoryHealthApplicationService = RepositoryHealthApplicationService;
//# sourceMappingURL=repository-health-application-service.js.map