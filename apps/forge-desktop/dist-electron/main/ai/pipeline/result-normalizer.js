"use strict";
/**
 * result-normalizer.ts — Tool Result Payload Normalizer
 *
 * Normalizes raw or legacy tool return objects into canonical payload shapes
 * before contract validation and entity extraction.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResultNormalizer = void 0;
const execution_result_kind_1 = require("../contracts/execution-result-kind");
class ResultNormalizer {
    /**
     * Normalizes an ExecutionResult envelope.
     */
    normalize(result) {
        if (!result || !result.payload || typeof result.payload !== 'object') {
            return result;
        }
        const payload = { ...result.payload };
        switch (result.kind) {
            case execution_result_kind_1.ExecutionResultKind.FILE_LIST: {
                // Normalize aliases: changedFiles, paths, items -> files
                if (!payload.files) {
                    payload.files = payload.changedFiles || payload.paths || payload.items || [];
                }
                if (Array.isArray(payload.files)) {
                    payload.files = payload.files
                        .map((f) => (typeof f === 'string' ? f : f?.filePath || f?.file || f?.name))
                        .filter((f) => typeof f === 'string' && f.trim() !== '' && f !== 'workspace');
                    payload.total = payload.total ?? payload.files.length;
                }
                break;
            }
            case execution_result_kind_1.ExecutionResultKind.SEARCH_RESULTS: {
                if (Array.isArray(payload.results)) {
                    payload.results = payload.results.filter((r) => r && typeof r.filePath === 'string' && r.filePath !== 'workspace');
                }
                break;
            }
            case execution_result_kind_1.ExecutionResultKind.WORKSPACE_STATS: {
                if (payload.stats && typeof payload.stats === 'object') {
                    payload.filesCount = payload.stats.filesCount ?? payload.filesCount ?? 0;
                    payload.symbolsCount = payload.stats.symbolsCount ?? payload.symbolsCount ?? 0;
                    payload.circularDependenciesCount = payload.stats.circularDependenciesCount ?? 0;
                    payload.languages = payload.stats.languages ?? [];
                    payload.projects = payload.stats.projects ?? [];
                }
                break;
            }
        }
        return {
            ...result,
            payload: payload,
        };
    }
}
exports.ResultNormalizer = ResultNormalizer;
//# sourceMappingURL=result-normalizer.js.map