import { IRepositoryAnalyzer } from '../registry/analyzer-registry';
import { RepositorySnapshot, AnalyzerResult } from '../contracts/health-types';
export declare class DuplicateCodeAnalyzer implements IRepositoryAnalyzer {
    readonly name = "duplicate-code";
    analyze(snapshot: RepositorySnapshot): Promise<AnalyzerResult>;
}
