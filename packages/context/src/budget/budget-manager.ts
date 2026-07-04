import { IBudgetManager, IBudgetPolicy } from '../interfaces/budget';
import { ICandidateContext } from '@forge/shared';

export class BudgetManager implements IBudgetManager {
  fit(candidates: ICandidateContext[], policy: IBudgetPolicy): ICandidateContext[] {
    const selected: ICandidateContext[] = [];
    let accumulatedTokens = 0;

    for (const cand of candidates) {
      let tokens = cand.estimatedTokens;

      if (accumulatedTokens + tokens > policy.maxTokenUsage) {
        if (policy.shouldCompress(cand) && policy.compressionLevel !== 'none') {
          tokens = Math.ceil(tokens / 2);
        }
      }

      if (accumulatedTokens + tokens <= policy.maxTokenUsage) {
        selected.push({
          ...cand,
          estimatedTokens: tokens
        });
        accumulatedTokens += tokens;
      }
    }

    return selected;
  }
}
