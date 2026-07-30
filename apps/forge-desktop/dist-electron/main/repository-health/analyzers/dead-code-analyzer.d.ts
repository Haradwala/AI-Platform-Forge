import { IRepositoryAnalyzer } from '../registry/analyzer-registry';
import { RepositorySnapshot, AnalyzerResult } from '../contracts/health-types';
export declare class DeadCodeAnalyzer implements IRepositoryAnalyzer {
    readonly name = "dead-code";
    analyze(snapshot: RepositorySnapshot): Promise<AnalyzerResult>;
}
