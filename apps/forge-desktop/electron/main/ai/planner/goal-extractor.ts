export interface IGoal {
  readonly id: string;
  readonly description: string;
  readonly scope: 'file' | 'module' | 'workspace';
  readonly targetFiles: string[];
}

export class GoalExtractor {
  extractGoal(goalDescription: string, activeFilePath?: string): IGoal {
    const cleanGoal = goalDescription.toLowerCase();
    const targetFiles: string[] = [];
    let scope: IGoal['scope'] = 'workspace';

    if (activeFilePath) {
      targetFiles.push(activeFilePath);
      scope = 'file';
    }

    // Match potential files in text
    const fileMatches = goalDescription.match(/[\w-]+\.(ts|tsx|js|jsx|json|py|go|rs)/g);
    if (fileMatches) {
      fileMatches.forEach((f) => {
        if (!targetFiles.includes(f)) {
          targetFiles.push(f);
        }
      });
      if (targetFiles.length > 1) {
        scope = 'module';
      }
    }

    return {
      id: `goal_${Date.now()}`,
      description: goalDescription,
      scope,
      targetFiles,
    };
  }
}
