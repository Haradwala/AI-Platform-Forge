"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExperienceBuilder = void 0;
class ExperienceBuilder {
    buildExperience(outcome) {
        const failuresCount = outcome.recovery?.attempts.length || 0;
        return {
            version: '1.0.0',
            schemaVersion: '1.0.0',
            id: outcome.planId,
            goal: outcome.goal,
            success: outcome.success,
            executionTimeMs: outcome.verification.durationMs + (outcome.recovery?.durationMs || 0),
            tokensUsedCount: 120,
            failuresCount,
            decisionReasons: [],
            recommendations: outcome.reflection.recommendations,
        };
    }
}
exports.ExperienceBuilder = ExperienceBuilder;
//# sourceMappingURL=experience-builder.js.map