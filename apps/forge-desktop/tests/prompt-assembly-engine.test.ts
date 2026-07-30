/**
 * prompt-assembly-engine.test.ts
 *
 * Unit test suite for Phase 8/9 PromptAssemblyEngine.
 * Covers:
 *  - Prompt assembly from goal, plan, memory, context, and tools
 *  - Token estimation calculation
 *  - Custom system prompt override
 *  - Tool metadata rendering
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { PromptAssemblyEngine } from '../electron/main/ai/context/prompt-assembly-engine';

describe('PromptAssemblyEngine', () => {
  let promptEngine: PromptAssemblyEngine;

  beforeEach(() => {
    promptEngine = new PromptAssemblyEngine();
  });

  it('assembles a structured prompt with system & user sections', () => {
    const assembled = promptEngine.assemble({
      goal: 'Refactor user authentication',
      planInstruction: 'Step 1: Check password hashing in auth.ts',
      tools: [
        { id: 'read_file', description: 'Read file content', inputSchema: {}, outputSchema: {} },
        { id: 'write_file', description: 'Write file content', inputSchema: {}, outputSchema: {} },
      ],
      memories: [
        { id: 'm1', type: 'user' as const, content: 'User prefers bcrypt for hashing', score: 90, matchReasons: [], timestamp: Date.now() },
      ],
      contextSnapshot: {
        timestamp: new Date().toISOString(),
        userGoal: 'Refactor user authentication',
        items: [
          { id: 'c1', source: 'active_editor', content: 'src/auth.ts code', score: 100, rankReasons: [] },
        ],
        totalTokens: 50,
        maxTokenBudget: 2000,
        truncated: false,
        indexedFileCount: 1,
        durationMs: 5,
      },
    });

    expect(assembled.systemPrompt).toContain('Forge AI');
    expect(assembled.systemPrompt).toContain('read_file');
    expect(assembled.userPrompt).toContain('Refactor user authentication');
    expect(assembled.userPrompt).toContain('bcrypt for hashing');
    expect(assembled.userPrompt).toContain('src/auth.ts code');
    expect(assembled.tokenEstimate).toBeGreaterThan(0);
    expect(assembled.sections).toEqual(
      expect.arrayContaining(['Available Tools', 'Target Goal', 'Execution Plan', 'Memories', 'Workspace Context'])
    );
  });

  it('supports custom system prompt overrides', () => {
    const assembled = promptEngine.assemble({
      goal: 'Simple query',
      systemPromptOverride: 'You are a minimalist assistant.',
    });

    expect(assembled.systemPrompt).toBe('You are a minimalist assistant.');
    expect(assembled.userPrompt).toContain('Simple query');
  });
});
