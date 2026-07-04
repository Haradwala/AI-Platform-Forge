import { IRetrievalCandidate } from '@forge/shared';

export class CandidateMerger {
  merge(providerOutputs: IRetrievalCandidate[][]): IRetrievalCandidate[] {
    const list: IRetrievalCandidate[] = [];
    for (const candidates of providerOutputs) {
      list.push(...candidates);
    }
    return list;
  }
}
