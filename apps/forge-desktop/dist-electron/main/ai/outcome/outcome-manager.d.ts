import type { IPlan, IDesktopLogger, IDesktopEventBus } from '../../container/service-interfaces';
import type { IVerificationReport } from '../verification/verification-types';
import type { IRecoveryReport } from '../recovery/recovery-types';
import type { IReflectionReport } from '../reflection/reflection-engine';
import type { IExecutionOutcome } from './outcome-types';
import type { ExperienceBuilder } from './experience-builder';
import type { DecisionLog } from './decision-log';
export declare class OutcomeManager {
    private readonly experienceBuilder;
    private readonly decisionLog;
    private readonly eventBus;
    private readonly logger;
    constructor(experienceBuilder: ExperienceBuilder, decisionLog: DecisionLog, eventBus: IDesktopEventBus, logger: IDesktopLogger);
    processOutcome(plan: IPlan, verification: IVerificationReport, recovery: IRecoveryReport | null, reflection: IReflectionReport): Promise<IExecutionOutcome>;
    private saveExperience;
}
