import { IIntent } from '@forge/shared';

export interface IIntentAnalyzer {
  analyze(request: string, activeFilePath?: string): Promise<IIntent>;
}
