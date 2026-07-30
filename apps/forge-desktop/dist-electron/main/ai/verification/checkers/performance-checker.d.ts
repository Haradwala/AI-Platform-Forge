import type { IVerificationChecker, IVerificationEvidence, VerificationPolicy } from '../verification-types';
export declare class PerformanceChecker implements IVerificationChecker {
    readonly name = "PerformanceChecker";
    run(policy: VerificationPolicy, workspaceRoot: string | null): Promise<{
        success: boolean;
        errors: IVerificationEvidence[];
    }>;
}
