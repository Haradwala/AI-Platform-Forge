import type { IRecoveryStrategy } from './recovery-types';
import type { IVerificationReport } from '../verification/verification-types';

export class RecoveryStrategyRegistry {
  private readonly strategies: Map<string, IRecoveryStrategy> = new Map();

  register(strategy: IRecoveryStrategy): void {
    this.strategies.set(strategy.id, strategy);
  }

  getStrategiesFor(report: IVerificationReport): IRecoveryStrategy[] {
    const applicable: IRecoveryStrategy[] = [];
    for (const strategy of this.strategies.values()) {
      if (strategy.canRecover(report)) {
        applicable.push(strategy);
      }
    }
    return applicable;
  }

  getById(id: string): IRecoveryStrategy | null {
    return this.strategies.get(id) || null;
  }
}
