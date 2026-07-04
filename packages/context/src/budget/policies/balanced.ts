import { IBudgetPolicy } from '../../interfaces/budget';
import { ICandidateContext } from '@forge/shared';

export class BalancedBudgetPolicy implements IBudgetPolicy {
  readonly id = 'BalancedBudgetPolicy';
  readonly maxTokenUsage = 8192;
  readonly compressionLevel = 'light';

  shouldCompress(candidate: ICandidateContext): boolean {
    return candidate.relevanceScore < 0.9;
  }
}
