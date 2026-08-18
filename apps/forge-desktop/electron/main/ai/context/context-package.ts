import { ISymbol } from '../../platform/repository-types';

export interface IContextItem {
  id: string;
  source: 'workspace' | 'repository' | 'editor' | 'git' | 'diagnostics' | 'terminal' | 'runtime' | 'layout' | 'aistate';
  content: string;
  score: number;
  metadata?: Record<string, any>;
}

export interface IAiContextPackage {
  readonly timestamp: string;
  readonly items: IContextItem[];
  readonly conversationId: string;
  readonly activeProviderId: string;
  readonly activeModelId: string;
  readonly budgetTokens: number;
}
export interface ITaskNode {
  readonly id: string;
  readonly title: string;
  readonly description: string;
  readonly dependencies: string[];
  readonly priority: 'high' | 'normal' | 'low';
  readonly risk: 'high' | 'medium' | 'low';
  readonly toolId: string;
  readonly input?: any;
  status: 'pending' | 'running' | 'completed' | 'failed';
}
export type { ISymbol };
