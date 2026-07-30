"use strict";
/**
 * intelligence-application-service.ts — Application Service for Engineering Intelligence
 *
 * Single orchestration boundary for Renderer IPC and external consumers.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.IntelligenceApplicationService = void 0;
class IntelligenceApplicationService {
    indexCoordinator;
    searchEngine;
    contextEngine;
    memoryStore;
    intelligenceService;
    constructor(indexCoordinator, searchEngine, contextEngine, memoryStore, intelligenceService) {
        this.indexCoordinator = indexCoordinator;
        this.searchEngine = searchEngine;
        this.contextEngine = contextEngine;
        this.memoryStore = memoryStore;
        this.intelligenceService = intelligenceService;
    }
    async startIndexing(workspaceRoot) {
        if (!this.indexCoordinator)
            throw new Error('RepositoryIndexCoordinator unavailable');
        return this.indexCoordinator.startIndexing(workspaceRoot);
    }
    async getIndexStatus(jobId) {
        if (!this.indexCoordinator)
            return null;
        return this.indexCoordinator.getIndexJob(jobId);
    }
    async searchSymbols(workspaceRoot, query) {
        if (!this.searchEngine)
            return [];
        return this.searchEngine.searchSymbols(query);
    }
    async searchCodeNaturalLanguage(workspaceRoot, query) {
        if (!this.searchEngine)
            return [];
        return this.searchEngine.searchCodeNaturalLanguage(query);
    }
    async crossReferenceLookup(workspaceRoot, identifier) {
        if (!this.searchEngine) {
            throw new Error('SemanticSearchEngine unavailable');
        }
        return this.searchEngine.crossReferenceLookup(identifier);
    }
    async assembleContext(request) {
        if (!this.contextEngine)
            throw new Error('ContextAssemblyEngine unavailable');
        return this.contextEngine.assembleContext(request);
    }
    async analyzeImpact(workspaceRoot, changedFiles) {
        if (!this.intelligenceService)
            throw new Error('EngineeringIntelligenceService unavailable');
        return this.intelligenceService.analyzeImpact(changedFiles, workspaceRoot);
    }
    async detectDeadCode(workspaceRoot) {
        if (!this.intelligenceService)
            throw new Error('EngineeringIntelligenceService unavailable');
        return this.intelligenceService.detectDeadCode(workspaceRoot);
    }
    async getArchitectureInsights(workspaceRoot) {
        if (!this.intelligenceService)
            throw new Error('EngineeringIntelligenceService unavailable');
        return this.intelligenceService.getArchitectureInsights(workspaceRoot);
    }
    async addADR(adr) {
        if (this.memoryStore) {
            await this.memoryStore.addArchitecturalDecision(adr);
        }
    }
    async listADRs(workspaceRoot) {
        if (!this.memoryStore)
            return [];
        return this.memoryStore.getArchitecturalDecisions(workspaceRoot);
    }
}
exports.IntelligenceApplicationService = IntelligenceApplicationService;
//# sourceMappingURL=intelligence-application-service.js.map