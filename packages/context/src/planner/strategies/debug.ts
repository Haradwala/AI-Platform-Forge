import { IRetrievalStrategy } from '../../interfaces/retrieval';
import { IIntent, IContextPlan } from '@forge/shared';

export class DebugStrategy implements IRetrievalStrategy {
  readonly id = 'DebugStrategy';

  configurePlan(intent: IIntent, activeFilePath?: string): IContextPlan {
    return {
      includeActiveFile: true,
      maxGraphHopDepth: 1,
      relationKinds: ['calls', 'references'],
      searchQueries: intent.entities
    };
  }
}
