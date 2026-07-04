import { ICandidateContext } from '@forge/shared';

export interface IBudgetPolicy {
  readonly id: string;
  readonly maxTokenUsage: number;
  readonly compressionLevel: 'none' | 'light' | 'aggressive';
  shouldCompress(candidate: ICandidateContext): boolean;
}

export interface IBudgetManager {
  fit(candidates: ICandidateContext[], policy: IBudgetPolicy): ICandidateContext[];
}
