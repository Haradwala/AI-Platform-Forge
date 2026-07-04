import { IRetrievalStrategy } from '../../interfaces/retrieval';
import { IIntent, IContextPlan } from '@forge/shared';

export class RefactorStrategy implements IRetrievalStrategy {
  readonly id = 'RefactorStrategy';

  configurePlan(intent: IIntent, activeFilePath?: string): IContextPlan {
    return {
      includeActiveFile: true,
      maxGraphHopDepth: 2,
      relationKinds: ['calls', 'extends', 'implements'],
      searchQueries: intent.entities
    };
  }
}
