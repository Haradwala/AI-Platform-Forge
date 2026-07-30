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
import { ActionMiddlewarePipeline } from './middleware/action-middleware';
import { LoggerMiddleware } from './middleware/logger-middleware';
import { PermissionMiddleware } from './middleware/permission-middleware';
import { ApprovalMiddleware } from './middleware/approval-middleware';
import { AuditMiddleware } from './middleware/audit-middleware';

export class ActionExecutor {
  public readonly registry: ActionRegistry;
  public readonly validator: ActionValidator;
  public readonly events: ActionEventEmitter;
  public readonly history: ActionHistory;
  public readonly approvalMiddleware: ApprovalMiddleware;
  private pipeline: ActionMiddlewarePipeline;

  constructor(
    registry?: ActionRegistry,
    history?: ActionHistory,
    events?: ActionEventEmitter,
    validator?: ActionValidator
  ) {
    this.registry = registry || new ActionRegistry();
    this.history = history || new ActionHistory();
    this.events = events || new ActionEventEmitter();
    this.validator = validator || new ActionValidator();
    this.approvalMiddleware = new ApprovalMiddleware();

    this.pipeline = new ActionMiddlewarePipeline();
    this.pipeline.use(new LoggerMiddleware());
    this.pipeline.use(new PermissionMiddleware());
    this.pipeline.use(this.approvalMiddleware);
    this.pipeline.use(new AuditMiddleware((req, res) => this.history.recordAction(req, res)));
  }

  /**
   * Executes an ActionRequest through the full validation, middleware, and execution pipeline.
   */
  async executeAction(request: ActionRequest): Promise<ActionResult> {
    // 1. Emit REQUESTED event
    this.events.emit({
      id: request.id,
      actionId: request.actionId,
      runtimeId: request.runtimeId,
      state: 'REQUESTED',
      timestamp: Date.now(),
      request,
    });

    // 2. Check Action Existence
    const action = this.registry.getAction(request.actionId);
    if (!action) {
      const errRes: ActionResult = {
        actionId: request.actionId,
        status: 'FAILED',
        durationMs: 0,
        error: `Action "${request.actionId}" is not registered in ActionRegistry.`,
      };
      this.events.emit({
        id: request.id,
        actionId: request.actionId,
        runtimeId: request.runtimeId,
        state: 'FAILED',
        timestamp: Date.now(),
        request,
        result: errRes,
        error: errRes.error,
      });
      return errRes;
    }

    // 3. Validation Pipeline
    const validation = await this.validator.validate(action, request);
    if (!validation.valid) {
      const valErrRes: ActionResult = {
        actionId: request.actionId,
        status: 'FAILED',
        durationMs: 0,
        error: `Action validation failed: ${validation.errors.join('; ')}`,
      };
      this.events.emit({
        id: request.id,
        actionId: request.actionId,
        runtimeId: request.runtimeId,
        state: 'FAILED',
        timestamp: Date.now(),
        request,
        result: valErrRes,
        error: valErrRes.error,
      });
      return valErrRes;
    }

    this.events.emit({
      id: request.id,
      actionId: request.actionId,
      runtimeId: request.runtimeId,
      state: 'VALIDATED',
      timestamp: Date.now(),
      request,
    });

    // Automatically flag approval if action metadata requires approval
    if (action.metadata.approvalRequired && !request.context?.requiresApproval) {
      if (!request.context) request.context = {};
      request.context.requiresApproval = true;
    }

    // 4. Emit STARTED event
    this.events.emit({
      id: request.id,
      actionId: request.actionId,
      runtimeId: request.runtimeId,
      state: 'STARTED',
      timestamp: Date.now(),
      request,
    });

    // 5. Execute through Middleware Pipeline
    const start = Date.now();
    const result = await this.pipeline.run(request, async () => {
      return await action.execute(request);
    });

    if (!result.durationMs) {
      result.durationMs = Date.now() - start;
    }

    // 6. Emit COMPLETED/FAILED/CANCELLED event
    const finalState = result.status === 'COMPLETED' ? 'COMPLETED' : result.status === 'CANCELLED' ? 'CANCELLED' : 'FAILED';
    this.events.emit({
      id: request.id,
      actionId: request.actionId,
      runtimeId: request.runtimeId,
      state: finalState,
      timestamp: Date.now(),
      request,
      result,
      error: result.error,
    });

    return result;
  }
}
