"use strict";
/**
 * action-validator.ts — Phase 29 Action Validator
 *
 * Validates ActionRequest input parameters and security permissions before execution.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActionValidator = void 0;
class ActionValidator {
    async validate(action, req) {
        const errors = [];
        // Check custom validate implementation on Action
        if (action.validate) {
            try {
                const isValid = await action.validate(req.params);
                if (!isValid) {
                    errors.push(`Action ${action.metadata.id} schema validation failed for input parameters.`);
                }
            }
            catch (err) {
                errors.push(`Action validation error: ${err.message}`);
            }
        }
        // Check workspaceRoot
        if (!req.workspaceRoot) {
            errors.push('ActionRequest is missing required workspaceRoot parameter.');
        }
        return {
            valid: errors.length === 0,
            errors,
        };
    }
}
exports.ActionValidator = ActionValidator;
//# sourceMappingURL=action-validator.js.map