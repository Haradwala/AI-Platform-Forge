import type { IVerificationChecker, VerificationPolicy, VerificationState, IVerificationReport } from './verification-types';
import type { IDesktopLogger, IDesktopEventBus } from '../../container/service-interfaces';
export declare class VerificationPipeline {
    private readonly compilationVerifier;
    private readonly lintVerifier;
    private readonly formattingChecker;
    private readonly testRunner;
    private readonly repositoryRules;
    private readonly securityScanner;
    private readonly performanceChecker;
    private readonly eventBus;
    private readonly logger;
    private currentState;
    constructor(compilationVerifier: IVerificationChecker, lintVerifier: IVerificationChecker, formattingChecker: IVerificationChecker, testRunner: IVerificationChecker, repositoryRules: IVerificationChecker, securityScanner: IVerificationChecker, performanceChecker: IVerificationChecker, eventBus: IDesktopEventBus, logger: IDesktopLogger);
    getState(): VerificationState;
    run(policy: VerificationPolicy, workspaceRoot: string | null): Promise<IVerificationReport>;
    private emitStateChange;
}
