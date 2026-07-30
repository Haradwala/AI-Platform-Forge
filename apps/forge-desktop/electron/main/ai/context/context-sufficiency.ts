import { IAiContextPackage } from './context-package';

export interface IContextSufficiency {
  readonly sufficient: boolean;
  readonly missingDetails: string[];
  readonly suggestedQueries: string[];
}

export class ContextSufficiencyChecker {
  checkSufficiency(contextPackage: IAiContextPackage, goalDescription: string): IContextSufficiency {
    const missingDetails: string[] = [];
    const suggestedQueries: string[] = [];
    const cleanGoal = goalDescription.toLowerCase();

    // Verify workspace stats or indexing is present
    const hasStats = contextPackage.items.some((item) => item.source === 'repository' && item.content.includes('statistics'));
    if (!hasStats && (cleanGoal.includes('refactor') || cleanGoal.includes('architect'))) {
      missingDetails.push('Missing Repository Index Statistics.');
      suggestedQueries.push('Find all symbols in project.');
    }

    // Verify active file content is present if editing/explaining
    const hasActiveFile = contextPackage.items.some((item) => item.source === 'editor' && item.content.includes('Active File'));
    if (!hasActiveFile && (cleanGoal.includes('fix') || cleanGoal.includes('explain') || cleanGoal.includes('modify'))) {
      missingDetails.push('Missing Active Editor Context.');
      suggestedQueries.push('Inspect open files details.');
    }

    return {
      sufficient: missingDetails.length === 0,
      missingDetails,
      suggestedQueries,
    };
  }
}
