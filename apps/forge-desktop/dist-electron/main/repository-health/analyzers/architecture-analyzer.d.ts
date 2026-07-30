import { IRepositoryAnalyzer } from '../registry/analyzer-registry';
import { RepositorySnapshot, AnalyzerResult } from '../contracts/health-types';
export declare class ArchitectureAnalyzer implements IRepositoryAnalyzer {
    readonly name = "architecture";
    analyze(snapshot: RepositorySnapshot): Promise<AnalyzerResult>;
}
