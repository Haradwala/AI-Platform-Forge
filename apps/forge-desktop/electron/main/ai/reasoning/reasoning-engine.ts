export interface IAssumption {
  readonly id: string;
  readonly statement: string;
  readonly confidence: number;
  readonly evidenceId?: string;
}

export class AssumptionManager {
  private readonly assumptions = new Map<string, IAssumption>();

  addAssumption(statement: string, confidence: number, evidenceId?: string): IAssumption {
    const id = `as_${Date.now()}_${Math.random().toString(36).substring(2, 5)}`;
    const assumption: IAssumption = { id, statement, confidence, evidenceId };
    this.assumptions.set(id, assumption);
    return assumption;
  }

  getAssumption(id: string): IAssumption | null {
    return this.assumptions.get(id) || null;
  }

  getAll(): IAssumption[] {
    return Array.from(this.assumptions.values());
  }

  clear(): void {
    this.assumptions.clear();
  }
}

export interface IConstraint {
  readonly id: string;
  readonly category: 'architecture' | 'style' | 'rules' | 'tools';
  readonly description: string;
}

export class ConstraintRegistry {
  private readonly constraints = new Map<string, IConstraint>();

  constructor() {
    this.registerConstraint('arch:runtime-isolated', 'architecture', 'Do not compile main process dependencies inside UI modules.');
    this.registerConstraint('style:ts-semi', 'style', 'Use semicolons for statements endings in TS/JS files.');
    this.registerConstraint('style:tabs-2', 'style', 'Use 2 spaces indentation.');
    this.registerConstraint('rules:read-first', 'rules', 'Always read file contents before executing edits.');
  }

  registerConstraint(id: string, category: IConstraint['category'], description: string): void {
    this.constraints.set(id, { id, category, description });
  }

  getConstraintsByCategory(category: IConstraint['category']): IConstraint[] {
    return Array.from(this.constraints.values()).filter((c) => c.category === category);
  }

  getAll(): IConstraint[] {
    return Array.from(this.constraints.values());
  }
}

export interface IEvidence {
  readonly id: string;
  readonly file: string;
  readonly snippet: string;
  readonly lineRange: [number, number];
}

export class EvidenceCollector {
  private readonly evidences: IEvidence[] = [];

  collectEvidence(file: string, snippet: string, lineRange: [number, number]): IEvidence {
    const evidence: IEvidence = {
      id: `ev_${Date.now()}_${Math.random().toString(36).substring(2, 5)}`,
      file,
      snippet,
      lineRange,
    };
    this.evidences.push(evidence);
    return evidence;
  }

  getEvidencesForFile(file: string): IEvidence[] {
    return this.evidences.filter((ev) => ev.file === file);
  }

  clear(): void {
    this.evidences.length = 0;
  }
}

export interface IReasoningReport {
  readonly hypothesis: string;
  readonly constraintsMatched: IConstraint[];
  readonly risksAssessed: Array<{ target: string; level: 'high' | 'medium' | 'low'; description: string }>;
  readonly alternativeStrategies: string[];
  readonly decision: string;
  readonly confidence: number;
}

export class ReasoningEngine {
  constructor(
    public readonly assumptionManager: AssumptionManager,
    public readonly constraintRegistry: ConstraintRegistry,
    public readonly evidenceCollector: EvidenceCollector
  ) {}

  reason(goalDescription: string, evidences: IEvidence[]): IReasoningReport {
    const cleanGoal = goalDescription.toLowerCase();
    const constraintsMatched = this.constraintRegistry.getAll().filter((c) => {
      if (c.category === 'rules') return true;
      if (cleanGoal.includes('style') && c.category === 'style') return true;
      if (cleanGoal.includes('refactor') && c.category === 'architecture') return true;
      return false;
    });

    const risksAssessed: IReasoningReport['risksAssessed'] = [];
    if (cleanGoal.includes('delete') || cleanGoal.includes('package.json')) {
      risksAssessed.push({
        target: 'Workspace configurations',
        level: 'high',
        description: 'Potentially destructive change or dependencies replacement.',
      });
    } else if (cleanGoal.includes('modify') || cleanGoal.includes('fix')) {
      risksAssessed.push({
        target: 'Source files content',
        level: 'medium',
        description: 'Editing existing implementations.',
      });
    } else {
      risksAssessed.push({
        target: 'Documentation/New files',
        level: 'low',
        description: 'Creating assets or explaining parameters.',
      });
    }

    const alternativeStrategies: string[] = [];
    let decision = 'Standard tool executor execution flow.';
    let confidence = 0.85;

    if (cleanGoal.includes('debug')) {
      alternativeStrategies.push('Strategy A: Run automated tests immediately to locate errors.');
      alternativeStrategies.push('Strategy B: Read stack trace log lines first.');
      decision = 'Strategy B selected: Investigate log snippet files first.';
      confidence = 0.9;
      this.assumptionManager.addAssumption('Errors reside in recent active documents', 0.8);
    } else {
      alternativeStrategies.push('Strategy A: Direct code generation.');
      alternativeStrategies.push('Strategy B: Search workspace symbols before modifying.');
      decision = 'Strategy B selected: Verify workspace symbols mapping.';
    }

    return {
      hypothesis: `Solve user goal: ${goalDescription}`,
      constraintsMatched,
      risksAssessed,
      alternativeStrategies,
      decision,
      confidence,
    };
  }
}
