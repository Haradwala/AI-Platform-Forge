import type { IAiTaskRequest, IStructuredContext } from '../../container/service-interfaces';

export class PromptNormalizer {
  normalize(prompt: string, currentContext: IStructuredContext): IAiTaskRequest {
    let executionMode: 'chat' | 'plan' | 'execute' | 'review' = 'chat';
    let cleanPrompt = prompt.trim();

    if (cleanPrompt.startsWith('/plan ')) {
      executionMode = 'plan';
      cleanPrompt = cleanPrompt.substring(5).trim();
    } else if (cleanPrompt.startsWith('/execute ')) {
      executionMode = 'execute';
      cleanPrompt = cleanPrompt.substring(9).trim();
    } else if (cleanPrompt.startsWith('/review ')) {
      executionMode = 'review';
      cleanPrompt = cleanPrompt.substring(8).trim();
    }

    return {
      goal: cleanPrompt,
      context: currentContext,
      memory: {
        conversationId: `conv_${Date.now()}`,
        shortTermFacts: []
      },
      executionMode
    };
  }
}
