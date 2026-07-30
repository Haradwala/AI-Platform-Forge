"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExecutionContextFactory = void 0;
class ExecutionContextFactory {
    createContext(executionId, taskId, budget, logger, abortSignal, rootPath) {
        return {
            traceId: `${executionId}-${taskId}-trace`,
            spanId: `${taskId}-span`,
            executionId,
            conversationId: 'session-id',
            providerId: 'ollama-provider',
            budget,
            logger,
            abortSignal,
            featureFlags: {},
            rootPath,
            metadata: {},
        };
    }
}
exports.ExecutionContextFactory = ExecutionContextFactory;
//# sourceMappingURL=execution-context.js.map