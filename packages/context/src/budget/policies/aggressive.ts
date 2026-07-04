import { IBudgetPolicy } from '../../interfaces/budget';
import { ICandidateContext } from '@forge/shared';

export class AggressiveBudgetPolicy implements IBudgetPolicy {
  readonly id = 'AggressiveBudgetPolicy';
  readonly maxTokenUsage = 4096;
  readonly compressionLevel = 'aggressive';

  shouldCompress(candidate: ICandidateContext): boolean {
    return candidate.relevanceScore < 1.0;
  }
}
