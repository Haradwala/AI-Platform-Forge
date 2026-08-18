import { describe, it, expect, vi } from 'vitest';
import { ResponseModeClassifier } from '../electron/main/ai/response/response-mode-classifier';
import { ResponseTemplates } from '../electron/main/ai/response/response-templates';
import { ResponseGenerationEngine } from '../electron/main/ai/response/response-generation-engine';
import type { ResponseRequest } from '../electron/main/ai/response/response-types';

describe('Sprint 85 Wave 1 — Safe Performance Patch', () => {
  describe('1. ResponseModeClassifier', () => {
    const classifier = new ResponseModeClassifier();

    it('classifies "open *" as deterministic with requiresLlm = false', () => {
      const res1 = classifier.classify('Open package.json');
      expect(res1.mode).toBe('deterministic');
      expect(res1.requiresLlm).toBe(false);

      const res2 = classifier.classify('open the second file');
      expect(res2.mode).toBe('deterministic');
      expect(res2.requiresLlm).toBe(false);
    });

    it('classifies "find *" as deterministic with requiresLlm = false', () => {
      const res = classifier.classify('Find package.json');
      expect(res.mode).toBe('deterministic');
      expect(res.requiresLlm).toBe(false);
    });

    it('classifies "delete *" and "rename *" as deterministic with requiresLlm = false', () => {
      expect(classifier.classify('delete temp.txt')).toEqual({ mode: 'deterministic', requiresLlm: false, suggestedRuntime: 'deterministic' });
      expect(classifier.classify('rename file.ts file.tsx')).toEqual({ mode: 'deterministic', requiresLlm: false, suggestedRuntime: 'deterministic' });
    });

    it('classifies prompts with "summarize" or "explain" as summarization with requiresLlm = true', () => {
      const res1 = classifier.classify('Explain the second one');
      expect(res1.mode).toBe('summarization');
      expect(res1.requiresLlm).toBe(true);

      const res2 = classifier.classify('Summarize package.json');
      expect(res2.mode).toBe('summarization');
      expect(res2.requiresLlm).toBe(true);
    });

    it('classifies general prompts as conversation with requiresLlm = true', () => {
      const res = classifier.classify('Hello, write a quick sort function');
      expect(res.mode).toBe('conversation');
      expect(res.requiresLlm).toBe(true);
    });
  });

  describe('2. Fast Response Templates', () => {
    it('produces correct string for opened(path)', () => {
      expect(ResponseTemplates.opened('package.json')).toBe('Opened package.json');
    });

    it('produces correct string for found(count, query)', () => {
      expect(ResponseTemplates.found(4, 'package.json')).toBe('Found 4 matches for "package.json".');
    });
  });

  describe('3. ResponseGenerationEngine Deterministic & Telemetry', () => {
    it('skips LLM and returns instant deterministic response for "Open package.json"', async () => {
      const mockRuntimeManager: any = {
        active: vi.fn(),
        resolveFallbackRuntime: vi.fn(),
      };
      const mockLogger: any = {
        info: vi.fn(),
        warn: vi.fn(),
      };

      const engine = new ResponseGenerationEngine(mockRuntimeManager, undefined, mockLogger);

      const request: ResponseRequest = {
        userPrompt: 'Open package.json',
        workspace: { root: '/root' },
        execution: { success: true, goal: 'OPEN_FILE' },
        verification: { success: true },
        reflection: { recommendations: [] },
        context: { summary: '' },
      };

      const result = await engine.generate(request);

      expect(result.text).toBe('Opened package.json');
      expect(result.metadata.runtime).toBe('deterministic');
      expect(result.metadata.durationMs).toBe(0);
      expect(mockRuntimeManager.active).not.toHaveBeenCalled();
      expect(mockRuntimeManager.resolveFallbackRuntime).not.toHaveBeenCalled();
    });

    it('logs prompt telemetry before invoking LLM for non-deterministic prompts', async () => {
      const mockStream: any = {
        onToken: (cb: any) => mockStream,
        onComplete: (cb: any) => { cb('Sample LLM explanation text.'); return mockStream; },
        onError: (cb: any) => mockStream,
      };

      const mockRuntime: any = {
        id: 'ollama',
        name: 'Ollama (Local LLM)',
        generateStream: vi.fn().mockResolvedValue(mockStream),
      };

      const mockRuntimeManager: any = {
        active: vi.fn().mockReturnValue(mockRuntime),
        resolveFallbackRuntime: vi.fn().mockResolvedValue(mockRuntime),
      };

      const mockLogger: any = {
        info: vi.fn(),
        warn: vi.fn(),
      };

      const engine = new ResponseGenerationEngine(mockRuntimeManager, undefined, mockLogger);

      const request: ResponseRequest = {
        userPrompt: 'Explain the second one',
        workspace: { root: '/root' },
        execution: { success: true, goal: 'EXPLAIN' },
        verification: { success: true },
        reflection: { recommendations: [] },
        context: { summary: 'Some context' },
      };

      const result = await engine.generate(request);

      expect(result.text).toBe('Sample LLM explanation text.');
      expect(mockLogger.info).toHaveBeenCalledWith(
        expect.stringContaining('[ResponseGenerationEngine] Prompt telemetry:')
      );
    });
  });
});
