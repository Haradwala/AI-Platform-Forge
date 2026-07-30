import type { IAiExperience } from '../outcome/outcome-types';
import type { IDesktopLogger, IDesktopEventBus } from '../../container/service-interfaces';
import { MemoryRegistry } from '../memory/memory-registry';
export interface ILearningPattern {
    readonly id: string;
    readonly failureType: string;
    readonly recommendedStrategyId: string;
    readonly successRate: number;
}
export interface ILearningReport {
    readonly patternsDiscovered: ILearningPattern[];
    readonly promptOptimizations: string[];
    readonly strategyCalibrations: string[];
    readonly timestamp: string;
}
export declare class ExperienceStore {
    private experiences;
    addExperience(experience: IAiExperience): void;
    getAll(): IAiExperience[];
    saveStore(workspaceRoot: string | null): void;
    clear(): void;
}
export declare class PatternEngine {
    findPatterns(experiences: IAiExperience[]): ILearningPattern[];
}
export declare class StrategyOptimizer {
    optimize(experiences: IAiExperience[]): string[];
}
export declare class PlanningOptimizer {
    optimize(experiences: IAiExperience[]): string[];
}
export declare class RecoveryOptimizer {
    optimize(experiences: IAiExperience[]): string[];
}
export declare class PromptOptimizer {
    optimize(experiences: IAiExperience[]): string[];
}
export declare class ToolOptimizer {
    optimize(experiences: IAiExperience[]): string[];
}
export declare class LearningPolicyEngine {
    shouldApply(_optimizationId: string, confidence: number): boolean;
}
export declare class ConfidenceCalibrator {
    calibrate(experiences: IAiExperience[]): string[];
}
export declare class MemoryConsolidator {
    private readonly memoryRegistry;
    constructor(memoryRegistry: MemoryRegistry);
    consolidate(experience: IAiExperience): Promise<void>;
}
export declare class LearningMetrics {
    private patternsFound;
    private calibrationsRun;
    recordPatternFound(): void;
    recordCalibration(): void;
    getStats(): {
        patternsFound: number;
        calibrationsRun: number;
    };
    clear(): void;
}
export declare class LearningReportBuilder {
    buildReport(report: ILearningReport, workspaceRoot: string | null): void;
}
export declare class LearningEngine {
    private readonly experienceStore;
    private readonly patternEngine;
    private readonly strategyOptimizer;
    private readonly planningOptimizer;
    private readonly recoveryOptimizer;
    private readonly promptOptimizer;
    private readonly toolOptimizer;
    private readonly policyEngine;
    private readonly confidenceCalibrator;
    private readonly memoryConsolidator;
    private readonly reportBuilder;
    private readonly metrics;
    private readonly eventBus;
    private readonly logger;
    constructor(experienceStore: ExperienceStore, patternEngine: PatternEngine, strategyOptimizer: StrategyOptimizer, planningOptimizer: PlanningOptimizer, recoveryOptimizer: RecoveryOptimizer, promptOptimizer: PromptOptimizer, toolOptimizer: ToolOptimizer, policyEngine: LearningPolicyEngine, confidenceCalibrator: ConfidenceCalibrator, memoryConsolidator: MemoryConsolidator, reportBuilder: LearningReportBuilder, metrics: LearningMetrics, eventBus: IDesktopEventBus, logger: IDesktopLogger);
    learn(outcome: import('../outcome/outcome-types').IExecutionOutcome): Promise<ILearningReport>;
}
