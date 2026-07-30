import type { IAiTaskRequest, IStructuredContext } from '../../container/service-interfaces';
export declare class PromptNormalizer {
    normalize(prompt: string, currentContext: IStructuredContext): IAiTaskRequest;
}
