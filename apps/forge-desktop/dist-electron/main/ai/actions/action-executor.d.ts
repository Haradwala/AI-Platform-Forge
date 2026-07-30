/**
 * action-executor.ts — Phase 29 Engineering Action Executor
 *
 * Single execution API for all runtimes, orchestrating validation, middleware pipelines,
 * approval gating, execution, event broadcasting, and audit trail logging.
 */
import { ActionRequest, ActionResult } from './action-types';
import { ActionRegistry } from './action-registry';
import { ActionValidator } from './action-validator';
import { ActionEventEmitter } from './action-events';
import { ActionHistory } from './action-history';
import { ApprovalMiddleware } from './middleware/approval-middleware';
export declare class ActionExecutor {
    readonly registry: ActionRegistry;
    readonly validator: ActionValidator;
    readonly events: ActionEventEmitter;
    readonly history: ActionHistory;
    readonly approvalMiddleware: ApprovalMiddleware;
    private pipeline;
    constructor(registry?: ActionRegistry, history?: ActionHistory, events?: ActionEventEmitter, validator?: ActionValidator);
    /**
     * Executes an ActionRequest through the full validation, middleware, and execution pipeline.
     */
    executeAction(request: ActionRequest): Promise<ActionResult>;
}
