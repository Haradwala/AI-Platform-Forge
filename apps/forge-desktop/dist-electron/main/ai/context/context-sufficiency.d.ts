import { IAiContextPackage } from './context-package';
export interface IContextSufficiency {
    readonly sufficient: boolean;
    readonly missingDetails: string[];
    readonly suggestedQueries: string[];
}
export declare class ContextSufficiencyChecker {
    checkSufficiency(contextPackage: IAiContextPackage, goalDescription: string): IContextSufficiency;
}
