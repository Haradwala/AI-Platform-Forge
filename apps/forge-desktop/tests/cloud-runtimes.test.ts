/**
 * cloud-runtimes.test.ts
 *
 * Tests for all five cloud runtime implementations.
 * All HTTP calls are mocked via vi.stubGlobal — no real network requests.
 * Uses mock filesystem for ConfigurationService testing.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { OpenAIRuntime } from '../electron/main/ai/runtime/cloud/openai-runtime';
import { AnthropicRuntime } from '../electron/main/ai/runtime/cloud/anthropic-runtime';
import { GeminiRuntime } from '../electron/main/ai/runtime/cloud/gemini-runtime';
import { GroqRuntime } from '../electron/main/ai/runtime/cloud/groq-runtime';
import { OpenRouterRuntime } from '../electron/main/ai/runtime/cloud/openrouter-runtime';
import {
  readSSELines,
  extractOpenAIToken,
  extractAnthropicToken,
  extractGeminiToken,
} from '../electron/main/ai/runtime/cloud/cloud-helpers';
import { ConfigurationService } from '../electron/main/config/configuration-service';
import type { IFileSystem } from '../electron/main/config/configuration-loader';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function createMockFs(files: Record<string, string> = {}): IFileSystem {
  const fileStore = { ...files };
  return {
    existsSync(p: string) { return Object.prototype.hasOwnProperty.call(fileStore, p); },
    readFileSync(p: string) { return fileStore[p] ?? ''; },
    writeFileSync(p: string, c: string) { fileStore[p] = c; },
    mkdirSync() {},
  };
}

function createTestConfigService(apiKeyMap: Record<string, string> = {}): ConfigurationService {
  const fs = createMockFs();
  const svc = new ConfigurationService('/mock/config.json', fs);
  for (const [pId, key] of Object.entries(apiKeyMap)) {
    svc.setProvider(pId, { apiKey: key });
  }
  return svc;
}

/** Builds a fake ReadableStream from an array of text chunks. */
function makeBodyStream(...chunks: string[]): ReadableStream<Uint8Array> {
  const encoder = new TextEncoder();
  return new ReadableStream({
    start(controller) {
      for (const chunk of chunks) {
        controller.enqueue(encoder.encode(chunk));
      }
      controller.close();
    },
  });
}

/** Builds a mock Response with a streaming body. */
function mockStreamResponse(lines: string[], status = 200): Response {
  return new Response(makeBodyStream(lines.join('\n') + '\n'), { status });
}

