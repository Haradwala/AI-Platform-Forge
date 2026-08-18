"use strict";
/**
 * execution-entity-extractor.ts
 *
 * Execution Entity Extractor — extracts domain entities using payload.kind discriminator.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExecutionEntityExtractor = void 0;
const execution_result_kind_1 = require("../../contracts/execution-result-kind");
class ExecutionEntityExtractor {
    /**
     * Extracts typed entities from an array of ExecutionEvent items using payload.kind discriminator.
     */
    extractEntities(events) {
        const entities = [];
        for (const evt of events) {
            if (!evt.payload || typeof evt.payload !== 'object')
                continue;
            const payload = evt.payload;
            const kind = payload.kind || execution_result_kind_1.ExecutionResultKind.UNKNOWN;
            switch (evt.type) {
                case 'tool_completed': {
                    const inner = (payload.payload ?? payload);
                    // 1. FILE_LIST Kind
                    if (kind === execution_result_kind_1.ExecutionResultKind.FILE_LIST || (Array.isArray(inner.files) && !inner.stats)) {
                        const rawFiles = inner.files || (Array.isArray(inner.results) ? inner.results : []);
                        const filePaths = rawFiles
                            .map((i) => (typeof i === 'string' ? i : i?.filePath || i?.file || i?.name))
                            .filter((f) => typeof f === 'string' && f.trim() !== '' && f !== 'workspace');
                        if (filePaths.length > 0) {
                            entities.push({
                                entityId: `ent_file_list_${evt.id}`,
                                category: 'file_list',
                                kind: execution_result_kind_1.ExecutionResultKind.FILE_LIST,
                                key: 'file_list',
                                value: filePaths,
                                turnId: evt.turnId,
                                timestamp: evt.timestamp,
                            });
                        }
                    }
                    // 2. WORKSPACE_STATS Kind
                    if (kind === execution_result_kind_1.ExecutionResultKind.WORKSPACE_STATS || inner.stats?.filesCount !== undefined || inner.filesCount !== undefined) {
                        const filesCount = inner.filesCount ?? inner.stats?.filesCount ?? 0;
                        entities.push({
                            entityId: `ent_file_count_${evt.id}`,
                            category: 'file_count',
                            kind: execution_result_kind_1.ExecutionResultKind.WORKSPACE_STATS,
                            key: 'file_count',
                            value: filesCount,
                            turnId: evt.turnId,
                            timestamp: evt.timestamp,
                        });
                    }
                    // 3. SEARCH_RESULTS Kind
                    if (kind === execution_result_kind_1.ExecutionResultKind.SEARCH_RESULTS || (Array.isArray(inner.results) && kind !== execution_result_kind_1.ExecutionResultKind.WORKSPACE_STATS)) {
                        const cleanResults = (inner.results || []).filter((r) => r && r.filePath !== 'workspace');
                        if (cleanResults.length > 0) {
                            entities.push({
                                entityId: `ent_search_results_${evt.id}`,
                                category: 'search_results',
                                kind: execution_result_kind_1.ExecutionResultKind.SEARCH_RESULTS,
                                key: 'search_results',
                                value: cleanResults,
                                turnId: evt.turnId,
                                timestamp: evt.timestamp,
                            });
                        }
                    }
                    // 4. FILE_CONTENT Kind
                    if (kind === execution_result_kind_1.ExecutionResultKind.FILE_CONTENT || (typeof inner.content === 'string' && typeof inner.filePath === 'string')) {
                        entities.push({
                            entityId: `ent_file_content_${evt.id}`,
                            category: 'file_content',
                            kind: execution_result_kind_1.ExecutionResultKind.FILE_CONTENT,
                            key: inner.filePath || 'file',
                            value: inner.content || inner,
                            turnId: evt.turnId,
                            timestamp: evt.timestamp,
                        });
                    }
                    // 5. TERMINAL_OUTPUT Kind
                    if (kind === execution_result_kind_1.ExecutionResultKind.TERMINAL_OUTPUT || typeof inner.stdout === 'string' || typeof inner.output === 'string') {
                        entities.push({
                            entityId: `ent_terminal_${evt.id}`,
                            category: 'terminal_output',
                            kind: execution_result_kind_1.ExecutionResultKind.TERMINAL_OUTPUT,
                            key: inner.command || 'terminal',
                            value: inner.stdout || inner.output || inner.command || 'terminal',
                            turnId: evt.turnId,
                            timestamp: evt.timestamp,
                        });
                    }
                    break;
                }
                case 'tool_failed': {
                    const errorMsg = payload.error || payload.message || 'Tool execution failed';
                    entities.push({
                        entityId: `ent_error_${evt.id}`,
                        category: 'error_trace',
                        kind: execution_result_kind_1.ExecutionResultKind.ERROR_TRACE,
                        key: evt.toolId,
                        value: errorMsg,
                        turnId: evt.turnId,
                        timestamp: evt.timestamp,
                    });
                    break;
                }
                case 'file_modified': {
                    if (typeof payload.filePath === 'string') {
                        entities.push({
                            entityId: `ent_mutation_${evt.id}`,
                            category: 'file_mutation',
                            kind: execution_result_kind_1.ExecutionResultKind.FILE_CONTENT,
                            key: payload.filePath,
                            value: payload.mutationType || 'modified',
                            turnId: evt.turnId,
                            timestamp: evt.timestamp,
                        });
                    }
                    break;
                }
            }
        }
        return entities;
    }
    getLatestEntity(events, category) {
        const all = this.extractEntities(events);
        for (let i = all.length - 1; i >= 0; i--) {
            if (all[i].category === category) {
                return all[i];
            }
        }
        return undefined;
    }
}
exports.ExecutionEntityExtractor = ExecutionEntityExtractor;
//# sourceMappingURL=execution-entity-extractor.js.map