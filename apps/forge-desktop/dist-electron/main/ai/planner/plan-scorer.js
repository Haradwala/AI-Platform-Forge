"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlanScorer = void 0;
class PlanScorer {
    scorePlan(graph) {
        let costEstimate = 0;
        let highRiskCount = 0;
        graph.nodes.forEach((node) => {
            // Base token cost estimate per tool type
            if (node.toolId === 'write_file')
                costEstimate += 1000;
            else if (node.toolId === 'read_file')
                costEstimate += 500;
            else
                costEstimate += 100;
            if (node.risk === 'high') {
                highRiskCount++;
            }
        });
        let riskFactor = 'low';
        if (highRiskCount > 0)
            riskFactor = 'high';
        else if (graph.nodes.some((n) => n.risk === 'medium'))
            riskFactor = 'medium';
        // Calculate score (lower cost + lower risk = higher score)
        let score = 100 - Math.min(costEstimate / 100, 40);
        if (riskFactor === 'high')
            score -= 30;
        else if (riskFactor === 'medium')
            score -= 15;
        return {
            costEstimate,
            riskFactor,
            score: Math.max(score, 10),
        };
    }
}
exports.PlanScorer = PlanScorer;
//# sourceMappingURL=plan-scorer.js.map