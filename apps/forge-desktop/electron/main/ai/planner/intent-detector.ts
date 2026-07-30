export interface IIntent {
  readonly id: string;
  readonly confidence: number;
  readonly type: 'chat' | 'plan' | 'debug' | 'review' | 'refactor' | 'generate' | 'execute';
}

export class IntentDetector {
  detectIntent(goalDescription: string): IIntent {
    const cleanGoal = goalDescription.toLowerCase();
    let type: IIntent['type'] = 'chat';
    let confidence = 0.8;

    if (cleanGoal.includes('debug') || cleanGoal.includes('error') || cleanGoal.includes('fix')) {
      type = 'debug';
      confidence = 0.95;
    } else if (cleanGoal.includes('refactor') || cleanGoal.includes('optimize')) {
      type = 'refactor';
      confidence = 0.9;
    } else if (cleanGoal.includes('review') || cleanGoal.includes('inspect')) {
      type = 'review';
      confidence = 0.85;
    } else if (cleanGoal.includes('generate') || cleanGoal.includes('create') || cleanGoal.includes('add')) {
      type = 'generate';
      confidence = 0.92;
    } else if (cleanGoal.includes('execute') || cleanGoal.includes('run')) {
      type = 'execute';
      confidence = 0.9;
    } else if (cleanGoal.includes('plan') || cleanGoal.includes('milestone')) {
      type = 'plan';
      confidence = 0.95;
    }

    return {
      id: `intent_${Date.now()}`,
      confidence,
      type,
    };
  }
}
