import type { IPlan, IDesktopLogger, IDesktopEventBus } from '../../container/service-interfaces';
import type { IVerificationReport } from '../verification/verification-types';
import type { IRecoveryReport } from '../recovery/recovery-types';
export interface IReflectionFinding {
    readonly id: string;
    readonly severity: 'error' | 'warning' | 'info';
    readonly category: string;
    readonly location: string;
    readonly confidence: number;
    readonly recommendation: string;
    readonly evidence: string;
}
export interface IQualityScores {
    readonly maintainability: number;
    readonly readability: number;
    readonly safety: number;
    readonly performance: number;
    readonly correctness: number;
    readonly complexity: number;
}
export interface IConfidenceScores {
    readonly execution: number;
    readonly verification: number;
    readonly recovery: number;
    readonly architecture: number;
    readonly reasoning: number;
    readonly overall: number;
}
export interface IReflectionReport {
    readonly success: boolean;
    readonly findings: IReflectionFinding[];
    readonly scores: IQualityScores;
    readonly confidence: IConfidenceScores;
    readonly recommendations: string[];
}
interface IReflectionContext {
    readonly planId: string;
    readonly goal: string;
    readonly verificationSuccess: boolean;
    readonly recoveryAttemptsCount: number;
    readonly workspaceRoot: string | null;
}
export declare class ReflectionContextBuilder {
    build(plan: IPlan, verification: IVerificationReport, recovery: IRecoveryReport | null, workspaceRoot: string | null): IReflectionContext;
}
export declare class ArchitectureReviewer {
    review(context: IReflectionContext): IReflectionFinding[];
}
export declare class SolutionReviewer {
    review(context: IReflectionContext): IReflectionFinding[];
}
export declare class SelfCritiqueEngine {
    critique(context: IReflectionContext): IReflectionFinding[];
}
export declare class ConfidenceEngine {
    calculate(context: IReflectionContext): IConfidenceScores;
}
export declare class ScoreAggregator {
    aggregate(context: IReflectionContext): IQualityScores;
}
export declare class RecommendationEngine {
    generate(findings: IReflectionFinding[]): string[];
}
export declare class ReflectionReportBuilder {
    buildReport(report: IReflectionReport, workspaceRoot: string | null): void;
}
export declare class ReflectionEngine {
    private readonly contextBuilder;
    private readonly architectureReviewer;
    private readonly solutionReviewer;
    private readonly selfCritiqueEngine;
    private readonly confidenceEngine;
    private readonly scoreAggregator;
    private readonly recommendationEngine;
    private readonly reportBuilder;
    private readonly eventBus;
    private readonly logger;
    constructor(contextBuilder: ReflectionContextBuilder, architectureReviewer: ArchitectureReviewer, solutionReviewer: SolutionReviewer, selfCritiqueEngine: SelfCritiqueEngine, confidenceEngine: ConfidenceEngine, scoreAggregator: ScoreAggregator, recommendationEngine: RecommendationEngine, reportBuilder: ReflectionReportBuilder, eventBus: IDesktopEventBus, logger: IDesktopLogger);
    reflect(plan: IPlan, verification: IVerificationReport, recovery: IRecoveryReport | null, workspaceRoot: string | null): Promise<IReflectionReport>;
}
export {};
