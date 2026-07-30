import { IRepositoryAnalyzer } from '../registry/analyzer-registry';
import { RepositorySnapshot, AnalyzerResult } from '../contracts/health-types';
export declare class DependencyAnalyzer implements IRepositoryAnalyzer {
    readonly name = "dependency";
    analyze(snapshot: RepositorySnapshot): Promise<AnalyzerResult>;
}
