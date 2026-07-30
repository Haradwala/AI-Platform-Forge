/**
 * adapter-permissions.ts — Phase 20 CLI Adapter SDK & Registry
 *
 * Permission definitions and security policy verification.
 */
export type AdapterPermission = 'filesystem' | 'network' | 'terminal' | 'workspace' | 'git' | 'clipboard' | 'browser' | 'process';
export declare const ALL_ADAPTER_PERMISSIONS: AdapterPermission[];
export declare class PermissionChecker {
    /**
     * Validates requested permissions against allowed security scope.
     */
    static validatePermissions(requested: AdapterPermission[], allowed?: AdapterPermission[]): {
        valid: boolean;
        missing: AdapterPermission[];
    };
    static hasPermission(permission: AdapterPermission, granted: AdapterPermission[]): boolean;
}
