import type { IVerificationChecker, IVerificationEvidence, VerificationPolicy } from '../verification-types';
export declare class LintVerifier implements IVerificationChecker {
    readonly name = "LintVerifier";
    run(policy: VerificationPolicy, workspaceRoot: string | null): Promise<{
        success: boolean;
        errors: IVerificationEvidence[];
    }>;
}
