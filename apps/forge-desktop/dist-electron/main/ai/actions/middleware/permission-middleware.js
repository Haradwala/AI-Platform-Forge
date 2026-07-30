"use strict";
/**
 * permission-middleware.ts — Phase 29 Permission Pipeline Middleware
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.PermissionMiddleware = void 0;
class PermissionMiddleware {
    name = 'PermissionMiddleware';
    async execute(req, next) {
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
exports.PermissionMiddleware = PermissionMiddleware;
//# sourceMappingURL=permission-middleware.js.map