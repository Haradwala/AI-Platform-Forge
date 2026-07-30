import type { IVerificationChecker, IVerificationEvidence, VerificationPolicy } from '../verification-types';
export declare class TestRunner implements IVerificationChecker {
    readonly name = "TestRunner";
    run(policy: VerificationPolicy, workspaceRoot: string | null): Promise<{
        success: boolean;
        errors: IVerificationEvidence[];
        metadata?: Record<string, any>;
    }>;
}
