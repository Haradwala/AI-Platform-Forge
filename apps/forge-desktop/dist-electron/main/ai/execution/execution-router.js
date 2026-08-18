"use strict";
/**
 * execution-router.ts — Semantic Goal Router & Execution Sources
 *
 * Routes semantic ExecutionGoal intents across execution sources (MemoryExecutionSource, WorkspaceExecutionSource).
 * MemoryExecutionSource queries session.entities (IEntityStore) directly without prompt parsing.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExecutionRouter = exports.WorkspaceExecutionSource = exports.MemoryExecutionSource = exports.ExecutionResultKind = exports.ExecutionGoal = void 0;
const execution_goal_1 = require("../contracts/execution-goal");
const execution_result_kind_1 = require("../contracts/execution-result-kind");
const execution_entity_extractor_1 = require("../memory/extraction/execution-entity-extractor");
var execution_goal_2 = require("../contracts/execution-goal");
Object.defineProperty(exports, "ExecutionGoal", { enumerable: true, get: function () { return execution_goal_2.ExecutionGoal; } });
var execution_result_kind_2 = require("../contracts/execution-result-kind");
Object.defineProperty(exports, "ExecutionResultKind", { enumerable: true, get: function () { return execution_result_kind_2.ExecutionResultKind; } });
class MemoryExecutionSource {
    extractor;
    id = 'memory_execution_source';
    priority = 1;
    constructor(extractor = new execution_entity_extractor_1.ExecutionEntityExtractor()) {
        this.extractor = extractor;
    }
    canResolve(goal, session) {
        if (!session)
            return false;
        // Check entity store first
        if (session.entities) {
            if (goal === execution_goal_1.ExecutionGoal.WORKSPACE_STATISTICS) {
                return !!session.entities.getLatest(execution_result_kind_1.ExecutionResultKind.WORKSPACE_STATS);
            }
            if (goal === execution_goal_1.ExecutionGoal.FILE_LIST) {
                return !!session.entities.getLatest(execution_result_kind_1.ExecutionResultKind.FILE_LIST);
            }
            if (goal === execution_goal_1.ExecutionGoal.FILE_CONTENT) {
                return !!session.entities.getLatest(execution_result_kind_1.ExecutionResultKind.FILE_CONTENT);
            }
        }
        // Fallback to event timeline extraction
        const events = session.execution?.getEvents();
        if (!events || events.length === 0)
            return false;
        if (goal === execution_goal_1.ExecutionGoal.WORKSPACE_STATISTICS) {
            return !!this.extractor.getLatestEntity(events, 'file_count');
        }
        if (goal === execution_goal_1.ExecutionGoal.FILE_LIST) {
            return !!this.extractor.getLatestEntity(events, 'file_list');
        }
        return false;
    }
    async resolve(goal, session) {
        if (!session)
            return null;
        // 1. WORKSPACE_STATISTICS Goal
        if (goal === execution_goal_1.ExecutionGoal.WORKSPACE_STATISTICS) {
            const statsEntity = session.entities?.getLatest(execution_result_kind_1.ExecutionResultKind.WORKSPACE_STATS) ||
                this.extractor.getLatestEntity(session.execution.getEvents(), 'file_count');
            if (statsEntity && typeof statsEntity.value === 'number') {
                return {
                    success: true,
                    data: statsEntity.value,
                    formattedResponse: `There were ${statsEntity.value} files recorded in workspace memory.`,
                    source: 'memory',
                };
            }
        }
        // 2. FILE_LIST Goal
        if (goal === execution_goal_1.ExecutionGoal.FILE_LIST) {
            const listEntity = session.entities?.getLatest(execution_result_kind_1.ExecutionResultKind.FILE_LIST) ||
                this.extractor.getLatestEntity(session.execution.getEvents(), 'file_list');
            if (listEntity && Array.isArray(listEntity.value)) {
                const items = listEntity.value;
                const total = items.length;
                const displayLimit = 100;
                const slice = items.slice(0, displayLimit);
                let formatted = `Project Files Memory (${total} total files):\n` + slice.map((f) => `- ${f}`).join('\n');
                if (total > displayLimit) {
                    formatted += `\n\n... and ${total - displayLimit} more files.`;
                }
                return {
                    success: true,
                    data: items,
                    formattedResponse: formatted,
                    source: 'memory',
                };
            }
        }
        return null;
    }
}
exports.MemoryExecutionSource = MemoryExecutionSource;
class WorkspaceExecutionSource {
    id = 'workspace_execution_source';
    priority = 10;
    canResolve() {
        return true; // Fallback workspace tool executor
    }
    async resolve() {
        return null; // Signals orchestrator to execute standard pipeline plan via ExecutionEngine
    }
}
exports.WorkspaceExecutionSource = WorkspaceExecutionSource;
class ExecutionRouter {
    sources = [];
    registerSource(source) {
        this.sources.push(source);
        this.sources.sort((a, b) => a.priority - b.priority);
    }
    async resolveGoal(goal, session) {
        for (const src of this.sources) {
            if (src.canResolve(goal, session)) {
                const result = await src.resolve(goal, session);
                if (result)
                    return result;
            }
        }
        return null;
    }
}
exports.ExecutionRouter = ExecutionRouter;
//# sourceMappingURL=execution-router.js.map