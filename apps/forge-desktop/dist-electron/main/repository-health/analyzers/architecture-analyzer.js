"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ArchitectureAnalyzer = void 0;
class ArchitectureAnalyzer {
    name = 'architecture';
    async analyze(snapshot) {
        const startTime = Date.now();
        const findings = [];
        for (const [fileKey, deps] of snapshot.dependencyGraph.entries()) {
            const isRenderer = fileKey.startsWith('src/');
            const isMain = fileKey.startsWith('electron/');
            if (isRenderer) {
                for (const dep of deps) {
                    if (dep.startsWith('electron/main/') && !dep.includes('preload.')) {
                        findings.push({
                            id: `arch-layer-violation-${fileKey}`,
                            title: `Clean Architecture Layer Violation: Renderer importing Main`,
                            severity: 'critical',
                            category: 'architecture',
                            confidence: 1.0,
                            file: fileKey,
                            description: `Renderer file '${fileKey}' directly imports Electron Main module '${dep}'.`,
                            suggestion: 'Route communication strictly through IPC gateway via preload proxy.',
                            fixStrategy: 'move-service',
                            evidence: {
                                matchedRules: ['NoRendererDirectMainImportRule'],
                                relatedFiles: [dep],
                                metrics: { violationLevel: 4 }
                            },
                            autoFixAvailable: false,
                            estimatedImpact: 'high',
                            timestamp: Date.now()
                        });
                    }
                }
            }
        }
        return {
            analyzerName: this.name,
            executionTimeMs: Date.now() - startTime,
            findings
        };
    }
}
exports.ArchitectureAnalyzer = ArchitectureAnalyzer;
//# sourceMappingURL=architecture-analyzer.js.map