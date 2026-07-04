import { IIntentAnalyzer } from '../interfaces/intent';
import { IIntent } from '@forge/shared';

export class IntentAnalyzer implements IIntentAnalyzer {
  async analyze(request: string, activeFilePath?: string): Promise<IIntent> {
    const normalized = request.toLowerCase();
    let type = 'search';
    let confidence = 0.5;

    if (normalized.includes('explain') || normalized.includes('how does') || normalized.includes('what is')) {
      type = 'explain';
      confidence = 0.8;
    } else if (normalized.includes('debug') || normalized.includes('error') || normalized.includes('exception') || normalized.includes('fix') || normalized.includes('broken')) {
      type = 'debug';
      confidence = 0.9;
    } else if (normalized.includes('refactor') || normalized.includes('optimize') || normalized.includes('clean up')) {
      type = 'refactor';
      confidence = 0.85;
    } else if (normalized.includes('test') || normalized.includes('spec') || normalized.includes('coverage')) {
      type = 'test';
      confidence = 0.8;
    } else if (normalized.includes('generate') || normalized.includes('create') || normalized.includes('write code')) {
      type = 'generate';
      confidence = 0.75;
    }

    const entities: string[] = [];
    const wordMatches = request.match(/[A-Z][a-zA-Z0-9_]+/g);
    if (wordMatches) {
      for (const m of wordMatches) {
        if (!entities.includes(m)) {
          entities.push(m);
        }
      }
    }

    const fileMatches = request.match(/[a-zA-Z0-9_\-]+\.[a-zA-Z0-9]+/g);
    if (fileMatches) {
      for (const m of fileMatches) {
        if (!entities.includes(m)) {
          entities.push(m);
        }
      }
    }

    return {
      type,
      confidence,
      entities,
      scopePaths: activeFilePath ? [activeFilePath] : []
    };
  }
}
