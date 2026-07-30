import type { IExecutionTask } from './execution-types';
import type { ExecutionPolicyRegistry } from './execution-policy-registry';
import type { IWorkspaceService, IDesktopLogger, IToolRegistry } from '../../container/service-interfaces';
export declare class TaskDispatcher {
    private readonly toolRegistry;
    private readonly policyRegistry;
    private readonly workspaceService;
    private readonly logger;
    constructor(toolRegistry: IToolRegistry, policyRegistry: ExecutionPolicyRegistry, workspaceService: IWorkspaceService, logger: IDesktopLogger);
    dispatch(task: IExecutionTask, abortSignal: AbortSignal, executionId: string): Promise<any>;
}
