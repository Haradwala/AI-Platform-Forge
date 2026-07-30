/**
 * adapter-permissions.ts — Phase 20 CLI Adapter SDK & Registry
 *
 * Permission definitions and security policy verification.
 */

export type AdapterPermission =
  | 'filesystem'
  | 'network'
  | 'terminal'
  | 'workspace'
  | 'git'
  | 'clipboard'
  | 'browser'
  | 'process';

export const ALL_ADAPTER_PERMISSIONS: AdapterPermission[] = [
  'filesystem',
  'network',
  'terminal',
  'workspace',
  'git',
  'clipboard',
  'browser',
  'process',
];

export class PermissionChecker {
  /**
   * Validates requested permissions against allowed security scope.
   */
  static validatePermissions(
    requested: AdapterPermission[],
    allowed: AdapterPermission[] = ALL_ADAPTER_PERMISSIONS
  ): { valid: boolean; missing: AdapterPermission[] } {
    const missing = requested.filter((p) => !allowed.includes(p));
    return {
      valid: missing.length === 0,
      missing,
    };
  }

  static hasPermission(permission: AdapterPermission, granted: AdapterPermission[]): boolean {
    return granted.includes(permission);
  }
}
