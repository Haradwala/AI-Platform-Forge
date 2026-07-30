/**
 * cli-runtimes.test.ts
 *
 * Unit test suite for Phase 13 CLI Runtimes (ClaudeCode, Gemini, Codex, Aider, Goose).
 * Covers:
 *  - Runtime metadata & model listing
 *  - CLI process streaming execution
 *  - AbortSignal cancellation
 *  - Health check handling when executable is missing/available
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { CLIManager } from '../electron/main/ai/cli/cli-manager';
import { ClaudeCodeRuntime } from '../electron/main/ai/runtime/cli/claude-runtime';
import { GeminiCLIRuntime } from '../electron/main/ai/runtime/cli/gemini-runtime';
import { CodexCLIRuntime } from '../electron/main/ai/runtime/cli/codex-runtime';
import { AiderCLIRuntime } from '../electron/main/ai/runtime/cli/aider-runtime';
import { GooseCLIRuntime } from '../electron/main/ai/runtime/cli/goose-runtime';

describe('CLI Runtimes (Phase 13)', () => {
  let cliManager: CLIManager;
  let claudeRuntime: ClaudeCodeRuntime;
  let geminiRuntime: GeminiCLIRuntime;

  beforeEach(() => {
    cliManager = new CLIManager();
    claudeRuntime = new ClaudeCodeRuntime(cliManager);
    geminiRuntime = new GeminiCLIRuntime(cliManager);
  });

  afterEach(async () => {
    await cliManager.destroyAll();
  });

  it('exposes correct metadata and model list for all CLI runtimes', async () => {
    expect(claudeRuntime.runtimeType).toBe('cli');
    expect(claudeRuntime.name).toBe('Claude Code CLI');

    const claudeModels = await claudeRuntime.listAvailableModels();
    expect(claudeModels).toContain('claude-3-5-sonnet-20241022');

    const geminiModels = await geminiRuntime.listAvailableModels();
    expect(geminiModels).toContain('gemini-1.5-pro');

    const codex = new CodexCLIRuntime(cliManager);
    expect(await codex.listAvailableModels()).toContain('gpt-4o');

    const aider = new AiderCLIRuntime(cliManager);
    expect(await aider.listAvailableModels()).toContain('aider-auto');

    const goose = new GooseCLIRuntime(cliManager);
    expect(await goose.listAvailableModels()).toContain('goose-default');
  });

  it('streams CLI output using an echo shell command override', async () => {
    const isWin = process.platform === 'win32';
    const executable = isWin ? 'cmd' : 'echo';
    const args = isWin ? ['/c', 'echo Hello from CLI Stream'] : ['Hello from CLI Stream'];

    const stream = await claudeRuntime.generateStream('prompt', {
      executable,
      args,
    });

    const receivedTokens: string[] = [];
    let completedText = '';

    await new Promise<void>((resolve, reject) => {
      stream.onToken((t) => receivedTokens.push(t));
      stream.onComplete((text) => {
        completedText = text;
        resolve();
      });
      stream.onError((e) => reject(e));
    });

    expect(receivedTokens.join('')).toContain('Hello from CLI Stream');
    expect(completedText).toContain('Hello from CLI Stream');
  });

  it('cancels stream execution when AbortSignal is aborted', async () => {
    const controller = new AbortController();
    controller.abort();

    await expect(
      claudeRuntime.generateStream('prompt', {}, controller.signal)
    ).rejects.toThrow('cancelled by AbortSignal');
  });

  it('performs health checks gracefully when executable is unavailable', async () => {
    const health = await claudeRuntime.healthCheck();
    expect(health).toBeDefined();
    expect(typeof health.healthy).toBe('boolean');
  });
});
