import { IRepositoryAnalyzer } from '../registry/analyzer-registry';
import { RepositorySnapshot, AnalyzerResult } from '../contracts/health-types';
export declare class ComplexityAnalyzer implements IRepositoryAnalyzer {
    readonly name = "complexity";
    analyze(snapshot: RepositorySnapshot): Promise<AnalyzerResult>;
}
