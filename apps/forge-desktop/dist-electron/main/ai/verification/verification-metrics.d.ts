import type { IVerificationMetrics } from './verification-types';
export declare class VerificationMetrics {
    private compileTotal;
    private lintTotal;
    private testTotal;
    private scanTotal;
    addMetrics(m: IVerificationMetrics): void;
    getSummary(): {
        compileTotalMs: number;
        lintTotalMs: number;
        testTotalMs: number;
        scanTotalMs: number;
        grandTotalMs: number;
    };
    clear(): void;
}
