import { describe, it, expect, vi } from 'vitest';
import { ActiveFileGroundingService } from '../electron/main/ai/response/active-file-grounding';
import { ResponseContextBuilder } from '../electron/main/ai/response/response-context-builder';
import { ResponseModeClassifier } from '../electron/main/ai/response/response-mode-classifier';
import { ResponseGenerationEngine } from '../electron/main/ai/response/response-generation-engine';
import { PipelineContextHelper } from '../electron/main/ai/pipeline/pipeline-context';
import type { IWorkspaceService, IDesktopLogger, IDesktopEventBus } from '../electron/main/container/service-interfaces';

describe('Sprint 85 Wave 3 Enhanced — Unit Tests', () => {

  // ── Part A: Active File Grounding ──────────────────────────────────────────

  describe('ActiveFileGroundingService', () => {
    it('returns null if no activeFilePath is provided', async () => {
      const mockWs: Partial<IWorkspaceService> = {
        readFile: vi.fn().mockResolvedValue('{"name":"test"}'),
      };
      const service = new ActiveFileGroundingService(mockWs as IWorkspaceService);

      const result = await service.tryGround(null, 'What are the main dependencies?');
      expect(result).toBeNull();
      expect(mockWs.readFile).not.toHaveBeenCalled();
    });

    it('returns FileContentFact for follow-up questions when activeFilePath is present', async () => {
      const mockWs: Partial<IWorkspaceService> = {
        readFile: vi.fn().mockResolvedValue('{"dependencies": {"express": "^4.0.0"}}'),
      };
      const service = new ActiveFileGroundingService(mockWs as IWorkspaceService);

      const result = await service.tryGround('package.json', 'What are the main dependencies?');
      expect(result).not.toBeNull();
      expect(result?.kind).toBe('file_content');
      expect(result?.path).toBe('package.json');
      expect(result?.content).toContain('express');
      expect(mockWs.readFile).toHaveBeenCalledWith('package.json');
    });

    it('handles pronoun-style follow-up prompts ("list them", "show them", "what are those")', async () => {
      const mockWs: Partial<IWorkspaceService> = {
        readFile: vi.fn().mockResolvedValue('{"scripts": {"build": "tsc"}}'),
      };
      const service = new ActiveFileGroundingService(mockWs as IWorkspaceService);

      const prompts = ['list them', 'show them', 'what are those', 'explain these dependencies'];
      for (const prompt of prompts) {
        const result = await service.tryGround('package.json', prompt);
        expect(result).not.toBeNull();
        expect(result?.kind).toBe('file_content');
      }
    });

    it('skips grounding for action commands', async () => {
      const mockWs: Partial<IWorkspaceService> = {
        readFile: vi.fn().mockResolvedValue('content'),
      };
      const service = new ActiveFileGroundingService(mockWs as IWorkspaceService);

      const result = await service.tryGround('package.json', 'open src/main.ts');
      expect(result).toBeNull();
      expect(mockWs.readFile).not.toHaveBeenCalled();
    });
  });

  // ── ResponseContextBuilder Active File Fact Integration ────────────────────

  describe('ResponseContextBuilder Active File Merging', () => {
    it('merges active file fact into groundedContext when provided', () => {
      const builder = new ResponseContextBuilder();
      const ctx = PipelineContextHelper.create('req1', 'What dependencies?', '/test');

      const activeFact = {
        kind: 'file_content' as const,
        path: 'package.json',
        content: '{"dependencies":{}}',
      };

      const req = builder.build(ctx, 'What dependencies?', activeFact);
      expect(req.groundedContext).toBeDefined();
      expect(req.groundedContext?.knowledgeFacts).toContainEqual(activeFact);
    });
  });

  // ── Part C: Model Routing Classifier ───────────────────────────────────────

  describe('ResponseModeClassifier suggestedRuntime', () => {
    it('returns deterministic tier for action commands', () => {
      const classifier = new ResponseModeClassifier();
      const decision = classifier.classify('open package.json');
      expect(decision.mode).toBe('deterministic');
      expect(decision.requiresLlm).toBe(false);
      expect(decision.suggestedRuntime).toBe('deterministic');
    });

    it('returns lightweight tier for summarization commands', () => {
      const classifier = new ResponseModeClassifier();
      const decision = classifier.classify('summarize this file');
      expect(decision.mode).toBe('summarization');
      expect(decision.requiresLlm).toBe(true);
      expect(decision.suggestedRuntime).toBe('lightweight');
    });

    it('returns reasoning tier for conversation commands', () => {
      const classifier = new ResponseModeClassifier();
      const decision = classifier.classify('How should I refactor the auth system?');
      expect(decision.mode).toBe('conversation');
      expect(decision.requiresLlm).toBe(true);
      expect(decision.suggestedRuntime).toBe('reasoning');
    });
  });

  // ── Part D: Streaming UX Phase Events ──────────────────────────────────────

  describe('ResponseGenerationEngine Phase Events', () => {
    it('emits response:phase.changed events during LLM generation', async () => {
      const emittedEvents: Array<{ topic: string; payload: any }> = [];
      const mockEventBus: Partial<IDesktopEventBus> = {
        emit: (topic: string, payload: any) => {
          emittedEvents.push({ topic, payload });
        },
      };

      const mockLogger: Partial<IDesktopLogger> = {
        info: vi.fn(),
        warn: vi.fn(),
        error: vi.fn(),
        debug: vi.fn(),
      };

      const mockRuntimeManager = {
        register: vi.fn(),
        getById: vi.fn(),
        getAll: vi.fn(),
        activate: vi.fn(),
        active: vi.fn().mockReturnValue({
          id: 'test-runtime',
          name: 'Test Model',
          generateStream: async () => ({
            onToken: (cb: Function) => { cb('Hello '); return { onComplete: (cb2: Function) => { cb2('Hello world'); return { onError: () => {} }; } }; },
          }),
        }),
        discover: vi.fn(),
        health: vi.fn(),
        list: vi.fn(),
      };

      const engine = new ResponseGenerationEngine(
        mockRuntimeManager as any,
        mockEventBus as IDesktopEventBus,
        mockLogger as IDesktopLogger
      );

      const request = {
        userPrompt: 'Explain quantum computing',
        workspace: { root: '/test' },
        execution: { success: true, goal: 'Explain' },
        verification: { success: true },
        reflection: { recommendations: [] },
        context: { summary: '' },
      };

      const result = await engine.generate(request);
      expect(result.text).toBe('Hello world');

      const phaseEvents = emittedEvents.filter((e) => e.topic === 'response:phase.changed');
      expect(phaseEvents.map((e) => e.payload.phase)).toEqual([
        'classifying',
        'assembling',
        'generating',
        'complete',
      ]);
    });
  });
});
