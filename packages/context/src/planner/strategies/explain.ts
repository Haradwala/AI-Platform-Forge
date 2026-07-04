import { IRetrievalStrategy } from '../../interfaces/retrieval';
import { IIntent, IContextPlan } from '@forge/shared';

export class ExplainCodeStrategy implements IRetrievalStrategy {
  readonly id = 'ExplainCodeStrategy';

  configurePlan(intent: IIntent, activeFilePath?: string): IContextPlan {
    return {
      includeActiveFile: true,
      maxGraphHopDepth: 2,
      relationKinds: ['contains', 'calls', 'belongs_to'],
      searchQueries: intent.entities
    };
  }
}
