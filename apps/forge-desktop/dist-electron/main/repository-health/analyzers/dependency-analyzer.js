"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DependencyAnalyzer = void 0;
class DependencyAnalyzer {
    name = 'dependency';
    async analyze(snapshot) {
        const startTime = Date.now();
        const findings = [];
        // High coupling score detection
        for (const [fileKey, deps] of snapshot.dependencyGraph.entries()) {
            const dependents = snapshot.reverseDependencyGraph.get(fileKey) || new Set();
            const couplingScore = deps.size + dependents.size;
            if (couplingScore > 35) {
                findings.push({
                    id: `coupling-high-${fileKey}`,
                    title: `High Coupling Hub: ${fileKey}`,
                    severity: 'high',
                    category: 'dependency',
                    confidence: 0.9,
                    file: fileKey,
                    description: `File '${fileKey}' has high coupling score ${couplingScore} (Fan-In: ${dependents.size}, Fan-Out: ${deps.size}).`,
                    suggestion: 'Decouple responsibilities into dedicated interfaces or facades.',
                    fixStrategy: 'extract-interface',
                    evidence: {
                        matchedRules: ['HighCouplingThresholdRule'],
                        relatedFiles: Array.from(deps).slice(0, 5),
                        metrics: { fanIn: dependents.size, fanOut: deps.size, couplingScore }
                    },
                    autoFixAvailable: false,
                    estimatedImpact: 'high',
                    timestamp: Date.now()
                });
            }
        }
        return {
            analyzerName: this.name,
            executionTimeMs: Date.now() - startTime,
            findings
        };
    }
}
exports.DependencyAnalyzer = DependencyAnalyzer;
//# sourceMappingURL=dependency-analyzer.js.map