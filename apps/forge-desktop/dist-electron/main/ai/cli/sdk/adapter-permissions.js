"use strict";
/**
 * adapter-permissions.ts — Phase 20 CLI Adapter SDK & Registry
 *
 * Permission definitions and security policy verification.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.PermissionChecker = exports.ALL_ADAPTER_PERMISSIONS = void 0;
exports.ALL_ADAPTER_PERMISSIONS = [
    'filesystem',
    'network',
    'terminal',
    'workspace',
    'git',
    'clipboard',
    'browser',
    'process',
];
class PermissionChecker {
    /**
     * Validates requested permissions against allowed security scope.
     */
    static validatePermissions(requested, allowed = exports.ALL_ADAPTER_PERMISSIONS) {
        const missing = requested.filter((p) => !allowed.includes(p));
        return {
            valid: missing.length === 0,
            missing,
        };
    }
    static hasPermission(permission, granted) {
        return granted.includes(permission);
    }
}
exports.PermissionChecker = PermissionChecker;
//# sourceMappingURL=adapter-permissions.js.map