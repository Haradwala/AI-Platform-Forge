"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RepositoryMetricsCalculator = void 0;
class RepositoryMetricsCalculator {
    calculate(snapshot) {
        const classSet = new Set();
        const interfaceSet = new Set();
        const tokenSet = new Set();
        const ipcSet = new Set();
        const eventSet = new Set();
        for (const ast of snapshot.astNodes.values()) {
            ast.exportedClasses.forEach((c) => classSet.add(c));
            ast.exportedInterfaces.forEach((i) => interfaceSet.add(i));
            ast.diTokenDeclarations.forEach((t) => tokenSet.add(t));
            ast.ipcChannelRegistrations.forEach((r) => ipcSet.add(r));
            ast.eventBusTopicSubscriptions.forEach((e) => eventSet.add(e));
        }
        return {
            totalFiles: snapshot.totalFiles,
            totalLOC: snapshot.totalLOC,
            totalClasses: classSet.size,
            totalInterfaces: interfaceSet.size,
            totalDiTokens: tokenSet.size,
            totalIpcRoutes: ipcSet.size,
            totalEventTopics: eventSet.size
        };
    }
}
exports.RepositoryMetricsCalculator = RepositoryMetricsCalculator;
//# sourceMappingURL=repository-metrics-calculator.js.map