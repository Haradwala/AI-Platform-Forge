"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnalyzerRegistry = void 0;
class AnalyzerRegistry {
    analyzers = new Map();
    register(analyzer) {
        this.analyzers.set(analyzer.name, analyzer);
    }
    getAnalyzers() {
        return Array.from(this.analyzers.values());
    }
    async runAllParallel(snapshot) {
        const promises = Array.from(this.analyzers.values()).map(async (analyzer) => {
            const startTime = Date.now();
            const result = await analyzer.analyze(snapshot);
            const executionTimeMs = Date.now() - startTime;
            return {
                ...result,
                executionTimeMs
            };
        });
        return Promise.all(promises);
    }
}
exports.AnalyzerRegistry = AnalyzerRegistry;
//# sourceMappingURL=analyzer-registry.js.map