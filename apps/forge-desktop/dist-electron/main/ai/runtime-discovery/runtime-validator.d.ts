/**
 * runtime-validator.ts — Phase 23 Runtime Discovery Validation Engine
 */
export interface ValidationResult {
    valid: boolean;
    executablePath: string | null;
    version: string | null;
    error?: string;
}
export interface EnvValidationResult {
    valid: boolean;
    missingKeys: string[];
    redactedVars: Record<string, string>;
    rawVars: Record<string, string>;
}
export declare class RuntimeValidator {
    /**
     * Validates if an executable file path exists, is accessible, and executes cleanly with --version / -v.
     */
    validateExecutable(execPath: string, versionFlag?: string, timeoutMs?: number): Promise<ValidationResult>;
    /**
     * Validates environment variables for cloud/API runtimes without exposing secrets.
     */
    validateEnvironment(requiredKeys: string[], optionalKeys?: string[]): EnvValidationResult;
}
