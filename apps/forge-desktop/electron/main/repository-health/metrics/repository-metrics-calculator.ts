import { RepositorySnapshot } from '../contracts/health-types';

export interface CalculatedMetrics {
  totalFiles: number;
  totalLOC: number;
  totalClasses: number;
  totalInterfaces: number;
  totalDiTokens: number;
  totalIpcRoutes: number;
  totalEventTopics: number;
}

export class RepositoryMetricsCalculator {
  calculate(snapshot: RepositorySnapshot): CalculatedMetrics {
    const classSet = new Set<string>();
    const interfaceSet = new Set<string>();
    const tokenSet = new Set<string>();
    const ipcSet = new Set<string>();
    const eventSet = new Set<string>();

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
