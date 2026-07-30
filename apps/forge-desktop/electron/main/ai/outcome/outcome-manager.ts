import type { IPlan, IDesktopLogger, IDesktopEventBus } from '../../container/service-interfaces';
import type { IVerificationReport } from '../verification/verification-types';
import type { IRecoveryReport } from '../recovery/recovery-types';
import type { IReflectionReport } from '../reflection/reflection-engine';
import type { IExecutionOutcome, IAiExperience } from './outcome-types';
import type { ExperienceBuilder } from './experience-builder';
import type { DecisionLog } from './decision-log';
import * as fs from 'fs';
import * as path from 'path';

export class OutcomeManager {
  constructor(
    private readonly experienceBuilder: ExperienceBuilder,
    private readonly decisionLog: DecisionLog,
    private readonly eventBus: IDesktopEventBus,
    private readonly logger: IDesktopLogger
  ) {}

  async processOutcome(
    plan: IPlan,
    verification: IVerificationReport,
    recovery: IRecoveryReport | null,
    reflection: IReflectionReport
  ): Promise<IExecutionOutcome> {
    this.logger.info('[OutcomeManager] Bundling immutable execution outcome...');

    const outcome: IExecutionOutcome = {
      success: verification.success,
      planId: plan.id,
      goal: plan.goal,
      verification,
      recovery,
      reflection,
      timestamp: new Date().toISOString(),
    };

    if (recovery) {
      for (const attempt of recovery.attempts) {
        this.decisionLog.logDecision(
          attempt.strategyId,
          attempt.success ? 'Successful recovery verification' : 'Failed recovery execution attempt',
          80,
          []
        );
      }
    }

    const workspaceRoot = '.';
    this.decisionLog.saveDecisionLog(workspaceRoot);

    const experience = this.experienceBuilder.buildExperience(outcome);
    this.saveExperience(experience, workspaceRoot);

    this.eventBus.emit('startup:stage-changed', { stage: 'outcome:created' });

    return outcome;
  }

  private saveExperience(experience: IAiExperience, workspaceRoot: string | null): void {
    if (!workspaceRoot) return;
    const outcomeDir = path.join(workspaceRoot, '.forge', 'outcome');
    if (!fs.existsSync(outcomeDir)) {
      fs.mkdirSync(outcomeDir, { recursive: true });
    }
    fs.writeFileSync(path.join(outcomeDir, 'experience.json'), JSON.stringify(experience, null, 2), 'utf8');
  }
}
