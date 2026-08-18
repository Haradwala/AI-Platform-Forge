"use strict";
/**
 * structured-conversation-state.ts
 *
 * Explicit Structured Conversation State — Single source of truth for planning
 * and follow-up actions across multi-turn sessions.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.StructuredConversationStateBuilder = void 0;
const execution_result_kind_1 = require("../contracts/execution-result-kind");
class StructuredConversationStateBuilder {
    static build(sessionId, entities, conversation, selectionContext = null) {
        const messages = conversation.getMessages();
        const turnCount = messages.length;
        const workspaceStats = entities.getLatest(execution_result_kind_1.ExecutionResultKind.WORKSPACE_STATS);
        const fileList = entities.getLatest(execution_result_kind_1.ExecutionResultKind.FILE_LIST);
        const fileContent = entities.getLatest(execution_result_kind_1.ExecutionResultKind.FILE_CONTENT);
        const searchResults = entities.getLatest(execution_result_kind_1.ExecutionResultKind.SEARCH_RESULTS);
        const terminalOutput = entities.getLatest(execution_result_kind_1.ExecutionResultKind.TERMINAL_OUTPUT);
        const errorTrace = entities.getLatest(execution_result_kind_1.ExecutionResultKind.ERROR_TRACE);
        let activeDocument = null;
        if (fileContent) {
            const path = fileContent.key && fileContent.key !== 'file'
                ? fileContent.key
                : fileContent.value?.filePath;
            if (path && typeof path === 'string' && !path.includes('\n') && !path.startsWith('{')) {
                activeDocument = { filePath: path };
            }
        }
        let lastSearchResult = null;
        if (searchResults) {
            const items = Array.isArray(searchResults.value) ? searchResults.value : [];
            lastSearchResult = {
                query: searchResults.key || '',
                results: items.map((it) => (typeof it === 'string' ? { filePath: it } : { filePath: it.filePath || it.file || '', line: it.line, text: it.text })),
            };
        }
        let lastTerminalOutput = null;
        if (terminalOutput) {
            lastTerminalOutput = {
                command: terminalOutput.key || 'terminal',
                stdout: typeof terminalOutput.value === 'string' ? terminalOutput.value : JSON.stringify(terminalOutput.value),
            };
        }
        const allEntities = entities.getAll();
        const lastEntity = allEntities.length > 0 ? allEntities[allEntities.length - 1] : null;
        const lastActionKind = lastEntity ? lastEntity.kind : null;
        return {
            sessionId,
            turnCount,
            activeDocument,
            lastSearchResult,
            lastTerminalOutput,
            selectionContext,
            activeEntities: {
                workspaceStats,
                fileList,
                fileContent,
                searchResults,
                terminalOutput,
                errorTrace,
            },
            lastActionKind,
        };
    }
}
exports.StructuredConversationStateBuilder = StructuredConversationStateBuilder;
//# sourceMappingURL=structured-conversation-state.js.map