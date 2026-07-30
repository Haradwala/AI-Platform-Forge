export type VerificationState = 'queued' | 'compiling' | 'linting' | 'testing' | 'scanning' | 'completed' | 'failed' | 'cancelled';
export type VerificationPolicy = 'quick' | 'standard' | 'deep' | 'release';
export interface IVerificationEvidence {
    readonly file: string;
    readonly line: number;
    readonly column: number;
    readonly message: string;
    readonly severity: 'error' | 'warning';
    readonly source: string;
    readonly stack?: string;
}
export interface IVerificationReport {
    readonly success: boolean;
    readonly state: VerificationState;
    readonly policy: VerificationPolicy;
    readonly durationMs: number;
    readonly compilation: {
        readonly success: boolean;
        readonly errors: IVerificationEvidence[];
    };
    readonly lint: {
        readonly success: boolean;
        readonly errors: IVerificationEvidence[];
    };
    readonly test: {
        readonly success: boolean;
        readonly passCount: number;
        readonly failCount: number;
        readonly errors: IVerificationEvidence[];
    };
    readonly format: {
        readonly success: boolean;
        readonly filesUnformatted: string[];
    };
    readonly security: {
        readonly success: boolean;
        readonly issues: IVerificationEvidence[];
    };
    readonly architecture: {
        readonly success: boolean;
        readonly issues: IVerificationEvidence[];
    };
    readonly performance: {
        readonly success: boolean;
        readonly issues: IVerificationEvidence[];
    };
    readonly suggestions: string[];
}
export interface IVerificationMetrics {
    compileTimeMs: number;
    lintTimeMs: number;
    testTimeMs: number;
    scanTimeMs: number;
}
export interface IVerificationChecker {
    readonly name: string;
    run(policy: VerificationPolicy, workspaceRoot: string | null): Promise<{
        readonly success: boolean;
        readonly errors: IVerificationEvidence[];
        readonly metadata?: Record<string, any>;
    }>;
}
