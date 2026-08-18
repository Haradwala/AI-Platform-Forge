/**
 * response-mode-classifier.ts
 *
 * Sprint 85 Wave 1 — Response Mode Classifier
 *
 * Classifies incoming user prompts to skip LLM calls for deterministic actions.
 */
export type ResponseMode = 'deterministic' | 'summarization' | 'conversation';
export type RuntimeTier = 'deterministic' | 'lightweight' | 'reasoning';
export interface ResponseModeDecision {
    readonly mode: ResponseMode;
    readonly requiresLlm: boolean;
    readonly suggestedRuntime: RuntimeTier;
}
export declare class ResponseModeClassifier {
    /**
     * Classifies a prompt into a ResponseModeDecision.
     *
     * Classification rules:
     *  1. QueryNormalizationEngine fast path — phrase-agnostic domain+intent
     *     detection catches all variants ("how many", "count the", etc.)
     *  2. open *, find *, count *, list *, ordinals ("third one"), folder queries ->
     *     deterministic (requiresLlm: false, suggestedRuntime: 'deterministic')
     *  3. prompts containing 'summarize' or 'explain' ->
     *     summarization (requiresLlm: true, suggestedRuntime: 'lightweight')
     *  4. everything else -> conversation (requiresLlm: true, suggestedRuntime: 'reasoning')
     */
    classify(userPrompt: string): ResponseModeDecision;
}
