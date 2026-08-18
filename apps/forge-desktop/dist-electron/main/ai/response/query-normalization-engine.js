"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.QueryNormalizationEngine = void 0;
// ---------------------------------------------------------------------------
// Compatibility shim: conversational prefix pre-strip
// ---------------------------------------------------------------------------
/**
 * Strips common conversational wrappers from the beginning of a prompt.
 *
 * IMPORTANT: This is a compatibility shim, NOT the primary fix mechanism.
 * The real fix is intent-aware target validation below. This shim handles
 * the most common surface-level cases so the rest of extraction is cleaner.
 *
 * Examples:
 *   "Can you open package.json?"     → "open package.json?"
 *   "Where is the tsconfig.json?"    → "tsconfig.json?"
 *   "Could you find all .ts files?"  → "find all .ts files?"
 *   "Please show me package.json"    → "show me package.json"
 */
const CONVERSATIONAL_PREFIX_SHIM = /^(?:(?:can|could|would|will|do)\s+(?:you\s+)?(?:please\s+)?|where\s+(?:is|are)\s+(?:(?:the|all)\s+)?|what\s+(?:is|are)\s+(?:(?:the|all)\s+)?|please\s+|i(?:'d|\s+would)\s+like\s+(?:you\s+)?to\s+|can\s+you\s+tell\s+me\s+|tell\s+me\s+)/i;
function stripConversationalPrefix(prompt) {
    return prompt.replace(CONVERSATIONAL_PREFIX_SHIM, '').trim();
}
// ---------------------------------------------------------------------------
// Target validation: never pass English filler words downstream
// ---------------------------------------------------------------------------
/**
 * Common English words that can never be a valid filename, extension, or
 * code concept target. If extraction produces one of these, the target is
 * invalid and must be rejected (fail closed).
 */
const ENGLISH_FILLER_BLOCKLIST = new Set([
    'can', 'could', 'would', 'will', 'do', 'does', 'did', 'should', 'shall',
    'may', 'might', 'must', 'is', 'are', 'was', 'were', 'be', 'been', 'being',
    'have', 'has', 'had', 'get', 'got', 'go', 'goes', 'went',
    'a', 'an', 'the', 'this', 'that', 'these', 'those',
    'i', 'you', 'we', 'they', 'he', 'she', 'it', 'me', 'us', 'them',
    'my', 'your', 'our', 'their', 'its', 'his', 'her',
    'what', 'which', 'who', 'whom', 'whose', 'when', 'where', 'why', 'how',
    'tell', 'show', 'give', 'let', 'make', 'take', 'put', 'set', 'use',
    'know', 'see', 'look', 'like', 'want', 'need', 'please', 'help',
    'all', 'some', 'any', 'each', 'every', 'no', 'none', 'many', 'much',
    'more', 'most', 'few', 'less', 'little', 'other', 'another', 'same',
    'also', 'just', 'only', 'very', 'really', 'here', 'there', 'now', 'then',
    'up', 'down', 'in', 'out', 'on', 'off', 'over', 'under', 'again',
    'if', 'so', 'but', 'and', 'or', 'not', 'nor', 'yet', 'for',
    'ok', 'okay', 'yes', 'no', 'sure', 'right', 'good', 'well', 'fine',
]);
/**
 * Validates that a candidate target is a plausible filename, extension,
 * path, language name, or code concept — and NOT an English filler word.
 *
 * Returns true when the candidate is a valid, usable target.
 */
function isValidTarget(candidate, intent) {
    if (!candidate || candidate.length < 2 || candidate.length > 120)
        return false;
    const lower = candidate.toLowerCase();
    // Reject English filler words
    if (ENGLISH_FILLER_BLOCKLIST.has(lower))
        return false;
    // For file/open/count/find intents: must look like a real file/path token
    const isDeterministicIntent = ['open', 'find', 'count', 'list'].includes(intent);
    if (isDeterministicIntent) {
        const looksLikeFile = candidate.includes('.') || // has extension: package.json, tsconfig.ts
            candidate.includes('/') || // has path separator: apps/forge-desktop
            /^\.[a-z]{1,8}$/.test(lower); // bare extension: .ts, .json
        // Also accept language names for count/list intents
        const looksLikeLanguage = /^(typescript|javascript|python|rust|go|css|html|json|yaml|markdown)$/i.test(candidate);
        return looksLikeFile || looksLikeLanguage;
    }
    // For symbol/concept intents: accept any non-filler word
    return true;
}
// ---------------------------------------------------------------------------
// Private helpers
// ---------------------------------------------------------------------------
/** Ordered list of ordinal words → numeric positions. */
const ORDINAL_WORD_MAP = {
    first: 1,
    '1st': 1,
    second: 2,
    '2nd': 2,
    third: 3,
    '3rd': 3,
    fourth: 4,
    '4th': 4,
    fifth: 5,
    '5th': 5,
    sixth: 6,
    '6th': 6,
    seventh: 7,
    '7th': 7,
    eighth: 8,
    '8th': 8,
    ninth: 9,
    '9th': 9,
    tenth: 10,
    '10th': 10,
    last: -1,
};
/**
 * Patterns that unambiguously signal a COUNT intent regardless of phrasing.
 * Captures: "how many", "count the", "total number of", "what is the number of",
 *           "give me the count of", "tell me how many", "number of X", "total count of"
 */
const COUNT_PATTERNS = [
    /\bhow\s+many\b/i,
    /\bcount\s+(the\s+)?\b/i,
    /\btotal\s+number\s+of\b/i,
    /\btotal\s+count\s+(of\s+)?\b/i,
    /\bwhat\s+is\s+the\s+(total\s+)?(number|count)\s+of\b/i,
    /\bgive\s+me\s+the\s+(total\s+)?count\s+of\b/i,
    /\btell\s+me\s+how\s+many\b/i,
    /\bnumber\s+of\b/i,
    /\bcount\b.*\bfiles?\b/i,
    /\bfiles?\s+count\b/i,
];
/** Patterns that signal a LIST intent. */
const LIST_PATTERNS = [
    /\blist\s+(all\s+)?\b/i,
    /\bshow\s+(me\s+)?(all|every)\b/i,
    /\bshow\s+all\b/i,
    /\bdisplay\s+(all\s+)?\b/i,
    /\benumerate\b/i,
    /\bwhat\s+(are\s+)?(all\s+)?(the\s+)?\b/i,
];
/** Patterns that signal an OPEN intent. */
const OPEN_PATTERNS = [/\bopen\b/i, /\bview\b/i, /\bread\b/i, /\binspect\b/i];
/** Patterns that signal a FIND intent. */
const FIND_PATTERNS = [
    /\bfind\b/i,
    /\bsearch\s+(for\s+)?\b/i,
    /\blocate\b/i,
    /\bwhere\s+is\b/i,
    /\bwhere\s+are\b/i,
];
/**
 * Patterns that signal CODE_EXPLAIN intent.
 * IMPORTANT: Only used as a FALLBACK after all deterministic intents fail.
 * "How many X?" matches 'how' here but must never reach this — COUNT_PATTERNS
 * fire first via resolveIntent's precedence order.
 */
const EXPLAIN_PATTERNS = [
    /\bwhy\s+(?:is|are|was|were|does|do)\b/i,
    /\bhow\s+(?:is|are|does|do|was|were)\s+.+\b(?:implemented|built|structured|designed|work)\b/i,
    /\bexplain\b/i,
    /\bwhat\s+does\b/i,
    /\bwhat\s+is\s+the\s+purpose\b/i,
    /\bwhat\s+is\s+the\s+reason\b/i,
    /\bimplemented\s+this\s+way\b/i,
];
/** Symbol-related intent patterns. */
const FIND_SYMBOL_PATTERNS = [
    /\b(class|function|interface|type|enum|component|hook)\s+\w+/i,
];
const FIND_REFERENCES_PATTERNS = [
    /\breferences?\s+(to|of)\b/i,
    /\bwhere\s+is\b.*\bused\b/i,
];
const FIND_IMPORTS_PATTERNS = [
    /\bimport(s|ed)?\b.*\bfrom\b/i,
    /\bwhat\s+imports\b/i,
];
// ---------------------------------------------------------------------------
// Domain detection helpers
// ---------------------------------------------------------------------------
/** Returns true when the prompt explicitly mentions file concepts. */
function looksLikeFileDomain(lc) {
    return (/\bfiles?\b/i.test(lc) ||
        /\.[a-z]{1,5}\b/.test(lc) || // extension token  e.g. ".json", ".ts"
        /\bpackage\.json\b/i.test(lc) ||
        /\btsconfig\b/i.test(lc) ||
        /\breadme\b/i.test(lc));
}
/** Returns true when the prompt explicitly mentions folder/directory concepts. */
function looksLikeFolderDomain(lc) {
    return /\b(folders?|director(y|ies))\b/i.test(lc);
}
/** Returns true when the prompt mentions code symbol concepts. */
function looksLikeSymbolDomain(lc) {
    return /\b(class|function|interface|type|enum|component|hook|symbol|method|property)\b/i.test(lc);
}
/** Returns true when the prompt refers to the currently open/active file. */
function looksLikeActiveFileDomain(lc) {
    return /\b(this file|current file|active file|opened file|current document)\b/i.test(lc);
}
// ---------------------------------------------------------------------------
// Target extraction helpers
// ---------------------------------------------------------------------------
/**
 * Intent-aware target extraction from the ORIGINAL prompt.
 *
 * Extracts from the raw prompt rather than a stripped version so that
 * the filename token is found regardless of conversational prefix.
 * Returns undefined when no valid target is found.
 *
 * Extraction chain (precedence order):
 *   1. Filename with extension (package.json, tsconfig.ts)
 *   2. Path with slash (apps/forge-desktop/index.ts)
 *   3. Bare extension (.ts, .json)
 *   4. Language name (typescript, javascript) — only for count/list intents
 *   5. Concept keyword (authentication, caching) — only for explain intent
 */
function extractAndValidateTarget(originalPrompt, intent, scope) {
    // 1. Path with slash (apps/forge-desktop/package.json, packages/shared)
    const pathMatches = Array.from(originalPrompt.matchAll(/\b([a-zA-Z0-9_\-\.]+(?:\/[a-zA-Z0-9_\-\.]+)+)\b/g));
    for (const m of pathMatches) {
        const candidate = m[1];
        if (candidate && !ENGLISH_FILLER_BLOCKLIST.has(candidate.toLowerCase())) {
            if (!scope || candidate.toLowerCase() !== scope.toLowerCase()) {
                return { target: candidate, targetType: 'path', targetValidated: true };
            }
        }
    }
    // 2. Filename with extension (package.json, tsconfig.ts)
    const filenameMatch = originalPrompt.match(/\b([a-zA-Z0-9_\-]+(?:\.[a-zA-Z0-9]{1,10})+)\b/);
    if (filenameMatch?.[1]) {
        const candidate = filenameMatch[1];
        // Validate: must have a real extension part
        const dotIdx = candidate.lastIndexOf('.');
        if (dotIdx > 0 && dotIdx < candidate.length - 1) {
            return { target: candidate, targetType: 'filename', targetValidated: true };
        }
    }
    // 3. Bare extension (.ts, .json, .tsx)
    const extMatch = originalPrompt.match(/\b(\.(?:ts|tsx|js|jsx|json|md|css|scss|html|txt|yaml|yml|env))\b/i);
    if (extMatch?.[1]) {
        return { target: extMatch[1].toLowerCase(), targetType: 'extension', targetValidated: true };
    }
    // 4. Language name — only relevant for count/list (not for explain)
    if (intent === 'count' || intent === 'list' || intent === 'find') {
        const langMatch = originalPrompt.match(/\b(typescript|javascript|json|markdown|css|html|yaml|scss|python|rust|go)\b/i);
        if (langMatch?.[1]) {
            return { target: langMatch[1].toLowerCase(), targetType: 'language', targetValidated: true };
        }
    }
    // 5. Concept keyword — only for explain intent
    if (intent === 'explain') {
        // Strip question words and extract the most meaningful noun phrase
        const conceptClean = originalPrompt
            .replace(/^(?:why|how|what|explain|describe|tell me about)\s+/i, '')
            .replace(/\b(?:is|are|was|were|does|do|implemented|built|structured|work|works|designed|the|this|a|an)\b/gi, '')
            .replace(/\?/g, '')
            .trim();
        // Take first meaningful word(s)
        const conceptMatch = conceptClean.match(/([a-zA-Z][a-zA-Z0-9_\s]{1,30}?)(?:\s|$)/);
        const concept = conceptMatch?.[1]?.trim();
        if (concept && concept.length >= 2 && !ENGLISH_FILLER_BLOCKLIST.has(concept.toLowerCase())) {
            return { target: concept, targetType: 'concept', targetValidated: true };
        }
    }
    return { targetValidated: false };
}
/**
 * Extracts a scope path from patterns like:
 *   "in forge-desktop", "in apps/forge-desktop", "under packages/shared"
 */
function extractScopeToken(prompt) {
    const m = prompt.match(/\b(?:in|under|inside|within)\s+([a-zA-Z0-9_\-][a-zA-Z0-9_\-\/\.]*)/i);
    if (!m)
        return undefined;
    const candidate = m[1].trim();
    const lc = candidate.toLowerCase();
    if (lc === 'this' ||
        lc === 'the' ||
        lc === 'project' ||
        lc === 'workspace' ||
        lc === 'folder' ||
        lc === 'directory' ||
        lc === 'here') {
        return undefined;
    }
    return candidate;
}
/** Returns the ordinal position from words like "first", "2nd", "last". */
function extractOrdinal(prompt) {
    const lc = prompt.toLowerCase();
    for (const [word, pos] of Object.entries(ORDINAL_WORD_MAP)) {
        const re = new RegExp(`\\b${word}\\b`, 'i');
        if (re.test(lc))
            return pos;
    }
    return undefined;
}
// ---------------------------------------------------------------------------
// Intent resolution — PRECEDENCE ORDER matters
// ---------------------------------------------------------------------------
/**
 * Resolves the user's intent from the prompt.
 *
 * Precedence (high → low):
 *  1. Symbol sub-intents (references, imports, symbol find)
 *  2. COUNT — always beats 'explain' even if prompt contains 'how'
 *  3. LIST
 *  4. OPEN
 *  5. FIND
 *  6. EXPLAIN — only reached if nothing deterministic matched
 *  7. FIND (default fallback)
 */
function resolveIntent(lc, domain) {
    // 1. Symbol sub-intents (check before generic find)
    if (FIND_REFERENCES_PATTERNS.some((p) => p.test(lc)))
        return 'find_references';
    if (FIND_IMPORTS_PATTERNS.some((p) => p.test(lc)))
        return 'find_imports';
    if (domain === 'symbol' && FIND_SYMBOL_PATTERNS.some((p) => p.test(lc)))
        return 'find_symbol';
    // 2. Deterministic intents — MUST precede 'explain'
    //    "How many package.json files?" → COUNT, never CODE_EXPLAIN
    if (COUNT_PATTERNS.some((p) => p.test(lc)))
        return 'count';
    if (LIST_PATTERNS.some((p) => p.test(lc)))
        return 'list';
    if (OPEN_PATTERNS.some((p) => p.test(lc)))
        return 'open';
    if (FIND_PATTERNS.some((p) => p.test(lc)))
        return 'find';
    // 3. CODE_EXPLAIN — fallback only, reached after all deterministic paths fail
    if (EXPLAIN_PATTERNS.some((p) => p.test(lc)))
        return 'explain';
    return 'find';
}
// ---------------------------------------------------------------------------
// Confidence scoring
// ---------------------------------------------------------------------------
function computeConfidence(domain, intent, targetValidated) {
    if (domain === 'unknown')
        return 0.2;
    let score = 0.5;
    // Strong domain signals boost confidence
    if (domain === 'file' || domain === 'folder')
        score += 0.2;
    // Validated target further boosts confidence
    if (targetValidated)
        score += 0.2;
    // Count/open are unambiguous intents
    if (intent === 'count' || intent === 'open')
        score += 0.1;
    // CODE_EXPLAIN has inherently lower confidence (it's a fallback)
    if (intent === 'explain')
        score -= 0.1;
    return Math.min(1, Math.max(0.1, score));
}
/**
 * Derives the canonical execution mode from domain + intent.
 * This is what the router uses — not the raw intent string.
 */
function deriveExecutionMode(domain, intent) {
    const deterministicIntents = ['open', 'find', 'count', 'list'];
    const deterministicDomains = ['file', 'folder', 'workspace', 'active_file'];
    if (deterministicDomains.includes(domain) && deterministicIntents.includes(intent)) {
        return 'deterministic';
    }
    if (intent === 'explain') {
        return 'engineering-intelligence';
    }
    return 'pipeline';
}
// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------
class QueryNormalizationEngine {
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
    static normalize(prompt) {
        const originalPrompt = (prompt || '').trim();
        const lc = originalPrompt.toLowerCase();
        // ------------------------------------------------------------------
        // 1. Strip conversational prefix (shim — cleaning only, no routing logic)
        // ------------------------------------------------------------------
        const stripped = stripConversationalPrefix(originalPrompt);
        const strippedLc = stripped.toLowerCase();
        // ------------------------------------------------------------------
        // 2. Domain detection (order matters — most specific first)
        //    Use stripped prompt for domain detection to avoid misleading signals
        // ------------------------------------------------------------------
        let domain = 'unknown';
        if (looksLikeActiveFileDomain(strippedLc)) {
            domain = 'active_file';
        }
        else if (looksLikeFolderDomain(strippedLc)) {
            domain = 'folder';
        }
        else if (looksLikeSymbolDomain(strippedLc)) {
            domain = 'symbol';
        }
        else if (looksLikeFileDomain(lc)) {
            // Use original for file detection — filenames survive prefix stripping
            domain = 'file';
        }
        else if (/\b(workspace|project|codebase|repo(sitory)?)\b/i.test(lc)) {
            domain = 'workspace';
        }
        // If count/list intent is clear but domain is unknown, treat as workspace-level
        if (domain === 'unknown' &&
            (COUNT_PATTERNS.some((p) => p.test(lc)) || LIST_PATTERNS.some((p) => p.test(lc)))) {
            domain = 'workspace';
        }
        // ------------------------------------------------------------------
        // 3. Intent resolution — uses original lc so COUNT_PATTERNS fire on
        //    "how many" even when present in a conversational wrapper.
        //    Precedence: deterministic > explain (see resolveIntent docs).
        // ------------------------------------------------------------------
        const intent = resolveIntent(lc, domain);
        // ------------------------------------------------------------------
        // 4. Scope extraction ("in forge-desktop", "under packages/shared")
        // ------------------------------------------------------------------
        const scope = extractScopeToken(originalPrompt);
        // ------------------------------------------------------------------
        // 5. Target extraction — always from ORIGINAL prompt, intent-aware,
        //    with validation. Never returns an English filler word.
        // ------------------------------------------------------------------
        const { target, targetType, targetValidated } = extractAndValidateTarget(originalPrompt, intent, scope);
        // ------------------------------------------------------------------
        // 6. Ordinal extraction ("first", "last", "3rd")
        // ------------------------------------------------------------------
        const ordinal = extractOrdinal(originalPrompt);
        // ------------------------------------------------------------------
        // 7. Derive canonical execution mode from domain + intent
        // ------------------------------------------------------------------
        const executionMode = deriveExecutionMode(domain, intent);
        // ------------------------------------------------------------------
        // 8. Confidence
        // ------------------------------------------------------------------
        const confidence = computeConfidence(domain, intent, targetValidated);
        return {
            originalPrompt,
            domain,
            intent,
            target,
            targetType,
            targetValidated,
            executionMode,
            scope,
            ordinal,
            confidence,
        };
    }
    /**
     * Returns true when the normalized query should be handled deterministically
     * (i.e. without an LLM call).
     *
     * Sprint 87: Uses executionMode rather than raw domain+intent re-check.
     */
    static isDeterministic(q, confidenceThreshold = 0.4) {
        // Summarize/explain keyword guard
        const lc = (q.originalPrompt || '').toLowerCase();
        if (lc.includes('summarize'))
            return false;
        // Use the pre-computed executionMode — the canonical routing field
        return q.executionMode === 'deterministic' && q.confidence >= confidenceThreshold;
    }
    /**
     * Returns true when the prompt should use engineering intelligence retrieval
     * (SemanticContextRetriever + EngineeringIntelligenceEngine) before LLM.
     */
    static isCodeExplain(q) {
        return q.executionMode === 'engineering-intelligence';
    }
}
exports.QueryNormalizationEngine = QueryNormalizationEngine;
//# sourceMappingURL=query-normalization-engine.js.map