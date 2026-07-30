import type { IVerificationChecker, IVerificationEvidence, VerificationPolicy } from '../verification-types';
export declare class FormattingChecker implements IVerificationChecker {
    readonly name = "FormattingChecker";
    run(policy: VerificationPolicy, workspaceRoot: string | null): Promise<{
        success: boolean;
        errors: IVerificationEvidence[];
        metadata?: Record<string, any>;
    }>;
}