/** Builds a mock JSON Response. */
function mockJsonResponse(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

/** Reads all tokens emitted by a stream, resolves with { tokens, fullText }. */
function collectStream(
  streamPromise: Promise<{ onToken: any; onComplete: any; onError: any }>
): Promise<{ tokens: string[]; fullText: string }> {
  return new Promise((resolve, reject) => {
    streamPromise.then((stream: any) => {
      const tokens: string[] = [];
      stream.onToken((t: string) => tokens.push(t));
      stream.onComplete((text: string) => resolve({ tokens, fullText: text }));
      stream.onError((err: Error) => reject(err));
    });
  });
}

// ─── Token Extractors (unit tests) ───────────────────────────────────────────

describe('Token Extractors', () => {
  describe('extractOpenAIToken()', () => {
    it('extracts content from a delta chunk', () => {
      const data = JSON.stringify({ choices: [{ delta: { content: 'Hello' } }] });
      expect(extractOpenAIToken(data)).toBe('Hello');
    });

    it('returns null for [DONE]', () => {
      expect(extractOpenAIToken('[DONE]')).toBeNull();
    });

    it('returns null for empty delta', () => {
      const data = JSON.stringify({ choices: [{ delta: {} }] });
      expect(extractOpenAIToken(data)).toBeNull();
    });

    it('returns null for malformed JSON', () => {
      expect(extractOpenAIToken('not-json')).toBeNull();
    });
  });

  describe('extractAnthropicToken()', () => {
    it('extracts text from content_block_delta', () => {
      const data = JSON.stringify({
        type: 'content_block_delta',
        delta: { type: 'text_delta', text: 'World' },
      });
      expect(extractAnthropicToken(data)).toBe('World');
    });

    it('returns null for non-text-delta events', () => {
      const data = JSON.stringify({ type: 'message_start', message: {} });
      expect(extractAnthropicToken(data)).toBeNull();
    });

    it('returns null for malformed JSON', () => {
      expect(extractAnthropicToken('{')).toBeNull();
    });
  });

  describe('extractGeminiToken()', () => {
    it('extracts text from candidates', () => {
      const data = JSON.stringify({
        candidates: [{ content: { parts: [{ text: 'Gemini!' }] } }],
      });
      expect(extractGeminiToken(data)).toBe('Gemini!');
    });

    it('returns null when no candidates present', () => {
      expect(extractGeminiToken(JSON.stringify({ modelVersion: 'x' }))).toBeNull();
    });

    it('returns null for malformed JSON', () => {
      expect(extractGeminiToken('bad')).toBeNull();
    });
  });
});

// ─── readSSELines (unit tests) ────────────────────────────────────────────────

describe('readSSELines()', () => {
  it('yields data payloads from a well-formed SSE stream', async () => {
    const body = makeBodyStream(
      'data: {"id":1}\n',
      '\n',
      'data: [DONE]\n',
    );
    const signal = new AbortController().signal;
    const lines: string[] = [];
    for await (const line of readSSELines(body, signal)) {
      lines.push(line);
    }
    expect(lines).toEqual(['{"id":1}', '[DONE]']);
  });

  it('handles chunked delivery where a line is split across chunks', async () => {
    const body = makeBodyStream('data: hel', 'lo\n', '\n');
    const signal = new AbortController().signal;
    const lines: string[] = [];
    for await (const line of readSSELines(body, signal)) {
      lines.push(line);
    }
    expect(lines).toEqual(['hello']);
  });

  it('stops reading when the signal is aborted', async () => {
    const controller = new AbortController();
    const body = makeBodyStream('data: one\n\n');
    const lines: string[] = [];
    controller.abort();
    for await (const line of readSSELines(body, controller.signal)) {
      lines.push(line);
    }
    expect(lines.length).toBe(0);
  });
});

// ─── OpenAIRuntime ────────────────────────────────────────────────────────────

describe('OpenAIRuntime', () => {
  let configSvc: ConfigurationService;
  let runtime: OpenAIRuntime;

  beforeEach(() => {
    delete process.env.OPENAI_API_KEY;
    configSvc = createTestConfigService({ openai: '' });
    runtime = new OpenAIRuntime(undefined, configSvc);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    delete process.env.OPENAI_API_KEY;
  });

  it('has correct id, name, runtimeType', () => {
    expect(runtime.id).toBe('openai');
    expect(runtime.name).toBe('OpenAI');
    expect(runtime.runtimeType).toBe('cloud');
  });

  describe('healthCheck()', () => {
    it('returns unhealthy when OPENAI_API_KEY is not set', async () => {
      const result = await runtime.healthCheck();
      expect(result.healthy).toBe(false);
      expect(result.error).toContain('OPENAI_API_KEY');
    });

    it('returns healthy when API responds 200', async () => {
      configSvc.setProvider('openai', { apiKey: 'sk-test' });
      vi.stubGlobal('fetch', vi.fn().mockResolvedValue(mockJsonResponse({ data: [] })));
      const result = await runtime.healthCheck();
      expect(result.healthy).toBe(true);
      expect(result.latencyMs).toBeGreaterThanOrEqual(0);
    });

    it('returns unhealthy on network error', async () => {
      configSvc.setProvider('openai', { apiKey: 'sk-test' });
      vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('ECONNREFUSED')));
      const result = await runtime.healthCheck();
      expect(result.healthy).toBe(false);
      expect(result.error).toContain('ECONNREFUSED');
    });
  });

  describe('listAvailableModels()', () => {
    it('returns fallback list when no key', async () => {
      const models = await runtime.listAvailableModels();
      expect(models.length).toBeGreaterThan(0);
      expect(models.every((m) => typeof m === 'string')).toBe(true);
    });

    it('returns API models filtered to gpt-* when key is set', async () => {
      configSvc.setProvider('openai', { apiKey: 'sk-test' });
      vi.stubGlobal('fetch', vi.fn().mockResolvedValue(
        mockJsonResponse({ data: [{ id: 'gpt-4o' }, { id: 'gpt-4o-mini' }, { id: 'whisper-1' }] })
      ));
      const models = await runtime.listAvailableModels();
      expect(models).toContain('gpt-4o');
      expect(models).toContain('gpt-4o-mini');
      expect(models).not.toContain('whisper-1');
    });

    it('returns fallback if API call fails', async () => {
      configSvc.setProvider('openai', { apiKey: 'sk-test' });
      vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('Network error')));
      const models = await runtime.listAvailableModels();
      expect(models.length).toBeGreaterThan(0);
    });
  });

  describe('generateStream()', () => {
    it('emits error when OPENAI_API_KEY is not set', async () => {
      const stream = await runtime.generateStream('hello', {}, new AbortController().signal);
      await expect(
        new Promise<void>((_, reject) => stream.onError(reject).onComplete(() => {}))
      ).rejects.toThrow('OPENAI_API_KEY');
    });

    it('streams tokens from a valid SSE response', async () => {
      configSvc.setProvider('openai', { apiKey: 'sk-test' });
      const sseLines = [
        `data: ${JSON.stringify({ choices: [{ delta: { content: 'Hello' } }] })}`,
        `data: ${JSON.stringify({ choices: [{ delta: { content: ' World' } }] })}`,
        'data: [DONE]',
      ];
      vi.stubGlobal('fetch', vi.fn().mockResolvedValue(mockStreamResponse(sseLines)));

      const { tokens, fullText } = await collectStream(
        runtime.generateStream('hi', {}, new AbortController().signal)
      );
      expect(tokens).toEqual(['Hello', ' World']);
      expect(fullText).toBe('Hello World');
    });

    it('emits error on HTTP error response', async () => {
      configSvc.setProvider('openai', { apiKey: 'sk-test' });
      vi.stubGlobal('fetch', vi.fn().mockResolvedValue(
        new Response('Unauthorized', { status: 401 })
      ));
      const stream = await runtime.generateStream('hi', {}, new AbortController().signal);
      await expect(
        new Promise<void>((_, reject) => stream.onError(reject).onComplete(() => {}))
      ).rejects.toThrow('401');
    });
  });
});

