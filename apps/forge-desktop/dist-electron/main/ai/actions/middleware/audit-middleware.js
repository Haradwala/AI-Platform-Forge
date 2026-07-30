"use strict";
/**
 * audit-middleware.ts — Phase 29 Audit Middleware
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuditMiddleware = void 0;
class AuditMiddleware {
    historyLogger;
    name = 'AuditMiddleware';
    constructor(historyLogger) {
        this.historyLogger = historyLogger;
    }
    async execute(req, next) {
        const result = await next();
        if (this.historyLogger) {
            await this.historyLogger(req, result);
        }
        return result;
    }
}
exports.AuditMiddleware = AuditMiddleware;
//# sourceMappingURL=audit-middleware.js.map