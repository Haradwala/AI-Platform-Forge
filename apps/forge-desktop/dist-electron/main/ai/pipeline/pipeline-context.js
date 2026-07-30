"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PipelineContextHelper = void 0;
class PipelineContextHelper {
    static create(id, prompt, workspaceRoot) {
        return {
            id,
            prompt,
            workspaceRoot,
            timestamp: new Date().toISOString(),
            timeline: [],
        };
    }
    static cloneWith(context, updates) {
        return {
            ...context,
            ...updates,
        };
    }
    static addTimeline(context, entry) {
        return {
            ...context,
            timeline: [...context.timeline, entry],
        };
    }
}
exports.PipelineContextHelper = PipelineContextHelper;
//# sourceMappingURL=pipeline-context.js.map