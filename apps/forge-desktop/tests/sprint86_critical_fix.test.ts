import { describe, it, expect, beforeEach } from 'vitest';
import { FileQueryNormalizer, FolderQueryNormalizer } from '../electron/main/ai/response/file-query-normalizer';
import { ResponseModeClassifier } from '../electron/main/ai/response/response-mode-classifier';
import { AiOrchestrator } from '../electron/main/ai/orchestrator/ai-orchestrator';
import { ContextResolutionService } from '../electron/main/ai/memory/resolution/context-resolution-service';
import { SessionContextManager } from '../electron/main/ai/session/session-context-manager';
import * as path from 'path';

describe('Sprint 86 Critical Fix — File Resolution & Deterministic Workspace Queries', () => {
  // ── 1. File Query Normalizer Tests ──────────────────────────────────────────
  describe('1. FileQueryNormalizer', () => {
    it('normalizes "open package.json"', () => {
      const q = FileQueryNormalizer.normalize('open package.json');
      expect(q.intent).toBe('open');
      expect(q.basename).toBe('package.json');
      expect(q.relativePath).toBeUndefined();
    });

    it('normalizes "open the package.json"', () => {
      const q = FileQueryNormalizer.normalize('open the package.json');
      expect(q.intent).toBe('open');
      expect(q.basename).toBe('package.json');
    });

    it('normalizes "open the file package.json"', () => {
      const q = FileQueryNormalizer.normalize('open the file package.json');
      expect(q.intent).toBe('open');
      expect(q.basename).toBe('package.json');
    });

    it('normalizes exact relative path "open apps/forge-desktop/package.json"', () => {
      const q = FileQueryNormalizer.normalize('open apps/forge-desktop/package.json');
      expect(q.intent).toBe('open');
      expect(q.relativePath).toBe('apps/forge-desktop/package.json');
      expect(q.basename).toBe('package.json');
    });

    it('normalizes "find all package.json files"', () => {
      const q = FileQueryNormalizer.normalize('find all package.json files');
      expect(q.intent).toBe('find');
      expect(q.basename).toBe('package.json');
    });

    it('normalizes "how many package.json files are there?"', () => {
      const q = FileQueryNormalizer.normalize('how many package.json files are there?');
      expect(q.intent).toBe('count');
      expect(q.basename).toBe('package.json');
    });

    it('normalizes "how many TypeScript files are there?"', () => {
      const q = FileQueryNormalizer.normalize('how many TypeScript files are there?');
      expect(q.intent).toBe('count');
      expect(q.language).toBe('typescript');
    });

    it('normalizes "how many files are present in this project?"', () => {
      const q = FileQueryNormalizer.normalize('how many files are present in this project?');
      expect(q.intent).toBe('count');
      expect(q.isAllFiles).toBe(true);
    });
  });

  // ── 2. Response Mode Classifier Tests ──────────────────────────────────────
  describe('2. ResponseModeClassifier', () => {
    let classifier: ResponseModeClassifier;

    beforeEach(() => {
      classifier = new ResponseModeClassifier();
    });

    it('classifies "open package.json" as deterministic without LLM', () => {
      const res = classifier.classify('open package.json');
      expect(res.requiresLlm).toBe(false);
      expect(res.mode).toBe('deterministic');
    });

    it('classifies "open the package.json" as deterministic without LLM', () => {
      const res = classifier.classify('open the package.json');
      expect(res.requiresLlm).toBe(false);
      expect(res.mode).toBe('deterministic');
    });

    it('classifies "how many package.json files are there?" as deterministic without LLM', () => {
      const res = classifier.classify('how many package.json files are there?');
      expect(res.requiresLlm).toBe(false);
      expect(res.mode).toBe('deterministic');
    });

    it('classifies ordinal "open the third one" as deterministic', () => {
      const res = classifier.classify('open the third one');
      expect(res.requiresLlm).toBe(false);
      expect(res.mode).toBe('deterministic');
    });
  });

  // ── 3. Orchestrator End-to-End File Resolution & Deterministic Queries ─────
  describe('3. Orchestrator & Resolution Integration', () => {
    let orchestrator: AiOrchestrator;
    let mockWorkspaceService: any;
    let mockRepo: any;

    const mockWorkspaceFiles = [
      'apps/forge-cli/package.json',
      'apps/forge-desktop/package.json',
      'package.json',
      'packages/shared/package.json',
      'apps/forge-desktop/electron/main/index.ts',
      'apps/forge-desktop/electron/main/startup-manager.ts',
    ];

    beforeEach(() => {
      const mockEventBus = { emit: () => {}, on: () => {} };
      mockWorkspaceService = {
        getRootPath: () => path.resolve(__dirname, '../..'),
        readFile: async (p: string) => `content of ${p}`,
        eventBus: mockEventBus,
      };

      mockRepo = {
        query: async (req: any) => {
          if (req.type === 'findFile') {
            const q = (req.query || '').toLowerCase();
            const matched = mockWorkspaceFiles.filter((f) => !q || f.toLowerCase().includes(q));
            return { success: true, data: matched };
          }
          if (req.type === 'findFilesByLanguage') {
            const matched = mockWorkspaceFiles.filter((f) => f.endsWith('.ts'));
            return { success: true, data: matched };
          }
          if (req.type === 'workspaceStatistics') {
            return { success: true, data: { filesCount: mockWorkspaceFiles.length } };
          }
          return { success: true, data: [] };
        },
      };

      const mockLogger = { info: () => {}, warn: () => {}, error: () => {} };
      const sessionManager = new SessionContextManager();
      const resolutionService = new ContextResolutionService();

      orchestrator = new AiOrchestrator(
        {} as any,
        {} as any,
        mockRepo,
        { classifyIntent: () => ({ goal: 'SEARCH' }) } as any,
        {} as any,
        { classifyIntent: () => ({ type: 'general_task', goal: 'SEARCH' }) } as any,
        {} as any,
        {} as any,
        {} as any,
        {} as any,
        {} as any,
        {} as any,
        {} as any,
        {} as any,
        {} as any,
        { execute: async (ctx: any) => ctx } as any,
        { record: async () => {} } as any,
        mockWorkspaceService,
        mockLogger as any,
        { generate: async () => ({ text: 'Response', metadata: {} }) } as any,
        sessionManager,
        resolutionService
      );
    });

    it('ambiguous package.json returns 4 candidates without guessing', async () => {
      const res = await orchestrator.executeRequest({
        id: 'req_ambiguous',
        prompt: 'open package.json',
      });

      expect(res.success).toBe(true);
      expect(res.result.response).toContain('Multiple matching files found');
      expect(res.result.response).toContain('apps/forge-cli/package.json');
      expect(res.result.response).toContain('apps/forge-desktop/package.json');
      expect(res.result.response).toContain('package.json');
      expect(res.result.response).toContain('packages/shared/package.json');
      expect(res.result.metadata.timing.fastPathUsed).toBe(true);
    });

    it('open the package.json cleans "the" and returns 4 candidates', async () => {
      const res = await orchestrator.executeRequest({
        id: 'req_the_pkg',
        prompt: 'open the package.json',
      });

      expect(res.success).toBe(true);
      expect(res.result.response).not.toContain('the package.json');
      expect(res.result.response).toContain('Multiple matching files found');
    });

    it('how many package.json files are there? returns 4 deterministically', async () => {
      const res = await orchestrator.executeRequest({
        id: 'req_count_pkg',
        prompt: 'how many package.json files are there?',
      });

      expect(res.success).toBe(true);
      expect(res.result.response).toContain('There are 4 package.json files');
      expect(res.result.metadata.timing.fastPathUsed).toBe(true);
    });

    it('Find package.json -> open the third one resolves ordinal context correctly', async () => {
      // Turn 1: Find package.json
      await orchestrator.executeRequest({
        id: 'req_find_1',
        prompt: 'Find package.json',
      });

      // Turn 2: open the third one
      const res2 = await orchestrator.executeRequest({
        id: 'req_open_3rd',
        prompt: 'open the third one',
      });

      expect(res2.success).toBe(true);
      expect(res2.result.response).toContain('Opened package.json');
    });

    it('Find package.json -> open the last one resolves last candidate', async () => {
      await orchestrator.executeRequest({
        id: 'req_find_2',
        prompt: 'Find package.json',
      });

      const res2 = await orchestrator.executeRequest({
        id: 'req_open_last',
        prompt: 'open the last one',
      });

      expect(res2.success).toBe(true);
      expect(res2.result.response).toContain('Opened packages/shared/package.json');
    });

    it('exact relative path opens target directly', async () => {
      const res = await orchestrator.executeRequest({
        id: 'req_exact_path',
        prompt: 'open apps/forge-desktop/package.json',
      });

      expect(res.success).toBe(true);
      expect(res.result.response).toContain('Opened apps/forge-desktop/package.json');
    });

    it('invalid open path reports failure, not false success', async () => {
      const res = await orchestrator.executeRequest({
        id: 'req_invalid_path',
        prompt: 'open non_existent_file.ts',
      });

      expect(res.success).toBe(true);
      expect(res.result.response).toContain('Failed to open file');
      expect(res.result.response).toContain('does not exist');
    });

    it('zero-match file query returns clean no match message', async () => {
      const res = await orchestrator.executeRequest({
        id: 'req_zero_match',
        prompt: 'find non_existent_file.ts',
      });

      expect(res.success).toBe(true);
      expect(res.result.response).toContain('No matching files found');
    });

    it('how many files are present in this project? returns total count fast', async () => {
      const res = await orchestrator.executeRequest({
        id: 'req_total_stats',
        prompt: 'how many files are present in this project?',
      });

      expect(res.success).toBe(true);
      expect(res.result.response).toContain('There are 6 files in this workspace');
    });

    // ── 4. Workspace Folder Query Deterministic Fast-Path Tests ───────────────
    it('FolderQueryNormalizer parses "find all the folders in forge-desktop"', () => {
      const q = FolderQueryNormalizer.normalize('find all the folders in forge-desktop');
      expect(q.isFolderQuery).toBe(true);
      expect(q.intent).toBe('find');
      expect(q.inDirectory).toBe('forge-desktop');
    });

    it('FolderQueryNormalizer parses "how many folders are in forge-desktop?"', () => {
      const q = FolderQueryNormalizer.normalize('how many folders are in forge-desktop?');
      expect(q.isFolderQuery).toBe(true);
      expect(q.intent).toBe('count');
      expect(q.inDirectory).toBe('forge-desktop');
    });

    it('FolderQueryNormalizer parses "find folders named components"', () => {
      const q = FolderQueryNormalizer.normalize('find folders named components');
      expect(q.isFolderQuery).toBe(true);
      expect(q.intent).toBe('find');
      expect(q.folderName).toBe('components');
    });

    it('ResponseModeClassifier classifies folder query as deterministic without LLM', () => {
      const classifier = new ResponseModeClassifier();
      const res = classifier.classify('find all the folders in forge-desktop');
      expect(res.requiresLlm).toBe(false);
      expect(res.mode).toBe('deterministic');
    });

    it('AiOrchestrator resolves "find all the folders in forge-desktop" deterministically', async () => {
      const res = await orchestrator.executeRequest({
        id: 'req_find_folders',
        prompt: 'find all the folders in forge-desktop',
      });

      expect(res.success).toBe(true);
      expect(res.result.response).toContain('folder(s) in forge-desktop');
      expect(res.result.response).toContain('apps/forge-desktop');
      expect(res.result.metadata.timing.fastPathUsed).toBe(true);
    });

    it('AiOrchestrator resolves "how many folders are in forge-desktop?" deterministically', async () => {
      const res = await orchestrator.executeRequest({
        id: 'req_count_folders',
        prompt: 'how many folders are in forge-desktop?',
      });

      expect(res.success).toBe(true);
      expect(res.result.response).toContain('folder(s) in forge-desktop');
      expect(res.result.metadata.timing.fastPathUsed).toBe(true);
    });

    it('AiOrchestrator resolves "find folders named main" deterministically', async () => {
      const res = await orchestrator.executeRequest({
        id: 'req_name_folders',
        prompt: 'find folders named main',
      });

      expect(res.success).toBe(true);
      expect(res.result.response).toContain('folder(s) named "main"');
      expect(res.result.metadata.timing.fastPathUsed).toBe(true);
    });
  });
});
