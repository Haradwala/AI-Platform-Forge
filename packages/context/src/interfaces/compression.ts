import { ICandidateContext } from '@forge/shared';
import { IBudgetPolicy } from './budget';

export interface IContextCompressor {
  readonly id: string;
  compress(candidate: ICandidateContext, policy: IBudgetPolicy): Promise<ICandidateContext>;
}
