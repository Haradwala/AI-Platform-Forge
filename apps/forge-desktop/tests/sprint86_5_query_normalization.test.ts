import { describe, it, expect } from 'vitest';
import { QueryNormalizationEngine } from '../electron/main/ai/response/query-normalization-engine';
import { ResponseModeClassifier } from '../electron/main/ai/response/response-mode-classifier';

describe('Sprint 86.5 — QueryNormalizationEngine & ResponseModeClassifier', () => {
  const classifier = new ResponseModeClassifier();

  describe('1. COUNT_FILES Paraphrases (at least 8)', () => {
    const countFilesQueries = [
      'How many package.json files are there?',
      'How many package.json files do we have?',
      'Count the package.json files',
      'What is the number of package.json files?',
      'Give me the count of .ts files',
      'Tell me how many TypeScript files exist',
      "What's the total count of files?",
      'Number of package.json files',
    ];

    countFilesQueries.forEach((query) => {
      it(`normalizes correctly for: "${query}"`, () => {
        const norm = QueryNormalizationEngine.normalize(query);
        expect(norm.intent).toBe('count');
        expect(['file', 'workspace']).toContain(norm.domain);
        expect(norm.confidence).toBeGreaterThanOrEqual(0.4);
        expect(QueryNormalizationEngine.isDeterministic(norm)).toBe(true);

        const decision = classifier.classify(query);
        expect(decision.mode).toBe('deterministic');
        expect(decision.requiresLlm).toBe(false);
      });
    });
  });

  describe('2. FIND_FILES Paraphrases (at least 8)', () => {
    const findFilesQueries = [
      'Where are all the package.json files?',
      'Find package.json',
      'Locate package.json files',
      'Search for package.json',
      'Show me every package.json',
      'Find all files in forge-desktop',
      'Where is the package.json file?',
      'Find .ts files in apps/forge-desktop',
    ];

    findFilesQueries.forEach((query) => {
      it(`normalizes correctly for: "${query}"`, () => {
        const norm = QueryNormalizationEngine.normalize(query);
        expect(['find', 'list']).toContain(norm.intent);
        expect(norm.domain).toBe('file');
        expect(norm.confidence).toBeGreaterThanOrEqual(0.4);
        expect(QueryNormalizationEngine.isDeterministic(norm)).toBe(true);

        const decision = classifier.classify(query);
        expect(decision.mode).toBe('deterministic');
        expect(decision.requiresLlm).toBe(false);
      });
    });
  });

  describe('3. OPEN_FILE Paraphrases (at least 8)', () => {
    const openFileQueries = [
      'open package.json',
      'open the package.json',
      'open the file package.json',
      'view package.json',
      'read package.json',
      'inspect package.json',
      'open 1st package.json',
      'open the third file',
    ];

    openFileQueries.forEach((query) => {
      it(`normalizes correctly for: "${query}"`, () => {
        const norm = QueryNormalizationEngine.normalize(query);
        expect(norm.intent).toBe('open');
        expect(norm.domain).toBe('file');
        expect(norm.confidence).toBeGreaterThanOrEqual(0.4);
        expect(QueryNormalizationEngine.isDeterministic(norm)).toBe(true);

        const decision = classifier.classify(query);
        expect(decision.mode).toBe('deterministic');
        expect(decision.requiresLlm).toBe(false);
      });
    });
  });

  describe('4. COUNT_FOLDERS Paraphrases (at least 6)', () => {
    const countFoldersQueries = [
      'How many folders are in this project?',
      'Count all folders in forge-desktop',
      'What is the number of directories?',
      'How many directories do we have?',
      'Give me the total count of folders',
      'Tell me how many folders are in apps',
    ];

    countFoldersQueries.forEach((query) => {
      it(`normalizes correctly for: "${query}"`, () => {
        const norm = QueryNormalizationEngine.normalize(query);
        expect(norm.intent).toBe('count');
        expect(norm.domain).toBe('folder');
        expect(norm.confidence).toBeGreaterThanOrEqual(0.4);
        expect(QueryNormalizationEngine.isDeterministic(norm)).toBe(true);

        const decision = classifier.classify(query);
        expect(decision.mode).toBe('deterministic');
        expect(decision.requiresLlm).toBe(false);
      });
    });
  });

  describe('5. FIND_FOLDERS Paraphrases (at least 6)', () => {
    const findFoldersQueries = [
      'find all the folders in forge-desktop',
      'list folders',
      'show folders',
      'find folders named components',
      'where are the directories?',
      'locate folders inside apps',
    ];

    findFoldersQueries.forEach((query) => {
      it(`normalizes correctly for: "${query}"`, () => {
        const norm = QueryNormalizationEngine.normalize(query);
        expect(['find', 'list']).toContain(norm.intent);
        expect(norm.domain).toBe('folder');
        expect(norm.confidence).toBeGreaterThanOrEqual(0.4);
        expect(QueryNormalizationEngine.isDeterministic(norm)).toBe(true);

        const decision = classifier.classify(query);
        expect(decision.mode).toBe('deterministic');
        expect(decision.requiresLlm).toBe(false);
      });
    });
  });

  describe('6. Symbol & Reference Queries', () => {
    it('normalizes "Where is ResponseGenerationEngine used?" as find_references', () => {
      const norm = QueryNormalizationEngine.normalize('Where is ResponseGenerationEngine used?');
      expect(norm.intent).toBe('find_references');
      expect(QueryNormalizationEngine.isDeterministic(norm)).toBe(false);

      const decision = classifier.classify('Where is ResponseGenerationEngine used?');
      // Symbol / usage queries should require reasoning / LLM / code-intelligence
      expect(decision.requiresLlm).toBe(true);
    });

    it('normalizes "find class ResponseGenerationEngine" as find_symbol', () => {
      const norm = QueryNormalizationEngine.normalize('find class ResponseGenerationEngine');
      expect(norm.intent).toBe('find_symbol');
      expect(norm.domain).toBe('symbol');
      expect(QueryNormalizationEngine.isDeterministic(norm)).toBe(false);
    });

    it('normalizes "references to Button" as find_references', () => {
      const norm = QueryNormalizationEngine.normalize('references to Button');
      expect(norm.intent).toBe('find_references');
      expect(QueryNormalizationEngine.isDeterministic(norm)).toBe(false);
    });

    it('normalizes "what imports React" as find_imports', () => {
      const norm = QueryNormalizationEngine.normalize('what imports React');
      expect(norm.intent).toBe('find_imports');
      expect(QueryNormalizationEngine.isDeterministic(norm)).toBe(false);
    });
  });

  describe('7. Ambiguous & Conversational Prompts', () => {
    const ambiguousQueries = [
      'Explain how authentication works',
      'Refactor the database module',
      'Why is the build failing?',
      'How should we implement caching?',
    ];

    ambiguousQueries.forEach((query) => {
      it(`does NOT treat as deterministic: "${query}"`, () => {
        const norm = QueryNormalizationEngine.normalize(query);
        expect(QueryNormalizationEngine.isDeterministic(norm)).toBe(false);

        const decision = classifier.classify(query);
        expect(decision.mode).not.toBe('deterministic');
        expect(decision.requiresLlm).toBe(true);
      });
    });
  });

  describe('8. Target & Scope Extraction Details', () => {
    it('extracts filename and scope cleanly without natural-language filler', () => {
      const norm = QueryNormalizationEngine.normalize(
        'Where are all the package.json files in apps/forge-desktop?'
      );
      expect(norm.target).toBe('package.json');
      expect(norm.scope).toBe('apps/forge-desktop');
    });

    it('extracts ordinal cleanly', () => {
      const norm1 = QueryNormalizationEngine.normalize('open 1st package.json');
      expect(norm1.ordinal).toBe(1);

      const norm2 = QueryNormalizationEngine.normalize('open the third file');
      expect(norm2.ordinal).toBe(3);

      const norm3 = QueryNormalizationEngine.normalize('open the last file');
      expect(norm3.ordinal).toBe(-1);
    });
  });
});
