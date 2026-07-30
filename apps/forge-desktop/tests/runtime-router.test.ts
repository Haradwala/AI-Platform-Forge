import { describe, it, expect, vi } from 'vitest';
import { RuntimeRouter } from '../electron/main/ai/routing/runtime-router';
import { IntentAnalyzer } from '../electron/main/ai/routing/intent-analyzer';
import { RuntimeCandidateInfo } from '../electron/main/ai/routing/capability-matcher';

describe('Phase 25-28 Runtime Router & Learning Suite', () => {
  const analyzer = new IntentAnalyzer();

  const candidates: RuntimeCandidateInfo[] = [
    {
      id: 'claude',
      name: 'Claude CLI',
      type: 'cli',
      isAvailable: true,
      capabilities: { streaming: true, tools: true, mcp: true, vision: true, reasoning: true },
      health: 'healthy',
      latencyMs: 150,
    },
    {
      id: 'ollama',
      name: 'Ollama Local',
      type: 'cli',
      isAvailable: true,
      capabilities: { streaming: true, tools: true },
      health: 'healthy',
      latencyMs: 50,
    },
    {
      id: 'gemini',
      name: 'Gemini CLI',
      type: 'cli',
      isAvailable: false,
      capabilities: { streaming: true, tools: true },
      health: 'unhealthy',
      latencyMs: 1000,
    },
  ];

  it('IntentAnalyzer extracts required capabilities, priority, and complexity', () => {
    const req = analyzer.analyze('Create a complex React component with vision diagram audit', '/tmp/ws');
    expect(req.capabilities).toContain('streaming');
    expect(req.capabilities).toContain('vision');
    expect(req.complexity).toBe('complex');
  });

  it('ranks available candidates cleanly using multi-factor scoring', () => {
    const mockLearning = { getSuccessRates: () => ({}), recordOutcome: async () => {} } as any;
    const router = new RuntimeRouter(mockLearning);
    const req = analyzer.analyze('Run typecheck and edit code with claude', '/tmp/ws_rank_test');
    const ranked = router.rankRuntimes(req, candidates);

    expect(ranked.length).toBeGreaterThanOrEqual(2);
    expect(ranked[0].candidate.id).toBe('claude');
  });

  it('executes top candidate and performs automatic failover fallback if primary fails', async () => {
    const mockLearning = { getSuccessRates: () => ({}), recordOutcome: async () => {} } as any;
    const router = new RuntimeRouter(mockLearning);
    const req = analyzer.analyze('Fix typo in file with claude', '/tmp/ws_failover_test');

    const mockExecutor = {
      execute: vi.fn(async (runtimeId: string) => {
        if (runtimeId === 'claude') {
          throw new Error('Claude rate limit exceeded');
        }
        return {
          taskId: req.taskId,
          sessionId: 'sess_fallback_1',
          runtimeId,
          status: 'COMPLETED' as const,
          output: 'Fixed typo cleanly',
          durationMs: 120,
        };
      }),
    };

    const result = await router.routeAndExecute(req, candidates, mockExecutor);

    expect(result.status).toBe('COMPLETED');
    expect(result.runtimeId).toBe('ollama');
    expect(mockExecutor.execute).toHaveBeenCalledTimes(2);
  });
});
