import type { IExecutionContext, IExecutionBudget } from './execution-types';
import type { IDesktopLogger } from '../../container/service-interfaces';

export class ExecutionContextFactory {
  createContext(
    executionId: string,
    taskId: string,
    budget: IExecutionBudget,
    logger: IDesktopLogger,
    abortSignal: AbortSignal,
    rootPath: string | null
  ): IExecutionContext {
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
