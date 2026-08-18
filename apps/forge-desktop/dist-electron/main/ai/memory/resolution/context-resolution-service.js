"use strict";
/**
 * context-resolution-service.ts
 *
 * Context Resolution Service — resolves conversational references ("them", "these files",
 * "it", "that section", "the error", "how many") against the session's ExecutionDomain.
 * Returns a typed ResolvedContext object.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContextResolutionService = void 0;
const execution_entity_extractor_1 = require("../extraction/execution-entity-extractor");
const execution_result_kind_1 = require("../../contracts/execution-result-kind");
function extractTargetValue(entity) {
    if (!entity)
        return undefined;
    const list = Array.isArray(entity) ? entity : (Array.isArray(entity.value) ? entity.value : (Array.isArray(entity.results) ? entity.results : (Array.isArray(entity.files) ? entity.files : null)));
    if (list && list.length > 0) {
        const first = list[0];
        if (typeof first === 'string' && first !== 'search_results' && first !== 'file_list')
            return first;
        if (first && typeof first.filePath === 'string')
            return first.filePath;
        if (first && typeof first.file === 'string')
            return first.file;
    }
    if (typeof entity.filePath === 'string')
        return entity.filePath;
    if (typeof entity.path === 'string')
        return entity.path;
    if (typeof entity.key === 'string' && entity.key !== 'search_results' && entity.key !== 'file_list' && entity.key !== 'file_count' && entity.key !== 'file')
        return entity.key;
    if (typeof entity.value === 'string' && !entity.value.includes('\n') && !entity.value.startsWith('{') && !entity.value.startsWith('<'))
        return entity.value;
    return undefined;
}
const resolvers_1 = require("./resolvers");
class ContextResolutionService {
    chain;
    constructor(chain) {
        this.chain = chain || new resolvers_1.ResolverChain();
    }
    resolve(userPrompt, session) {
        const res = this.chain.resolve(userPrompt, session);
        // Fallback for terminal output / error trace references if not captured in chain
        let resolvedPrompt = res.resolvedPrompt;
        const entityBindings = [...res.entityBindings];
        let hasResolvedReferences = res.hasResolved;
        const promptLower = userPrompt.toLowerCase().trim();
        const events = session.execution ? session.execution.getEvents() : [];
        const extractor = new execution_entity_extractor_1.ExecutionEntityExtractor();
        if (/\b(what changed|the changes|git changes)\b/i.test(promptLower)) {
            const terminalEntity = session.entities?.getLatest(execution_result_kind_1.ExecutionResultKind.TERMINAL_OUTPUT) || extractor.getLatestEntity(events, 'terminal_output');
            if (terminalEntity) {
                entityBindings.push({
                    referenceTerm: 'what_changed',
                    category: 'terminal_output',
                    resolvedValue: terminalEntity.value,
                    turnId: terminalEntity.turnId || '',
                });
                resolvedPrompt = `${resolvedPrompt} (Referring to git/terminal execution output: "${String(terminalEntity.value || '').slice(0, 300)}")`;
                hasResolvedReferences = true;
            }
        }
        if (/\b(fix the error|the error|that error)\b/i.test(promptLower)) {
            const errorEntity = extractor.getLatestEntity(events, 'error_trace');
            if (errorEntity) {
                entityBindings.push({
                    referenceTerm: 'the error',
                    category: 'error_trace',
                    resolvedValue: errorEntity.value,
                    turnId: errorEntity.turnId,
                });
                resolvedPrompt = `${resolvedPrompt} (Target error payload: "${errorEntity.value}")`;
                hasResolvedReferences = true;
            }
        }
        if (/\b(how many were there|how many files were there|how many total)\b/i.test(promptLower)) {
            const statsEntity = session.entities?.getLatest(execution_result_kind_1.ExecutionResultKind.WORKSPACE_STATS) || extractor.getLatestEntity(events, 'workspace_stats');
            const val = statsEntity?.value?.filesCount ?? statsEntity?.value?.total ?? statsEntity?.value;
            if (val !== undefined) {
                entityBindings.push({
                    referenceTerm: 'how_many_were_there',
                    category: 'workspace_stats',
                    resolvedValue: val,
                    turnId: statsEntity?.turnId || '',
                });
                resolvedPrompt = `${resolvedPrompt} (Referring to previously recorded count: ${val})`;
                hasResolvedReferences = true;
            }
        }
        return {
            originalPrompt: userPrompt,
            resolvedPrompt,
            entityBindings,
            hasResolvedReferences,
            resolution: res.resolution,
        };
    }
}
exports.ContextResolutionService = ContextResolutionService;
//# sourceMappingURL=context-resolution-service.js.map