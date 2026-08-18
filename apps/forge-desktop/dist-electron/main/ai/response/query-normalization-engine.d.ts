/**
 * query-normalization-engine.ts
 *
 * Sprint 87 — Canonical Request Normalization Engine
 *
 * This is the ONE canonical interpretation contract for all user prompts.
 * One user prompt → one NormalizedQuery → router. No parallel ResolvedRequest.
 *
 * Design rules:
 *  - Pure static utility — no I/O, no LLM calls, no singletons.
 *  - Deterministic intents (FILE_COUNT, FILE_OPEN, etc.) always take precedence
 *    over conceptual keyword heuristics (CODE_EXPLAIN).
 *  - 'explain' intent is only reached after all deterministic intents fail.
 *  - Target extraction is intent-aware and validated against plausible
 *    file/path syntax — never passes English filler words downstream.
 */
export type QueryDomain = 'file' | 'folder' | 'symbol' | 'workspace' | 'active_file' | 'unknown';
export type QueryIntent = 'open' | 'find' | 'count' | 'list' | 'explain' | 'find_symbol' | 'find_references' | 'find_imports';
/**
 * Canonical execution mode derived from domain + intent.
 * Routing decisions are made from this, not from raw intent strings.
 */
export type ExecutionMode = 'deterministic' | 'engineering-intelligence' | 'pipeline';
/**
 * Type of the extracted target value.
 */
export type TargetType = 'filename' | 'extension' | 'language' | 'path' | 'concept' | 'symbol';
/**
 * NormalizedQuery — the ONE canonical resolved-request representation.
 *
 * Sprint 87: This interface is the single source of truth between request
 * understanding and routing. No second parallel ResolvedRequest type exists.
 */
export interface NormalizedQuery {
    /** The original, untouched user prompt. */
    readonly originalPrompt: string;
    /** Semantic domain this query targets. */
    readonly domain: QueryDomain;
    /** Resolved user intent (deterministic intents take precedence over 'explain'). */
    readonly intent: QueryIntent;
    /**
     * The primary target extracted from the prompt.
     * e.g. "package.json", "Button", "forge-desktop", ".ts", "authentication".
     * Always validated — never a raw English filler word like "Can" or "Where".
     */
    readonly target?: string;
    /** Semantic type of the target, used to choose the correct retrieval strategy. */
    readonly targetType?: TargetType;
    /** Whether target extraction passed the plausibility validation check. */
    readonly targetValidated: boolean;
    /**
     * Canonical execution mode derived from domain + intent.
     * Routing decisions are made from this field.
     */
    readonly executionMode: ExecutionMode;
    /**
     * Optional scope restriction (sub-directory, package name, etc.)
     * e.g. "apps/forge-desktop", "packages/shared"
     */
    readonly scope?: string;
    /**
     * Ordinal position when the user says "the third one", "last one", etc.
     * 1-based; -1 represents "last".
     */
    readonly ordinal?: number;
    /**
     * 0-1 confidence that the classification is correct.
     * 1.0 = exact keyword match; lower values indicate inference.
     */
    readonly confidence: number;
}
export declare class QueryNormalizationEngine {
    /**
     * Normalizes a free-form user prompt into the ONE canonical NormalizedQuery.
     *
     * Sprint 87: This is the single entry-point. One prompt → one result → router.
     * No second parallel interpretation contract.
     *
     * Algorithm:
     *  1. Strip conversational prefix (compatibility shim)
     *  2. Detect domain
     *  3. Resolve intent (deterministic intents always take precedence)
     *  4. Extract and validate target from ORIGINAL prompt (intent-aware)
     *  5. Extract scope + ordinal
     *  6. Derive executionMode from domain + intent
     *  7. Compute confidence
     */
    static normalize(prompt: string): NormalizedQuery;
    /**
     * Returns true when the normalized query should be handled deterministically
     * (i.e. without an LLM call).
     *
     * Sprint 87: Uses executionMode rather than raw domain+intent re-check.
     */
    static isDeterministic(q: NormalizedQuery, confidenceThreshold?: number): boolean;
    /**
     * Returns true when the prompt should use engineering intelligence retrieval
     * (SemanticContextRetriever + EngineeringIntelligenceEngine) before LLM.
     */
    static isCodeExplain(q: NormalizedQuery): boolean;
}
