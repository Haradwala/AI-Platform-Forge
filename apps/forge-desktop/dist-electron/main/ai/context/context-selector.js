"use strict";
/**
 * context-selector.ts
 *
 * Ranks, scores, and deduplicates raw context items according to relevance signals:
 *  - Semantic relevance (keyword overlap with user goal)
 *  - File proximity (same directory or import graph connection)
 *  - Imports & Symbols
 *  - Recency
 *  - Diagnostics priority
 *  - User focus (active file / selection)
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContextSelector = void 0;
class ContextSelector {
    selectAndRank(items, options) {
        const scoredMap = new Map();
        const goalKeywords = this.extractKeywords(options.userGoal);
        const activeFolder = options.activeFilePath && options.activeFilePath.includes('/')
            ? options.activeFilePath.substring(0, options.activeFilePath.lastIndexOf('/'))
            : '';
        const activeImports = (options.indexer && options.activeFilePath)
            ? options.indexer.getImports(options.activeFilePath)
            : [];
        for (const item of items) {
            let score = 0;
            const rankReasons = [];
            // 1. User goal & active editor baseline priority
            if (item.source === 'user_goal') {
                score += 100;
                rankReasons.push('User Goal baseline');
            }
            if (item.source === 'active_editor' || (item.path && item.path === options.activeFilePath)) {
                score += 80;
                rankReasons.push('Active Editor file');
            }
            // 2. Diagnostics priority
            if (item.source === 'diagnostics') {
                score += 70;
                rankReasons.push('Diagnostic error priority');
            }
            // 3. File Proximity (same folder as active file)
            if (activeFolder && item.path && item.path.startsWith(activeFolder)) {
                score += 30;
                rankReasons.push('File proximity to active editor');
            }
            // 4. Import graph connection
            if (activeImports.length > 0 && item.path && activeImports.some((imp) => item.path?.includes(imp))) {
                score += 40;
                rankReasons.push('Imported by active file');
            }
            // 5. Semantic keyword overlap
            if (goalKeywords.length > 0 && item.content) {
                const itemLower = item.content.toLowerCase();
                let matches = 0;
                for (const kw of goalKeywords) {
                    if (itemLower.includes(kw))
                        matches++;
                }
                if (matches > 0) {
                    const semanticScore = matches * 15;
                    score += semanticScore;
                    rankReasons.push(`Semantic keyword match (+${semanticScore})`);
                }
            }
            // 6. Recency boost
            if (item.recency) {
                const ageSec = Math.max(0, (Date.now() - item.recency) / 1000);
                if (ageSec < 60) {
                    score += 20;
                    rankReasons.push('Recent activity');
                }
            }
            // Deduplication key per source and path/id
            const dedupKey = `${item.source}:${item.path || item.id}`;
            const scoredItem = {
                ...item,
                score,
                rankReasons,
            };
            const existing = scoredMap.get(dedupKey);
            if (!existing || scoredItem.score > existing.score) {
                scoredMap.set(dedupKey, scoredItem);
            }
        }
        // Sort descending by score
        return Array.from(scoredMap.values()).sort((a, b) => b.score - a.score);
    }
    extractKeywords(text) {
        if (!text)
            return [];
        return text
            .toLowerCase()
            .replace(/[^a-z0-9_\-\.\/]/g, ' ')
            .split(/\s+/)
            .filter((w) => w.length > 2);
    }
}
exports.ContextSelector = ContextSelector;
//# sourceMappingURL=context-selector.js.map