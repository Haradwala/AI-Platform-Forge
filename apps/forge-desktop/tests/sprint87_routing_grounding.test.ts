import { describe, it, expect } from 'vitest';
import { QueryNormalizationEngine } from '../electron/main/ai/response/query-normalization-engine';
import { FileQueryNormalizer } from '../electron/main/ai/response/file-query-normalizer';

describe('Sprint 87: Routing & Grounding Repair Matrix (A–E)', () => {
  // ── Test A: Deterministic file recognition ─────────────────────────────────
  describe('Test A: Deterministic Recognition', () => {
    it('normalizes "How many package.json files are there?" to count intent and package.json target', () => {
      const q = QueryNormalizationEngine.normalize('How many package.json files are there?');
      expect(q.intent).toBe('count');
      expect(q.domain).toBe('file');
      expect(q.target).toBe('package.json');
      expect(q.targetValidated).toBe(true);
      expect(q.executionMode).toBe('deterministic');
      expect(QueryNormalizationEngine.isDeterministic(q)).toBe(true);

      const fq = FileQueryNormalizer.normalize('How many package.json files are there?');
      expect(fq.intent).toBe('count');
      expect(fq.basename).toBe('package.json');
    });
  });

  // ── Test B1 & B2: Conversational prefix extraction (Bug B) ─────────────────
  describe('Test B: Conversational Wrappers', () => {
    it('B1: "Can you tell me how many package.json files we have?" produces identical count+package.json', () => {
      const q = QueryNormalizationEngine.normalize('Can you tell me how many package.json files we have?');
      expect(q.intent).toBe('count');
      expect(q.target).toBe('package.json');
      expect(q.target).not.toBe('Can');
      expect(q.targetValidated).toBe(true);
      expect(q.executionMode).toBe('deterministic');

      const fq = FileQueryNormalizer.normalize('Can you tell me how many package.json files we have?');
      expect(fq.intent).toBe('count');
      expect(fq.basename).toBe('package.json');
      expect(fq.basename).not.toBe('Can');
    });

    it('B2: "Can you open package.json?" produces open+package.json without target="Can"', () => {
      const q = QueryNormalizationEngine.normalize('Can you open package.json?');
      expect(q.intent).toBe('open');
      expect(q.target).toBe('package.json');
      expect(q.target).not.toBe('Can');
      expect(q.targetValidated).toBe(true);
      expect(q.executionMode).toBe('deterministic');

      const fq = FileQueryNormalizer.normalize('Can you open package.json?');
      expect(fq.intent).toBe('open');
      expect(fq.basename).toBe('package.json');
      expect(fq.basename).not.toBe('Can');
    });

    it('B3: "Could you please find tsconfig.json?" extracts tsconfig.json', () => {
      const q = QueryNormalizationEngine.normalize('Could you please find tsconfig.json?');
      expect(q.intent).toBe('find');
      expect(q.target).toBe('tsconfig.json');
      expect(q.targetValidated).toBe(true);
      expect(q.target).not.toBe('Could');
    });
  });

  // ── Test C: Where/locate extraction (Bug C) ────────────────────────────────
  describe('Test C: Locational Questions', () => {
    it('C1: "Where are all the package.json files?" extracts target="package.json", NOT "Where"', () => {
      const q = QueryNormalizationEngine.normalize('Where are all the package.json files?');
      expect(q.intent).toBe('find');
      expect(q.target).toBe('package.json');
      expect(q.target).not.toBe('Where');
      expect(q.targetValidated).toBe(true);
      expect(q.executionMode).toBe('deterministic');

      const fq = FileQueryNormalizer.normalize('Where are all the package.json files?');
      expect(fq.intent).toBe('find');
      expect(fq.basename).toBe('package.json');
      expect(fq.basename).not.toBe('Where');
    });

    it('C2: "Where is the README.md?" extracts target="README.md"', () => {
      const q = QueryNormalizationEngine.normalize('Where is the README.md?');
      expect(q.intent).toBe('find');
      expect(q.target).toBe('README.md');
      expect(q.targetValidated).toBe(true);
      expect(q.target).not.toBe('Where');
    });
  });

  // ── Test D: Source-scoped extensions & Ordinals ─────────────────────────────
  describe('Test D: Extensions and Two-Turn Ordinal Resolution', () => {
    it('D1: "How many TypeScript files are there?" extracts language="typescript"', () => {
      const q = QueryNormalizationEngine.normalize('How many TypeScript files are there?');
      expect(q.intent).toBe('count');
      expect(q.target).toBe('typescript');
      expect(q.targetType).toBe('language');
      expect(q.executionMode).toBe('deterministic');

      const fq = FileQueryNormalizer.normalize('How many TypeScript files are there?');
      expect(fq.intent).toBe('count');
      expect(fq.language).toBe('typescript');
      expect(fq.extension).toBe('.ts,.tsx');
    });

    it('D2: "Open the second one." resolves ordinal 2', () => {
      const q = QueryNormalizationEngine.normalize('Open the second one.');
      expect(q.intent).toBe('open');
      expect(q.ordinal).toBe(2);
    });

    it('D3: "Show me the last one" resolves ordinal -1', () => {
      const q = QueryNormalizationEngine.normalize('Show me the last one');
      expect(q.ordinal).toBe(-1);
    });
  });

  // ── Test E: CODE_EXPLAIN routing & precedence ──────────────────────────────
  describe('Test E: CODE_EXPLAIN Fallback and Precedence', () => {
    it('E1: "Why is authentication implemented this way?" routes to explain intent', () => {
      const q = QueryNormalizationEngine.normalize('Why is authentication implemented this way?');
      expect(q.intent).toBe('explain');
      expect(q.executionMode).toBe('engineering-intelligence');
      expect(QueryNormalizationEngine.isCodeExplain(q)).toBe(true);
      expect(QueryNormalizationEngine.isDeterministic(q)).toBe(false);
    });

    it('E2: "How is caching structured in this repo?" routes to explain intent', () => {
      const q = QueryNormalizationEngine.normalize('How is caching structured in this repo?');
      expect(q.intent).toBe('explain');
      expect(q.executionMode).toBe('engineering-intelligence');
      expect(QueryNormalizationEngine.isCodeExplain(q)).toBe(true);
    });

    it('E3: Deterministic intent takes precedence: "How many package.json files are there?" is count, NEVER explain', () => {
      const q = QueryNormalizationEngine.normalize('How many package.json files are there?');
      expect(q.intent).toBe('count');
      expect(q.intent).not.toBe('explain');
      expect(q.executionMode).toBe('deterministic');
      expect(QueryNormalizationEngine.isCodeExplain(q)).toBe(false);
    });

    it('E4: "How many files are in forge-desktop?" is count, NEVER explain', () => {
      const q = QueryNormalizationEngine.normalize('How many files are in forge-desktop?');
      expect(q.intent).toBe('count');
      expect(q.intent).not.toBe('explain');
      expect(q.executionMode).toBe('deterministic');
      expect(QueryNormalizationEngine.isCodeExplain(q)).toBe(false);
    });
  });
});