// ─── GroqRuntime ──────────────────────────────────────────────────────────────

describe('GroqRuntime', () => {
  let configSvc: ConfigurationService;
  let runtime: GroqRuntime;

  beforeEach(() => {
    delete process.env.GROQ_API_KEY;
    configSvc = createTestConfigService({ groq: '' });
    runtime = new GroqRuntime(undefined, configSvc);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    delete process.env.GROQ_API_KEY;
  });

  it('has correct id, name, runtimeType', () => {
    expect(runtime.id).toBe('groq');
    expect(runtime.name).toBe('Groq');
    expect(runtime.runtimeType).toBe('cloud');
  });

  it('returns unhealthy when GROQ_API_KEY not set', async () => {
    const result = await runtime.healthCheck();
    expect(result.healthy).toBe(false);
    expect(result.error).toContain('GROQ_API_KEY');
  });

  it('returns fallback models without key', async () => {
    const models = await runtime.listAvailableModels();
    expect(models).toContain('llama-3.3-70b-versatile');
  });

  it('emits error token when key is absent', async () => {
    const stream = await runtime.generateStream('test', {}, new AbortController().signal);
    await expect(
      new Promise<void>((_, reject) => stream.onError(reject).onComplete(() => {}))
    ).rejects.toThrow('GROQ_API_KEY');
  });
});

// ─── OpenRouterRuntime ────────────────────────────────────────────────────────

describe('OpenRouterRuntime', () => {
  let configSvc: ConfigurationService;
  let runtime: OpenRouterRuntime;

  beforeEach(() => {
    delete process.env.OPENROUTER_API_KEY;
    configSvc = createTestConfigService({ openrouter: '' });
    runtime = new OpenRouterRuntime(undefined, configSvc);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    delete process.env.OPENROUTER_API_KEY;
  });

  it('has correct id, name, runtimeType', () => {
    expect(runtime.id).toBe('openrouter');
    expect(runtime.name).toBe('OpenRouter');
    expect(runtime.runtimeType).toBe('cloud');
  });

  it('returns unhealthy when OPENROUTER_API_KEY not set', async () => {
    const result = await runtime.healthCheck();
    expect(result.healthy).toBe(false);
  });

  it('fallback list contains multi-provider models', async () => {
    const models = await runtime.listAvailableModels();
    expect(models.some((m) => m.includes('/'))).toBe(true);
  });
});

// ─── AnthropicRuntime ─────────────────────────────────────────────────────────

