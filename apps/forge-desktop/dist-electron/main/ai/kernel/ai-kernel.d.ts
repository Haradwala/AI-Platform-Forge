import type { IAiKernel, IAiTaskRequest, IAiSessionService, IProviderRegistry, IDesktopLogger, IToolExecutionEngine, IExecutionOrchestrator, ToolInvocation, ExecutionContext, ToolResult } from '../../container/service-interfaces';
export declare class AiKernel implements IAiKernel {
    private readonly sessionService;
    private readonly providerRegistry;
    private readonly logger;
    private readonly toolExecutionEngine?;
    private readonly orchestrator?;
    constructor(sessionService: IAiSessionService, providerRegistry: IProviderRegistry, logger: IDesktopLogger, toolExecutionEngine?: IToolExecutionEngine | undefined, orchestrator?: IExecutionOrchestrator | undefined);
    executeTool<TInput = any, TOutput = any>(invocation: ToolInvocation, context?: ExecutionContext): Promise<ToolResult<TOutput>>;
    executeTask(request: IAiTaskRequest, onToken: (token: string) => void): Promise<string>;
    cancelActiveTask(): void;
}
