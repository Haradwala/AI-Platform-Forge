import type { IVerificationChecker, IVerificationEvidence, VerificationPolicy } from '../verification-types';
export declare class RepositoryRules implements IVerificationChecker {
    readonly name = "RepositoryRules";
    run(policy: VerificationPolicy, workspaceRoot: string | null): Promise<{
        success: boolean;
        errors: IVerificationEvidence[];
    }>;
}
