export interface IAssumption {
    readonly id: string;
    readonly statement: string;
    readonly confidence: number;
    readonly evidenceId?: string;
}
export declare class AssumptionManager {
    private readonly assumptions;
    addAssumption(statement: string, confidence: number, evidenceId?: string): IAssumption;
    getAssumption(id: string): IAssumption | null;
    getAll(): IAssumption[];
    clear(): void;
}
export interface IConstraint {
    readonly id: string;
    readonly category: 'architecture' | 'style' | 'rules' | 'tools';
    readonly description: string;
}
export declare class ConstraintRegistry {
    private readonly constraints;
    constructor();
    registerConstraint(id: string, category: IConstraint['category'], description: string): void;
    getConstraintsByCategory(category: IConstraint['category']): IConstraint[];
    getAll(): IConstraint[];
}
export interface IEvidence {
    readonly id: string;
    readonly file: string;
    readonly snippet: string;
    readonly lineRange: [number, number];
}
export declare class EvidenceCollector {
    private readonly evidences;
    collectEvidence(file: string, snippet: string, lineRange: [number, number]): IEvidence;
    getEvidencesForFile(file: string): IEvidence[];
    clear(): void;
}
export interface IReasoningReport {
    readonly hypothesis: string;
    readonly constraintsMatched: IConstraint[];
    readonly risksAssessed: Array<{
        target: string;
        level: 'high' | 'medium' | 'low';
        description: string;
    }>;
    readonly alternativeStrategies: string[];
    readonly decision: string;
    readonly confidence: number;
}
export declare class ReasoningEngine {
    readonly assumptionManager: AssumptionManager;
    readonly constraintRegistry: ConstraintRegistry;
    readonly evidenceCollector: EvidenceCollector;
    constructor(assumptionManager: AssumptionManager, constraintRegistry: ConstraintRegistry, evidenceCollector: EvidenceCollector);
    reason(goalDescription: string, evidences: IEvidence[]): IReasoningReport;
}
