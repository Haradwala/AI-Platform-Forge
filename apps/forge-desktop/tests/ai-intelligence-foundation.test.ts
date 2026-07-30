import { describe, it, expect, vi } from 'vitest';
import { WorkspaceCollector, EditorCollector } from '../electron/main/ai/context/context-collectors';
import { ContextRankingService } from '../electron/main/ai/context/context-ranking-service';
import { TokenBudgetManager } from '../electron/main/ai/context/token-budget-manager';
import { MemoryRegistry } from '../electron/main/ai/memory/memory-registry';
import { SemanticKnowledgeBuilder } from '../electron/main/ai/knowledge/semantic-knowledge-builder';
import { ConversationManager } from '../electron/main/ai/session/conversation-manager';
import { IWorkspaceService, IRepositoryProvider } from '../electron/main/container/service-interfaces';

describe('AI Intelligence Foundation (Milestone 3.1)', () => {

  describe('Context Layer & Collectors', () => {
    it('collects workspace context details', async () => {
      const mockWs: IWorkspaceService = {
        getRootPath: () => '/mock/root',
      } as any;

      const collector = new WorkspaceCollector(mockWs);
      const items = await collector.collect();
      expect(items).toHaveLength(1);
      expect(items[0].content).toContain('/mock/root');
    });

    it('ranks collected context items relative to the active file', () => {
      const ranking = new ContextRankingService();
      const items = [
        { id: '1', source: 'editor' as const, content: 'ref: main.ts', score: 50 },
        { id: '2', source: 'editor' as const, content: 'ref: helper.ts', score: 70 },
      ];

      const ranked = ranking.rankItems(items, 'main.ts');
      expect(ranked[0].id).toBe('1'); // Score boosted to 70 and sorted first
      expect(ranked[0].score).toBe(70);
    });
  });

  describe('Token Budget Manager', () => {
    it('truncates content details to fit within token boundaries', () => {
      const budget = new TokenBudgetManager(100);
      const items = [
        { id: '1', source: 'editor' as const, content: 'a'.repeat(1000), score: 90 },
      ];

      const allocated = budget.allocateAndCompress(items, 100);
      expect(allocated).toHaveLength(1);
      expect(allocated[0].content).toContain('Truncated');
    });
  });

  describe('Memory Registry Policies', () => {
    it('enforces retention policies per memory category store', () => {
      const registry = new MemoryRegistry();
      
      // Inject multiple conversation logs (limit 100)
      for (let i = 0; i < 110; i++) {
        registry.addRecord({
          id: `rec_${i}`,
          type: 'conversation',
          content: `msg_${i}`,
          timestamp: new Date().toISOString(),
        });
      }

      const list = registry.getRecords('conversation');
      expect(list).toHaveLength(100); // Shrunk to fit limit policy
      expect(list[0].id).toBe('rec_10');
    });
  });

  describe('Semantic Knowledge Graph', () => {
    it('extracts relationships from mock repository index data', async () => {
      const mockRp: IRepositoryProvider = {
        query: vi.fn().mockImplementation(async (req) => {
          if (req.type === 'findSymbol') {
            return {
              success: true,
              data: [{ name: 'LoginController', parent: 'BaseController' }],
            };
          }
          if (req.type === 'findReferences') {
            return { success: true, data: ['App.tsx'] };
          }
          return { success: false, data: null };
        }),
      } as any;

      const builder = new SemanticKnowledgeBuilder(mockRp);
      const graph = await builder.buildSemanticGraph();
      
      expect(graph).toHaveLength(2);
      expect(graph[0]).toEqual({ from: 'LoginController', to: 'BaseController', relation: 'implements' });
      expect(graph[1]).toEqual({ from: 'App.tsx', to: 'LoginController', relation: 'references' });
    });
  });


  describe('Session Conversation Manager', () => {
    it('manages conversation log state machine transitions', () => {
      const manager = new ConversationManager();
      manager.setState('session_1', 'Thinking');
      expect(manager.getState('session_1')).toBe('Thinking');

      manager.addMessage('session_1', { role: 'user', content: 'hello', timestamp: '' });
      expect(manager.summarize('session_1')).toContain('hello');
    });
  });
});
