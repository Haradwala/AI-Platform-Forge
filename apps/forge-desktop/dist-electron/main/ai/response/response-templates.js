"use strict";
/**
 * response-templates.ts
 *
 * Sprint 85 Wave 1 — Fast Response Templates
 *
 * Pre-formatted response templates for deterministic actions.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.found = exports.opened = exports.ResponseTemplates = void 0;
class ResponseTemplates {
    static opened(path) {
        return `Opened ${path}`;
    }
    static found(count, query) {
        return `Found ${count} matches for "${query}".`;
    }
}
exports.ResponseTemplates = ResponseTemplates;
exports.opened = ResponseTemplates.opened;
exports.found = ResponseTemplates.found;
//# sourceMappingURL=response-templates.js.map