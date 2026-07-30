"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IntentDetector = void 0;
class IntentDetector {
    detectIntent(goalDescription) {
        const cleanGoal = goalDescription.toLowerCase();
        let type = 'chat';
        let confidence = 0.8;
        if (cleanGoal.includes('debug') || cleanGoal.includes('error') || cleanGoal.includes('fix')) {
            type = 'debug';
            confidence = 0.95;
        }
        else if (cleanGoal.includes('refactor') || cleanGoal.includes('optimize')) {
            type = 'refactor';
            confidence = 0.9;
        }
        else if (cleanGoal.includes('review') || cleanGoal.includes('inspect')) {
            type = 'review';
            confidence = 0.85;
        }
        else if (cleanGoal.includes('generate') || cleanGoal.includes('create') || cleanGoal.includes('add')) {
            type = 'generate';
            confidence = 0.92;
        }
        else if (cleanGoal.includes('execute') || cleanGoal.includes('run')) {
            type = 'execute';
            confidence = 0.9;
        }
        else if (cleanGoal.includes('plan') || cleanGoal.includes('milestone')) {
            type = 'plan';
            confidence = 0.95;
        }
        return {
            id: `intent_${Date.now()}`,
            confidence,
            type,
        };
    }
}
exports.IntentDetector = IntentDetector;
//# sourceMappingURL=intent-detector.js.map