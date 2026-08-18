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

import { FileQueryNormalizer, FolderQueryNormalizer } from './file-query-normalizer';
import { QueryNormalizationEngine } from './query-normalization-engine';

export class ResponseModeClassifier {
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
  classify(userPrompt: string): ResponseModeDecision {
    const promptLower = (userPrompt || '').trim().toLowerCase();

    // ------------------------------------------------------------------
    // 1. Summarize / explain — requires LLM (Sprint 85 rule)
    // ------------------------------------------------------------------
    if (promptLower.includes('summarize') || promptLower.includes('explain')) {
      return { mode: 'summarization', requiresLlm: true, suggestedRuntime: 'lightweight' };
    }

    // ------------------------------------------------------------------
    // 2. QueryNormalizationEngine — phrase-agnostic pre-check (Sprint 86.5)
    //    Catches: "how many X", "count the X", "what is the number of X",
    //             "give me the count of X", "tell me how many X", etc.
    // ------------------------------------------------------------------
    const normalized = QueryNormalizationEngine.normalize(userPrompt);
    if (QueryNormalizationEngine.isDeterministic(normalized)) {
      return { mode: 'deterministic', requiresLlm: false, suggestedRuntime: 'deterministic' };
    }

    // ------------------------------------------------------------------
    // 3. Folder queries (Sprint 86.2)
    // ------------------------------------------------------------------
    const folderNorm = FolderQueryNormalizer.normalize(userPrompt);
    if (folderNorm.isFolderQuery) {
      return { mode: 'deterministic', requiresLlm: false, suggestedRuntime: 'deterministic' };
    }

    // ------------------------------------------------------------------
    // 4. Legacy keyword checks (Sprint 85/86)
    // ------------------------------------------------------------------
    if (
      promptLower.startsWith('open ') ||
      promptLower === 'open' ||
      promptLower.startsWith('find ') ||
      promptLower === 'find' ||
      promptLower.startsWith('delete ') ||
      promptLower === 'delete' ||
      promptLower.startsWith('rename ') ||
      promptLower === 'rename' ||
      promptLower.startsWith('count ') ||
      promptLower.startsWith('list ') ||
      promptLower.includes('how many') ||
      /\b(first|second|third|fourth|fifth|sixth|seventh|eighth|ninth|tenth|1st|2nd|3rd|4th|5th|6th|7th|8th|9th|10th|last)\b/i.test(promptLower)
    ) {
      return { mode: 'deterministic', requiresLlm: false, suggestedRuntime: 'deterministic' };
    }

    const norm = FileQueryNormalizer.normalize(userPrompt);
    if ((norm.intent === 'open' || norm.intent === 'count' || norm.intent === 'find' || norm.intent === 'list') && (norm.basename || norm.relativePath)) {
      return { mode: 'deterministic', requiresLlm: false, suggestedRuntime: 'deterministic' };
    }

    return { mode: 'conversation', requiresLlm: true, suggestedRuntime: 'reasoning' };
  }
}
