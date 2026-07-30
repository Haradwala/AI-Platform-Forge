"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AiKernel = void 0;
class AiKernel {
    sessionService;
    providerRegistry;
    logger;
    toolExecutionEngine;
    orchestrator;
    constructor(sessionService, providerRegistry, logger, toolExecutionEngine, orchestrator) {
        this.sessionService = sessionService;
        this.providerRegistry = providerRegistry;
        this.logger = logger;
        this.toolExecutionEngine = toolExecutionEngine;
        this.orchestrator = orchestrator;
    }
    async executeTool(invocation, context) {
        if (!this.toolExecutionEngine) {
            throw new Error('ToolExecutionEngine is not attached to AiKernel.');
        }
        return this.toolExecutionEngine.executeTool(invocation, context);
    }
    async executeTask(request, onToken) {
        const session = this.sessionService.getActiveSession();
        if (!session) {
            throw new Error('No active AI session found.');
        }
        if (session.isStreaming) {
            throw new Error('An AI task execution stream is already in progress.');
        }
        const provider = this.providerRegistry.getById(session.activeProviderId);
        if (!provider) {
            throw new Error(`Provider "${session.activeProviderId}" is not registered.`);
        }
        session.isStreaming = true;
        session.abortController = new AbortController();
        try {
            const stream = await provider.generateStream(request.goal, request.context || {}, session.abortController.signal);
            return new Promise((resolve, reject) => {
                const onAbort = () => {
                    session.isStreaming = false;
                    session.abortController = null;
                    reject(new Error('AI stream generation aborted by user.'));
                };
                if (session.abortController?.signal.aborted) {
                    onAbort();
                    return;
                }
                session.abortController?.signal.addEventListener('abort', onAbort);
                let fullResponse = '';
                stream.onToken((token) => {
                    fullResponse += token;
                    onToken(token);
                });
                stream.onComplete((fullText) => {
                    session.abortController?.signal.removeEventListener('abort', onAbort);
                    session.isStreaming = false;
                    session.abortController = null;
                    resolve(fullText);
                });
                stream.onError((err) => {
                    session.abortController?.signal.removeEventListener('abort', onAbort);
                    session.isStreaming = false;
                    session.abortController = null;
                    reject(err);
                });
            });
        }
        catch (err) {
            session.isStreaming = false;
            session.abortController = null;
            throw err;
        }
    }
    cancelActiveTask() {
        const session = this.sessionService.getActiveSession();
        if (session && session.abortController) {
            session.abortController.abort();
            this.logger.info('[AiKernel] Active task execution cancelled.');
        }
    }
}
exports.AiKernel = AiKernel;
//# sourceMappingURL=ai-kernel.js.map