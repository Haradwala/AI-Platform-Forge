import { RepositorySnapshot, AnalyzerResult } from '../contracts/health-types';
export interface IRepositoryAnalyzer {
    readonly name: string;
    analyze(snapshot: RepositorySnapshot): Promise<AnalyzerResult>;
}
export declare class AnalyzerRegistry {
    private analyzers;
    register(analyzer: IRepositoryAnalyzer): void;
    getAnalyzers(): IRepositoryAnalyzer[];
    runAllParallel(snapshot: RepositorySnapshot): Promise<AnalyzerResult[]>;
}
