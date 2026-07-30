/**
 * logger-middleware.ts — Phase 29 Action Telemetry & Logger Middleware
 */

import { ActionRequest, ActionResult, IActionMiddleware } from '../action-types';

export class LoggerMiddleware implements IActionMiddleware {
  readonly name = 'LoggerMiddleware';

  async execute(req: ActionRequest, next: () => Promise<ActionResult>): Promise<ActionResult> {
    const start = Date.now();
    try {
      const result = await next();
      const duration = Date.now() - start;
      if (!result.metrics) result.metrics = {};
      result.metrics.executionTimeMs = duration;
      return result;
    } catch (err: any) {
      const duration = Date.now() - start;
      return {
        actionId: req.actionId,
        status: 'FAILED',
        durationMs: duration,
        error: err.message,
      };
    }
  }
}
