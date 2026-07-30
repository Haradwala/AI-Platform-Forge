"use strict";
/**
 * action-executor.ts — Phase 29 Engineering Action Executor
 *
 * Single execution API for all runtimes, orchestrating validation, middleware pipelines,
 * approval gating, execution, event broadcasting, and audit trail logging.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActionExecutor = void 0;
const action_registry_1 = require("./action-registry");
const action_validator_1 = require("./action-validator");
const action_events_1 = require("./action-events");
const action_history_1 = require("./action-history");
const action_middleware_1 = require("./middleware/action-middleware");
const logger_middleware_1 = require("./middleware/logger-middleware");
const permission_middleware_1 = require("./middleware/permission-middleware");
const approval_middleware_1 = require("./middleware/approval-middleware");
const audit_middleware_1 = require("./middleware/audit-middleware");
class ActionExecutor {
    registry;
    validator;
    events;
    history;
    approvalMiddleware;
    pipeline;
    constructor(registry, history, events, validator) {
        this.registry = registry || new action_registry_1.ActionRegistry();
        this.history = history || new action_history_1.ActionHistory();
        this.events = events || new action_events_1.ActionEventEmitter();
        this.validator = validator || new action_validator_1.ActionValidator();
        this.approvalMiddleware = new approval_middleware_1.ApprovalMiddleware();
        this.pipeline = new action_middleware_1.ActionMiddlewarePipeline();
        this.pipeline.use(new logger_middleware_1.LoggerMiddleware());
        this.pipeline.use(new permission_middleware_1.PermissionMiddleware());
        this.pipeline.use(this.approvalMiddleware);
        this.pipeline.use(new audit_middleware_1.AuditMiddleware((req, res) => this.history.recordAction(req, res)));
    }
    /**
     * Executes an ActionRequest through the full validation, middleware, and execution pipeline.
     */
    async executeAction(request) {
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
            const errRes = {
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
            const valErrRes = {
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
            if (!request.context)
                request.context = {};
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
exports.ActionExecutor = ActionExecutor;
//# sourceMappingURL=action-executor.js.map