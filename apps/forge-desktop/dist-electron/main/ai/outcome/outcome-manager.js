"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.OutcomeManager = void 0;
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
class OutcomeManager {
    experienceBuilder;
    decisionLog;
    eventBus;
    logger;
    constructor(experienceBuilder, decisionLog, eventBus, logger) {
        this.experienceBuilder = experienceBuilder;
        this.decisionLog = decisionLog;
        this.eventBus = eventBus;
        this.logger = logger;
    }
    async processOutcome(plan, verification, recovery, reflection) {
        this.logger.info('[OutcomeManager] Bundling immutable execution outcome...');
        const outcome = {
            success: verification.success,
            planId: plan.id,
            goal: plan.goal,
            verification,
            recovery,
            reflection,
            timestamp: new Date().toISOString(),
        };
        if (recovery) {
            for (const attempt of recovery.attempts) {
                this.decisionLog.logDecision(attempt.strategyId, attempt.success ? 'Successful recovery verification' : 'Failed recovery execution attempt', 80, []);
            }
        }
        const workspaceRoot = '.';
        this.decisionLog.saveDecisionLog(workspaceRoot);
        const experience = this.experienceBuilder.buildExperience(outcome);
        this.saveExperience(experience, workspaceRoot);
        this.eventBus.emit('startup:stage-changed', { stage: 'outcome:created' });
        return outcome;
    }
    saveExperience(experience, workspaceRoot) {
        if (!workspaceRoot)
            return;
        const outcomeDir = path.join(workspaceRoot, '.forge', 'outcome');
        if (!fs.existsSync(outcomeDir)) {
            fs.mkdirSync(outcomeDir, { recursive: true });
        }
        fs.writeFileSync(path.join(outcomeDir, 'experience.json'), JSON.stringify(experience, null, 2), 'utf8');
    }
}
exports.OutcomeManager = OutcomeManager;
//# sourceMappingURL=outcome-manager.js.map