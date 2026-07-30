import { RepositorySnapshot, AnalyzerResult } from '../contracts/health-types';

export interface IRepositoryAnalyzer {
  readonly name: string;
  analyze(snapshot: RepositorySnapshot): Promise<AnalyzerResult>;
}

export class AnalyzerRegistry {
  private analyzers: Map<string, IRepositoryAnalyzer> = new Map();

  register(analyzer: IRepositoryAnalyzer): void {
    this.analyzers.set(analyzer.name, analyzer);
  }

  getAnalyzers(): IRepositoryAnalyzer[] {
    return Array.from(this.analyzers.values());
  }

  async runAllParallel(snapshot: RepositorySnapshot): Promise<AnalyzerResult[]> {
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
