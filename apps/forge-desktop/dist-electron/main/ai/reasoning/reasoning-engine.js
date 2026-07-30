"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReasoningEngine = exports.EvidenceCollector = exports.ConstraintRegistry = exports.AssumptionManager = void 0;
class AssumptionManager {
    assumptions = new Map();
    addAssumption(statement, confidence, evidenceId) {
        const id = `as_${Date.now()}_${Math.random().toString(36).substring(2, 5)}`;
        const assumption = { id, statement, confidence, evidenceId };
        this.assumptions.set(id, assumption);
        return assumption;
    }
    getAssumption(id) {
        return this.assumptions.get(id) || null;
    }
    getAll() {
        return Array.from(this.assumptions.values());
    }
    clear() {
        this.assumptions.clear();
    }
}
exports.AssumptionManager = AssumptionManager;
class ConstraintRegistry {
    constraints = new Map();
    constructor() {
        this.registerConstraint('arch:runtime-isolated', 'architecture', 'Do not compile main process dependencies inside UI modules.');
        this.registerConstraint('style:ts-semi', 'style', 'Use semicolons for statements endings in TS/JS files.');
        this.registerConstraint('style:tabs-2', 'style', 'Use 2 spaces indentation.');
        this.registerConstraint('rules:read-first', 'rules', 'Always read file contents before executing edits.');
    }
    registerConstraint(id, category, description) {
        this.constraints.set(id, { id, category, description });
    }
    getConstraintsByCategory(category) {
        return Array.from(this.constraints.values()).filter((c) => c.category === category);
    }
    getAll() {
        return Array.from(this.constraints.values());
    }
}
exports.ConstraintRegistry = ConstraintRegistry;
class EvidenceCollector {
    evidences = [];
    collectEvidence(file, snippet, lineRange) {
        const evidence = {
            id: `ev_${Date.now()}_${Math.random().toString(36).substring(2, 5)}`,
            file,
            snippet,
            lineRange,
        };
        this.evidences.push(evidence);
        return evidence;
    }
    getEvidencesForFile(file) {
        return this.evidences.filter((ev) => ev.file === file);
    }
    clear() {
        this.evidences.length = 0;
    }
}
exports.EvidenceCollector = EvidenceCollector;
class ReasoningEngine {
    assumptionManager;
    constraintRegistry;
    evidenceCollector;
    constructor(assumptionManager, constraintRegistry, evidenceCollector) {
        this.assumptionManager = assumptionManager;
        this.constraintRegistry = constraintRegistry;
        this.evidenceCollector = evidenceCollector;
    }
    reason(goalDescription, evidences) {
        const cleanGoal = goalDescription.toLowerCase();
        const constraintsMatched = this.constraintRegistry.getAll().filter((c) => {
            if (c.category === 'rules')
                return true;
            if (cleanGoal.includes('style') && c.category === 'style')
                return true;
            if (cleanGoal.includes('refactor') && c.category === 'architecture')
                return true;
            return false;
        });
        const risksAssessed = [];
        if (cleanGoal.includes('delete') || cleanGoal.includes('package.json')) {
            risksAssessed.push({
                target: 'Workspace configurations',
                level: 'high',
                description: 'Potentially destructive change or dependencies replacement.',
            });
        }
        else if (cleanGoal.includes('modify') || cleanGoal.includes('fix')) {
            risksAssessed.push({
                target: 'Source files content',
                level: 'medium',
                description: 'Editing existing implementations.',
            });
        }
        else {
            risksAssessed.push({
                target: 'Documentation/New files',
                level: 'low',
                description: 'Creating assets or explaining parameters.',
            });
        }
        const alternativeStrategies = [];
        let decision = 'Standard tool executor execution flow.';
        let confidence = 0.85;
        if (cleanGoal.includes('debug')) {
            alternativeStrategies.push('Strategy A: Run automated tests immediately to locate errors.');
            alternativeStrategies.push('Strategy B: Read stack trace log lines first.');
            decision = 'Strategy B selected: Investigate log snippet files first.';
            confidence = 0.9;
            this.assumptionManager.addAssumption('Errors reside in recent active documents', 0.8);
        }
        else {
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
exports.ReasoningEngine = ReasoningEngine;
//# sourceMappingURL=reasoning-engine.js.map