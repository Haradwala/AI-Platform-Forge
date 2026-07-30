import type { ExecutionPolicy } from './execution-types';
export declare class ExecutionPolicyRegistry {
    private readonly readOnlyTools;
    private readonly dangerousTools;
    validate(policy: ExecutionPolicy, toolId: string, input: any, workspaceRoot: string | null): {
        allowed: boolean;
        reason?: string;
        action: 'execute' | 'mock' | 'confirm';
    };
}
