export interface IIntent {
    readonly id: string;
    readonly confidence: number;
    readonly type: 'chat' | 'plan' | 'debug' | 'review' | 'refactor' | 'generate' | 'execute';
}
export declare class IntentDetector {
    detectIntent(goalDescription: string): IIntent;
}
