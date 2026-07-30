/**
 * configuration-validator.ts
 *
 * Diagnostic validator for ForgeConfig.
 * Checks for missing API keys, invalid URLs, and unknown active runtimes.
 * Never throws.
 */
export interface ValidationResult {
    valid: boolean;
    errors: string[];
    warnings: string[];
}
export declare function validateConfig(config: unknown): ValidationResult;
