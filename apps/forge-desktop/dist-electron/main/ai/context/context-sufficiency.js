"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContextSufficiencyChecker = void 0;
class ContextSufficiencyChecker {
    checkSufficiency(contextPackage, goalDescription) {
        const missingDetails = [];
        const suggestedQueries = [];
        const cleanGoal = goalDescription.toLowerCase();
        // Verify workspace stats or indexing is present
        const hasStats = contextPackage.items.some((item) => item.source === 'repository' && item.content.includes('statistics'));
        if (!hasStats && (cleanGoal.includes('refactor') || cleanGoal.includes('architect'))) {
            missingDetails.push('Missing Repository Index Statistics.');
            suggestedQueries.push('Find all symbols in project.');
        }
        // Verify active file content is present if editing/explaining
        const hasActiveFile = contextPackage.items.some((item) => item.source === 'editor' && item.content.includes('Active File'));
        if (!hasActiveFile && (cleanGoal.includes('fix') || cleanGoal.includes('explain') || cleanGoal.includes('modify'))) {
            missingDetails.push('Missing Active Editor Context.');
            suggestedQueries.push('Inspect open files details.');
        }
        return {
            sufficient: missingDetails.length === 0,
            missingDetails,
            suggestedQueries,
        };
    }
}
exports.ContextSufficiencyChecker = ContextSufficiencyChecker;
//# sourceMappingURL=context-sufficiency.js.map