/**
 * runtime-discovery.test.ts — Phase 23 Runtime Discovery & Environment Manager Tests
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { RuntimeDiscoveryEngine } from '../electron/main/ai/runtime-discovery/runtime-discovery-engine';
import { RuntimeDetector } from '../electron/main/ai/runtime-discovery/runtime-detector';
import { RuntimeValidator } from '../electron/main/ai/runtime-discovery/runtime-validator';
import { RuntimeHealthChecker } from '../electron/main/ai/runtime-discovery/runtime-health';
import { EnvironmentDoctor } from '../electron/main/ai/runtime-discovery/environment-doctor';
import { RuntimeConfig } from '../electron/main/ai/runtime-discovery/runtime-config';
import { RuntimeCache } from '../electron/main/ai/runtime-discovery/runtime-cache';
import { RuntimeEvents } from '../electron/main/ai/runtime-discovery/runtime-events';

describe('Phase 23 — Runtime Discovery & Environment Manager', () => {
  describe('RuntimeConfig & Secret Redaction', () => {
    it('should redact sensitive keys correctly', () => {
      expect(RuntimeConfig.isSecretKey('OPENAI_API_KEY')).toBe(true);
      expect(RuntimeConfig.isSecretKey('ANTHROPIC_AUTH_TOKEN')).toBe(true);
      expect(RuntimeConfig.isSecretKey('OLLAMA_HOST')).toBe(false);

      const secretVal = 'sk-proj-1234567890abcdef';
      const redacted = RuntimeConfig.redactSecret(secretVal);
      expect(redacted).not.toContain('1234567890');
      expect(redacted).toMatch(/^sk-p\.\.\.cdef$/);
    });

    it('should store and update custom executable paths', () => {
      const config = new RuntimeConfig();
      config.setCustomPath('ollama', '/custom/bin/ollama');
      expect(config.getCustomPath('ollama')).toBe('/custom/bin/ollama');
    });
  });

  describe('RuntimeCache', () => {
    it('should cache and invalidate entries by TTL', async () => {
      const cache = new RuntimeCache<string>(100); // 100ms TTL
      cache.set('key1', 'value1');

      expect(cache.get('key1')).toBe('value1');

      // Wait for expiration
      await new Promise((resolve) => setTimeout(resolve, 150));
      expect(cache.get('key1')).toBeNull();
    });
  });

  describe('RuntimeEvents', () => {
    it('should emit discovery and health events properly', () => {
      const events = new RuntimeEvents();
      let startedEmitted = false;
      let healthChangedEmitted: any = null;

      events.on('discovery:started', () => {
        startedEmitted = true;
      });
      events.on('runtime:health-changed', (data) => {
        healthChangedEmitted = data;
      });

      events.emitStarted();
      events.emitHealthChanged('ollama', 'healthy');

      expect(startedEmitted).toBe(true);
      expect(healthChangedEmitted).toEqual({ runtimeId: 'ollama', health: 'healthy' });
    });
  });

  describe('RuntimeValidator', () => {
    it('should fail validation on non-existent executable path', async () => {
      const validator = new RuntimeValidator();
      const res = await validator.validateExecutable('/non/existent/path/binary');
      expect(res.valid).toBe(false);
      expect(res.error).toBeDefined();
    });

    it('should validate environment variables and redact secrets', () => {
      const validator = new RuntimeValidator();
      process.env.TEST_DUMMY_KEY = 'sk-test-12345678';
      const res = validator.validateEnvironment(['TEST_DUMMY_KEY']);

      expect(res.valid).toBe(true);
      expect(res.rawVars['TEST_DUMMY_KEY']).toBe('sk-test-12345678');
      expect(res.redactedVars['TEST_DUMMY_KEY']).not.toBe('sk-test-12345678');

      delete process.env.TEST_DUMMY_KEY;
    });
  });

  describe('EnvironmentDoctor', () => {
    it('should run environment diagnostics without throwing', async () => {
      const doctor = new EnvironmentDoctor();
      const diag = await doctor.runDiagnostics();

      expect(diag.systemInfo).toBeDefined();
      expect(diag.systemInfo.platform).toBeDefined();
      expect(Array.isArray(diag.issues)).toBe(true);
      expect(Array.isArray(diag.missingDependencies)).toBe(true);
      expect(Array.isArray(diag.environmentVariables)).toBe(true);
    });
  });

  describe('RuntimeDetector', () => {
    it('should detect all configured runtimes', async () => {
      const detector = new RuntimeDetector();
      const results = await detector.detectAll();

      expect(Array.isArray(results)).toBe(true);
      expect(results.length).toBeGreaterThanOrEqual(9);

      const ids = results.map((r) => r.id);
      expect(ids).toContain('ollama');
      expect(ids).toContain('claude-code');
      expect(ids).toContain('gemini-cli');
      expect(ids).toContain('codex-cli');
      expect(ids).toContain('aider');
      expect(ids).toContain('opencode');
      expect(ids).toContain('goose');
      expect(ids).toContain('openrouter');
      expect(ids).toContain('openai');
    });
  });

  describe('RuntimeHealthChecker', () => {
    it('should return health check result for runtimes', async () => {
      const healthChecker = new RuntimeHealthChecker();
      const res = await healthChecker.checkHealth('ollama');

      expect(res.runtimeId).toBe('ollama');
      expect(['healthy', 'degraded', 'unhealthy', 'unknown']).toContain(res.health);
      expect(typeof res.latencyMs).toBe('number');
    });
  });

  describe('RuntimeDiscoveryEngine', () => {
    it('should discover runtimes and cache results', async () => {
      const engine = new RuntimeDiscoveryEngine({ autoScan: false });
      const runtimes = await engine.discoverRuntimes();

      expect(Array.isArray(runtimes)).toBe(true);
      expect(runtimes.length).toBeGreaterThan(0);

      const target = await engine.getRuntime('ollama');
      expect(target).not.toBeNull();
      expect(target?.id).toBe('ollama');

      engine.dispose();
    });
  });
});
