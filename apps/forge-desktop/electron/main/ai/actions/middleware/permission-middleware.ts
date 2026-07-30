/**
 * permission-middleware.ts — Phase 29 Permission Pipeline Middleware
 */

import { ActionRequest, ActionResult, IActionMiddleware } from '../action-types';

export class PermissionMiddleware implements IActionMiddleware {
  readonly name = 'PermissionMiddleware';

  async execute(req: ActionRequest, next: () => Promise<ActionResult>): Promise<ActionResult> {
    // Basic safety check for workspace boundaries
    if (req.params && req.params.filePath) {
      const p = String(req.params.filePath);
      if (p.includes('..') && !p.startsWith(req.workspaceRoot)) {
        return {
          actionId: req.actionId,
          status: 'FAILED',
          durationMs: 0,
          error: `Permission error: File path ${p} attempts to traverse outside workspace root.`,
        };
      }
    }

    return await next();
  }
}
