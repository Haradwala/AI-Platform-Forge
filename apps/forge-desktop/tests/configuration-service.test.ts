/**
 * configuration-service.test.ts
 *
 * Unit test suite for Phase 3 Configuration Service, Store, Loader, Validator,
 * and RuntimeManager integration/fallback.
 * Uses mock filesystem — never touches real disk.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ConfigurationService } from '../electron/main/config/configuration-service';
import { ConfigurationLoader, type IFileSystem } from '../electron/main/config/configuration-loader';
import { ConfigurationStore } from '../electron/main/config/configuration-store';
import { validateConfig } from '../electron/main/config/configuration-validator';
import { createDefaultConfig } from '../electron/main/config/configuration-schema';
import { RuntimeManager } from '../electron/main/ai/runtime/runtime-manager';
import type { IAiRuntime, RuntimeHealth } from '../electron/main/ai/runtime/runtime-types';

// ─── Mock File System Helper ──────────────────────────────────────────────────

function createMockFs(initialFiles: Record<string, string> = {}): IFileSystem & { files: Record<string, string> } {
  const files: Record<string, string> = { ...initialFiles };

  return {
    files,
    existsSync(p: string) {
      return Object.prototype.hasOwnProperty.call(files, p);
    },
    readFileSync(p: string) {
      if (!this.existsSync(p)) throw new Error(`File not found: ${p}`);
      return files[p];
    },
    writeFileSync(p: string, content: string) {
      files[p] = content;
    },
    mkdirSync() {},
  };
}

function makeMockRuntime(
  id: string,
  type: 'local' | 'cloud' = 'cloud',
  healthy = true
): IAiRuntime {
  return {
    id,
    name: `${id} runtime`,
    runtimeType: type,
    listAvailableModels: vi.fn().mockResolvedValue([`${id}-model`]),
    generateStream: vi.fn().mockResolvedValue({}),
    healthCheck: vi.fn().mockResolvedValue({ healthy, latencyMs: 10 }),
  };
}

// ═══════════════════════════════════════════════════════════════════════════════
// Test Suite
// ═══════════════════════════════════════════════════════════════════════════════

describe('Configuration Service Suite', () => {
  const mockPath = '/mock/app/config.json';

  // ─── Default Generation & Schema ──────────────────────────────────────────

  describe('createDefaultConfig()', () => {
    it('creates default configuration with fallback values', () => {
      const def = createDefaultConfig();
      expect(def.activeRuntime).toBe('auto');
      expect(def.providers.openai).toBeDefined();
      expect(def.providers.ollama.baseUrl).toBe('http://localhost:11434');
    });
  });

  // ─── ConfigurationValidator ───────────────────────────────────────────────

  describe('ConfigurationValidator', () => {
    it('validates a valid configuration', () => {
      const cfg = createDefaultConfig();
      const res = validateConfig(cfg);
      expect(res.valid).toBe(true);
      expect(res.errors).toHaveLength(0);
    });

    it('flags invalid activeRuntime and invalid URLs', () => {
      const res = validateConfig({
        activeRuntime: '',
        providers: {
          openai: { baseUrl: 'invalid-url' },
        },
      });
      expect(res.valid).toBe(false);
      expect(res.errors.length).toBeGreaterThan(0);
      expect(res.errors.some((e) => e.includes('baseUrl'))).toBe(true);
    });

    it('returns warning for missing cloud API keys', () => {
      const cfg = createDefaultConfig();
      cfg.providers.openai.apiKey = '';
      const res = validateConfig(cfg);
      expect(res.warnings.some((w) => w.includes('openai'))).toBe(true);
    });

    it('handles non-object input gracefully without throwing', () => {
      const res = validateConfig(null);
      expect(res.valid).toBe(false);
      expect(res.errors[0]).toContain('null');
    });
  });

  // ─── ConfigurationLoader (Persistence with Mock FS) ──────────────────────

  describe('ConfigurationLoader', () => {
    it('creates and saves default config when file is missing', () => {
      const mockFs = createMockFs();
      const loader = new ConfigurationLoader(mockPath, mockFs);
      const loaded = loader.load();

      expect(loaded.activeRuntime).toBe('auto');
      expect(mockFs.existsSync(mockPath)).toBe(true);
    });

    it('loads existing config from mock fs', () => {
      const existingConfig = createDefaultConfig();
      existingConfig.activeRuntime = 'openai';
      existingConfig.providers.openai.apiKey = 'sk-custom-key';

      const mockFs = createMockFs({
        [mockPath]: JSON.stringify(existingConfig),
      });

      const loader = new ConfigurationLoader(mockPath, mockFs);
      const loaded = loader.load();

      expect(loaded.activeRuntime).toBe('openai');
      expect(loaded.providers.openai.apiKey).toBe('sk-custom-key');
    });

    it('handles corrupt JSON safely by falling back to defaults', () => {
      const mockFs = createMockFs({
        [mockPath]: '{ corrupt json ...',
      });
      const loader = new ConfigurationLoader(mockPath, mockFs);
      const loaded = loader.load();

      expect(loaded.activeRuntime).toBe('auto');
    });
  });

  // ─── ConfigurationService ─────────────────────────────────────────────────

  describe('ConfigurationService', () => {
    let mockFs: ReturnType<typeof createMockFs>;
    let service: ConfigurationService;

    beforeEach(() => {
      mockFs = createMockFs();
      service = new ConfigurationService(mockPath, mockFs);
    });

    it('allows getting and setting providers', () => {
      service.setProvider('openai', { apiKey: 'sk-new-key', baseUrl: 'https://custom.openai' });
      const p = service.getProvider('openai');
      expect(p?.apiKey).toBe('sk-new-key');
      expect(p?.baseUrl).toBe('https://custom.openai');
    });

    it('persists changes to file on set/setActiveRuntime', () => {
      service.setActiveRuntime('groq');
      expect(mockFs.files[mockPath]).toContain('"activeRuntime": "groq"');
    });

    it('supports reloading from disk', () => {
      service.setActiveRuntime('ollama');
      // Modify file behind the scenes
      const current = JSON.parse(mockFs.files[mockPath]);
      current.activeRuntime = 'anthropic';
      mockFs.files[mockPath] = JSON.stringify(current);

      const reloaded = service.reload();
      expect(reloaded.activeRuntime).toBe('anthropic');
      expect(service.getActiveRuntime()).toBe('anthropic');
    });

    it('returns validation diagnostics', () => {
      service.setProvider('gemini', { baseUrl: 'bad-url' });
      const diag = service.validate();
      expect(diag.valid).toBe(false);
      expect(diag.errors.some((e) => e.includes('gemini'))).toBe(true);
    });
  });

  // ─── RuntimeManager Fallback & Integration ────────────────────────────────

  describe('RuntimeManager Integration with ConfigurationService', () => {
    let mockFs: ReturnType<typeof createMockFs>;
    let configSvc: ConfigurationService;
    let manager: RuntimeManager;

    beforeEach(() => {
      mockFs = createMockFs();
      configSvc = new ConfigurationService(mockPath, mockFs);
      manager = new RuntimeManager(configSvc);
    });

    it('activates runtime configured in ConfigurationService on registration', () => {
      configSvc.setActiveRuntime('groq');
      const groq = makeMockRuntime('groq');
      const mock = makeMockRuntime('mock');

      manager.register(mock);
      manager.register(groq);

      expect(manager.active()).toBe(groq);
    });

    it('updates ConfigurationService when activate() is called on RuntimeManager', () => {
      manager.register(makeMockRuntime('mock'));
      manager.register(makeMockRuntime('anthropic'));

      manager.activate('anthropic');
      expect(configSvc.getActiveRuntime()).toBe('anthropic');
    });

    it('fallback resolution selects healthy configured active runtime first', async () => {
      configSvc.setActiveRuntime('openai');
      const openai = makeMockRuntime('openai', 'cloud', true);
      manager.register(openai);

      const resolved = await manager.resolveFallbackRuntime();
      expect(resolved.id).toBe('openai');
    });

    it('fallback resolution falls back to healthy Ollama when active is unhealthy', async () => {
      configSvc.setActiveRuntime('openai');
      const openai = makeMockRuntime('openai', 'cloud', false); // unhealthy
      const ollama = makeMockRuntime('ollama', 'local', true);  // healthy
      const mock = makeMockRuntime('mock', 'local', true);

      manager.register(openai);
      manager.register(ollama);
      manager.register(mock);

      const resolved = await manager.resolveFallbackRuntime();
      expect(resolved.id).toBe('ollama');
      expect(manager.active().id).toBe('ollama');
    });

    it('fallback resolution falls back to healthy cloud runtime when active and Ollama are unhealthy', async () => {
      configSvc.setActiveRuntime('openai');
      const openai = makeMockRuntime('openai', 'cloud', false);
      const ollama = makeMockRuntime('ollama', 'local', false);
      const groq = makeMockRuntime('groq', 'cloud', true);
      const mock = makeMockRuntime('mock', 'local', true);

      manager.register(openai);
      manager.register(ollama);
      manager.register(groq);
      manager.register(mock);

      const resolved = await manager.resolveFallbackRuntime();
      expect(resolved.id).toBe('groq');
      expect(manager.active().id).toBe('groq');
    });

    it('fallback resolution falls back to Mock if all others are unhealthy', async () => {
      configSvc.setActiveRuntime('openai');
      const openai = makeMockRuntime('openai', 'cloud', false);
      const ollama = makeMockRuntime('ollama', 'local', false);
      const mock = makeMockRuntime('mock', 'local', true);

      manager.register(openai);
      manager.register(ollama);
      manager.register(mock);

      const resolved = await manager.resolveFallbackRuntime();
      expect(resolved.id).toBe('mock');
    });
  });
});
