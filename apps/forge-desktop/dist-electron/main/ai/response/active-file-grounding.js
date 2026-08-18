"use strict";
/**
 * active-file-grounding.ts
 *
 * Sprint 85 Wave 3 — Active File Grounding Service
 *
 * Detects follow-up questions when an editor tab is open (e.g. package.json)
 * and fetches the file content directly from IWorkspaceService so the response
 * engine can ground directly from the active file without needing broad workspace searches.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActiveFileGroundingService = void 0;
class ActiveFileGroundingService {
    workspaceService;
    logger;
    constructor(workspaceService, logger) {
        this.workspaceService = workspaceService;
        this.logger = logger;
    }
    /**
     * Determines if the user prompt is a content follow-up question for the active file.
     * If applicable, reads the file and returns a FileContentFact. Otherwise returns null.
     */
    async tryGround(activeFilePath, userPrompt) {
        if (!activeFilePath || !this.workspaceService) {
            return null;
        }
        const promptLower = (userPrompt || '').trim().toLowerCase();
        if (!promptLower)
            return null;
        // Action verbs / commands that shouldn't trigger active file grounding
        const actionPrefixes = ['open ', 'find ', 'delete ', 'rename ', 'create ', 'run ', 'git '];
        if (actionPrefixes.some((p) => promptLower.startsWith(p))) {
            return null;
        }
        // Keywords or phrases indicating follow-up or content question
        const contentKeywords = [
            'dependencies',
            'devdependencies',
            'scripts',
            'version',
            'author',
            'license',
            'exports',
            'imports',
            'functions',
            'methods',
            'classes',
            'what',
            'show',
            'describe',
            'explain',
            'which',
            'how',
            'list',
            'tell',
            'contents',
            'structure',
            'summary',
            'overview',
            'them',
            'those',
            'these',
            'it',
            'this file',
            'active file',
            'open file',
        ];
        const isContentQuestion = contentKeywords.some((kw) => promptLower.includes(kw)) ||
            promptLower.length <= 60; // short follow-ups
        if (!isContentQuestion) {
            return null;
        }
        try {
            const content = await this.workspaceService.readFile(activeFilePath);
            if (!content || !content.trim())
                return null;
            this.logger?.info(`[ActiveFileGroundingService] Grounded prompt "${userPrompt}" using active file "${activeFilePath}" (${content.length} chars)`);
            return {
                kind: 'file_content',
                path: activeFilePath,
                content,
            };
        }
        catch (err) {
            this.logger?.warn(`[ActiveFileGroundingService] Failed to read active file "${activeFilePath}": ${err?.message || err}`);
            return null;
        }
    }
}
exports.ActiveFileGroundingService = ActiveFileGroundingService;
//# sourceMappingURL=active-file-grounding.js.map