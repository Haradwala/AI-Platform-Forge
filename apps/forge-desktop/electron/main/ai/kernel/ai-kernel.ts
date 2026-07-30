import type {
  IAiKernel,
  IAiTaskRequest,
  IAiSessionService,
  IProviderRegistry,
  IDesktopLogger,
  IToolExecutionEngine,
  IExecutionOrchestrator,
  ToolInvocation,
  ExecutionContext,
  ToolResult,
} from '../../container/service-interfaces';

export class AiKernel implements IAiKernel {
  constructor(
    private readonly sessionService: IAiSessionService,
    private readonly providerRegistry: IProviderRegistry,
    private readonly logger: IDesktopLogger,
    private readonly toolExecutionEngine?: IToolExecutionEngine,
    private readonly orchestrator?: IExecutionOrchestrator
  ) {}

  async executeTool<TInput = any, TOutput = any>(
    invocation: ToolInvocation,
    context?: ExecutionContext
  ): Promise<ToolResult<TOutput>> {
    if (!this.toolExecutionEngine) {
      throw new Error('ToolExecutionEngine is not attached to AiKernel.');
    }
    return this.toolExecutionEngine.executeTool<TInput, TOutput>(invocation, context);
  }

  async executeTask(request: IAiTaskRequest, onToken: (token: string) => void): Promise<string> {
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
      const stream = await provider.generateStream(
        request.goal,
        request.context || {},
        session.abortController.signal
      );

      return new Promise<string>((resolve, reject) => {
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
    } catch (err: any) {
      session.isStreaming = false;
      session.abortController = null;
      throw err;
    }
  }

  cancelActiveTask(): void {
    const session = this.sessionService.getActiveSession();
    if (session && session.abortController) {
      session.abortController.abort();
      this.logger.info('[AiKernel] Active task execution cancelled.');
    }
  }
}
