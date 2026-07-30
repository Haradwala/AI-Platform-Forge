import { IContextItem } from './context-package';
export declare class TokenBudgetManager {
    private readonly defaultBudget;
    constructor(defaultBudget?: number);
    allocateAndCompress(items: IContextItem[], budget?: number): IContextItem[];
}
