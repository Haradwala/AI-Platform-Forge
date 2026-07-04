import { IIntent, ICandidateContext, IContextPlan } from '@forge/shared';

export interface IContextRetriever {
  readonly id: string;
  retrieve(plan: IContextPlan, activeFilePath?: string): Promise<ICandidateContext[]>;
}

export interface IRetrievalStrategy {
  readonly id: string;
  configurePlan(intent: IIntent, activeFilePath?: string): IContextPlan;
}

export interface IContextPlanner {
  plan(intent: IIntent, activeFilePath?: string): IContextPlan;
}
