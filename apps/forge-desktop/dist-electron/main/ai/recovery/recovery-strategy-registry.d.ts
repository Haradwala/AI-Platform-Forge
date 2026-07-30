import type { IRecoveryStrategy } from './recovery-types';
import type { IVerificationReport } from '../verification/verification-types';
export declare class RecoveryStrategyRegistry {
    private readonly strategies;
    register(strategy: IRecoveryStrategy): void;
    getStrategiesFor(report: IVerificationReport): IRecoveryStrategy[];
    getById(id: string): IRecoveryStrategy | null;
}
