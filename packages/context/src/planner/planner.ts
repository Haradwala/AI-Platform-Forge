import { IContextPlanner, IRetrievalStrategy } from '../interfaces/retrieval';
import { IIntent, IContextPlan } from '@forge/shared';
import { ExplainCodeStrategy } from './strategies/explain';
import { DebugStrategy } from './strategies/debug';
import { RefactorStrategy } from './strategies/refactor';

export class ContextPlanner implements IContextPlanner {
  private strategies = new Map<string, IRetrievalStrategy>();

  constructor() {
    this.strategies.set('explain', new ExplainCodeStrategy());
    this.strategies.set('debug', new DebugStrategy());
    this.strategies.set('refactor', new RefactorStrategy());
  }

  registerStrategy(intentType: string, strategy: IRetrievalStrategy): void {
    this.strategies.set(intentType, strategy);
  }

  plan(intent: IIntent, activeFilePath?: string): IContextPlan {
    const strategy = this.strategies.get(intent.type);
    if (strategy) {
      return strategy.configurePlan(intent, activeFilePath);
    }

    return {
      includeActiveFile: true,
      maxGraphHopDepth: 1,
      relationKinds: ['contains', 'calls'],
      searchQueries: intent.entities
    };
  }
}
