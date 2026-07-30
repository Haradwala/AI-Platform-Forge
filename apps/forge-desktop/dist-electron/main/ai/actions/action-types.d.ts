/**
 * action-types.ts — Phase 29 Engineering Action System Shared Contracts
 *
 * Core interfaces for Action Definitions, Action Requests, Action Results,
 * Action Providers, Middleware, Permissions, and Lifecycle Events.
 */
export type ActionCategory = 'filesystem' | 'terminal' | 'git' | 'ui' | 'runtime' | 'plugin';
export type ActionPermissionLevel = 'safe' | 'read' | 'write' | 'dangerous' | 'critical';
export type ActionLifecycleState = 'REQUESTED' | 'VALIDATED' | 'STARTED' | 'COMPLETED' | 'FAILED' | 'CANCELLED';
export interface ActionMetadata {
    id: string;
    name: string;
    category: ActionCategory;
    permission: ActionPermissionLevel;
    approvalRequired: boolean;
    undoable: boolean;
    replayable: boolean;
    description: string;
    inputSchema?: any;
}
export interface ActionRequest {
    id: string;
    actionId: string;
    runtimeId: string;
    workspaceRoot: string;
    params: any;
    context?: any;
    timestamp: number;
}
export interface ActionResult {
    actionId: string;
    status: 'COMPLETED' | 'FAILED' | 'CANCELLED';
    durationMs: number;
    data?: any;
    artifacts?: string[];
    diagnostics?: string[];
    logs?: string[];
    undoData?: any;
    metrics?: Record<string, number>;
    error?: string;
}
export interface ActionLifecycleEvent {
    id: string;
    actionId: string;
    runtimeId: string;
    state: ActionLifecycleState;
    timestamp: number;
    request?: ActionRequest;
    result?: ActionResult;
    error?: string;
}
export interface IAction {
    readonly metadata: ActionMetadata;
    execute(req: ActionRequest): Promise<ActionResult>;
    validate?(params: any): Promise<boolean>;
}
export interface IActionProvider {
    readonly id: string;
    readonly name: string;
    getActions(): IAction[];
}
export interface IActionMiddleware {
    readonly name: string;
    execute(req: ActionRequest, next: () => Promise<ActionResult>): Promise<ActionResult>;
}
