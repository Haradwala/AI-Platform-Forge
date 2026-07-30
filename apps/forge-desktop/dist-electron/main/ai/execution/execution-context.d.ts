import type { IExecutionContext, IExecutionBudget } from './execution-types';
import type { IDesktopLogger } from '../../container/service-interfaces';
export declare class ExecutionContextFactory {
    createContext(executionId: string, taskId: string, budget: IExecutionBudget, logger: IDesktopLogger, abortSignal: AbortSignal, rootPath: string | null): IExecutionContext;
}