describe('AnthropicRuntime', () => {
  let configSvc: ConfigurationService;
  let runtime: AnthropicRuntime;

  beforeEach(() => {
    delete process.env.ANTHROPIC_API_KEY;
    configSvc = createTestConfigService({ anthropic: '' });
    runtime = new AnthropicRuntime(undefined, configSvc);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    delete process.env.ANTHROPIC_API_KEY;
  });

  it('has correct id, name, runtimeType', () => {
    expect(runtime.id).toBe('anthropic');
    expect(runtime.name).toBe('Anthropic');
    expect(runtime.runtimeType).toBe('cloud');
  });

  it('returns unhealthy when ANTHROPIC_API_KEY not set', async () => {
    const result = await runtime.healthCheck();
    expect(result.healthy).toBe(false);
    expect(result.error).toContain('ANTHROPIC_API_KEY');
  });

  it('returns fallback models when key is missing', async () => {
    const models = await runtime.listAvailableModels();
    expect(models).toContain('claude-haiku-3-5');
  });

  it('streams tokens from Anthropic SSE format', async () => {
    configSvc.setProvider('anthropic', { apiKey: 'sk-ant-test' });
    const sseLines = [
      `data: ${JSON.stringify({ type: 'message_start', message: {} })}`,
      `data: ${JSON.stringify({ type: 'content_block_start', index: 0, content_block: { type: 'text', text: '' } })}`,
      `data: ${JSON.stringify({ type: 'content_block_delta', index: 0, delta: { type: 'text_delta', text: 'Hi' } })}`,
      `data: ${JSON.stringify({ type: 'content_block_delta', index: 0, delta: { type: 'text_delta', text: ' there' } })}`,
      `data: ${JSON.stringify({ type: 'message_stop' })}`,
    ];
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(mockStreamResponse(sseLines)));

    const { tokens, fullText } = await collectStream(
      runtime.generateStream('hello', {}, new AbortController().signal)
    );
    expect(tokens).toEqual(['Hi', ' there']);
    expect(fullText).toBe('Hi there');
  });

  it('emits error when key is missing', async () => {
    const stream = await runtime.generateStream('hello', {}, new AbortController().signal);
    await expect(
      new Promise<void>((_, reject) => stream.onError(reject).onComplete(() => {}))
    ).rejects.toThrow('ANTHROPIC_API_KEY');
  });
});

// ─── GeminiRuntime ────────────────────────────────────────────────────────────

describe('GeminiRuntime', () => {
  let configSvc: ConfigurationService;
  let runtime: GeminiRuntime;

  beforeEach(() => {
    delete process.env.GEMINI_API_KEY;
    configSvc = createTestConfigService({ gemini: '' });
    runtime = new GeminiRuntime(undefined, configSvc);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    delete process.env.GEMINI_API_KEY;
  });

  it('has correct id, name, runtimeType', () => {
    expect(runtime.id).toBe('gemini');
    expect(runtime.name).toBe('Google Gemini');
    expect(runtime.runtimeType).toBe('cloud');
  });

  it('returns unhealthy when GEMINI_API_KEY not set', async () => {
    const result = await runtime.healthCheck();
    expect(result.healthy).toBe(false);
    expect(result.error).toContain('GEMINI_API_KEY');
  });

  it('strips models/ prefix and filters by streamGenerateContent', async () => {
    configSvc.setProvider('gemini', { apiKey: 'AIza-test' });
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(
      mockJsonResponse({
        models: [
          { name: 'models/gemini-2.0-flash', supportedGenerationMethods: ['generateContent', 'streamGenerateContent'] },
          { name: 'models/embedding-001', supportedGenerationMethods: ['embedContent'] },
        ],
      })
    ));
    const models = await runtime.listAvailableModels();
    expect(models).toContain('gemini-2.0-flash');
    expect(models).not.toContain('embedding-001');
  });

  it('returns fallback when key is absent', async () => {
    const models = await runtime.listAvailableModels();
    expect(models).toContain('gemini-2.0-flash');
  });

  it('streams tokens from Gemini SSE format', async () => {
    configSvc.setProvider('gemini', { apiKey: 'AIza-test' });
    const sseLines = [
      `data: ${JSON.stringify({ candidates: [{ content: { parts: [{ text: 'Hello' }] } }] })}`,
      `data: ${JSON.stringify({ candidates: [{ content: { parts: [{ text: ' Gemini' }] } }] })}`,
    ];
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(mockStreamResponse(sseLines)));

    const { tokens, fullText } = await collectStream(
      runtime.generateStream('hello', {}, new AbortController().signal)
    );
    expect(tokens).toEqual(['Hello', ' Gemini']);
    expect(fullText).toBe('Hello Gemini');
  });

  it('emits error when key is missing', async () => {
    const stream = await runtime.generateStream('hello', {}, new AbortController().signal);
    await expect(
      new Promise<void>((_, reject) => stream.onError(reject).onComplete(() => {}))
    ).rejects.toThrow('GEMINI_API_KEY');
  });
});
