"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContextRankingService = void 0;
class ContextRankingService {
    rankItems(items, activeFile) {
        return items.map((item) => {
            let score = item.score;
            if (activeFile && item.content.includes(activeFile)) {
                score += 20;
            }
            return { ...item, score };
        }).sort((a, b) => b.score - a.score);
    }
}
exports.ContextRankingService = ContextRankingService;
//# sourceMappingURL=context-ranking-service.js.map