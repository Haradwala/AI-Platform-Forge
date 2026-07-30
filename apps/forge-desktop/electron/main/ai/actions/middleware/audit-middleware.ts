/**
 * audit-middleware.ts — Phase 29 Audit Middleware
 */

import { ActionRequest, ActionResult, IActionMiddleware } from '../action-types';

export class AuditMiddleware implements IActionMiddleware {
  readonly name = 'AuditMiddleware';

  constructor(private readonly historyLogger?: (req: ActionRequest, res: ActionResult) => Promise<void>) {}

  async execute(req: ActionRequest, next: () => Promise<ActionResult>): Promise<ActionResult> {
    const result = await next();
    if (this.historyLogger) {
      await this.historyLogger(req, result);
    }
    return result;
  }
}
