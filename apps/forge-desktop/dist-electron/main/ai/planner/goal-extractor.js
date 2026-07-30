"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GoalExtractor = void 0;
class GoalExtractor {
    extractGoal(goalDescription, activeFilePath) {
        const cleanGoal = goalDescription.toLowerCase();
        const targetFiles = [];
        let scope = 'workspace';
        if (activeFilePath) {
            targetFiles.push(activeFilePath);
            scope = 'file';
        }
        // Match potential files in text
        const fileMatches = goalDescription.match(/[\w-]+\.(ts|tsx|js|jsx|json|py|go|rs)/g);
        if (fileMatches) {
            fileMatches.forEach((f) => {
                if (!targetFiles.includes(f)) {
                    targetFiles.push(f);
                }
            });
            if (targetFiles.length > 1) {
                scope = 'module';
            }
        }
        return {
            id: `goal_${Date.now()}`,
            description: goalDescription,
            scope,
            targetFiles,
        };
    }
}
exports.GoalExtractor = GoalExtractor;
//# sourceMappingURL=goal-extractor.js.map