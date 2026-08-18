import { describe, it, expect } from 'vitest';
import { KnowledgeInterpreterRegistry } from '../electron/main/ai/response/interpreters/knowledge-interpreter-registry';
import {
  WorkspaceStatsKnowledgeInterpreter,
  FileListKnowledgeInterpreter,
  SearchResultsKnowledgeInterpreter,
  FileContentKnowledgeInterpreter,
  TerminalOutputKnowledgeInterpreter,
  GitDiffKnowledgeInterpreter,
  ErrorTraceKnowledgeInterpreter,
  IKnowledgeInterpreter,
} from '../electron/main/ai/response/interpreters/knowledge-interpreter-strategy';
import { PromptFormatterRegistry } from '../electron/main/ai/response/formatters/prompt-formatter-registry';
import {
  WorkspaceStatisticsFormatter,
  FileListFormatter,
  WorkspaceSearchFormatter,
  FileContentFormatter,
  TerminalOutputFormatter,
  GitDiffFormatter,
  ErrorTraceFormatter,
  IPromptFactFormatter,
} from '../electron/main/ai/response/formatters/prompt-formatter-strategy';
import { PromptComposer } from '../electron/main/ai/response/prompt-composer';
import { FactInterpreter } from '../electron/main/ai/response/fact-interpreter';
import { ResponseContextBuilder } from '../electron/main/ai/response/response-context-builder';
import { ExecutionResultKind } from '../electron/main/ai/contracts/execution-result-kind';
import { ExecutionGoal } from '../electron/main/ai/contracts/execution-goal';
import type { ResponseRequest, PromptSection } from '../electron/main/ai/response/response-types';

describe('Sprint 81 — Response Layer Platform Architecture', () => {
  it('1. KnowledgeInterpreterRegistry interprets WORKSPACE_STATS envelope into WorkspaceStatisticsFact with filesCount 2673', () => {
    const registry = new KnowledgeInterpreterRegistry([
      new WorkspaceStatsKnowledgeInterpreter(),
      new FileListKnowledgeInterpreter(),
      new SearchResultsKnowledgeInterpreter(),
      new FileContentKnowledgeInterpreter(),
      new TerminalOutputKnowledgeInterpreter(),
      new GitDiffKnowledgeInterpreter(),
      new ErrorTraceKnowledgeInterpreter(),
    ]);

    const envelope = {
      version: 1 as const,
      success: true,
      goal: ExecutionGoal.WORKSPACE_STATISTICS,
      kind: ExecutionResultKind.WORKSPACE_STATS,
      payload: {
        filesCount: 2673,
        symbolsCount: 150,
        circularDependenciesCount: 0,
        languages: ['typescript', 'json'],
        projects: ['@forge/desktop'],
      },
      metadata: { toolId: 'search_workspace', durationMs: 2, cached: false, source: 'repo', timestamp: '' },
    };

    const facts = registry.interpret(envelope);
    expect(facts).toHaveLength(1);
    expect(facts[0].kind).toBe('workspace_statistics');
    if (facts[0].kind === 'workspace_statistics') {
      expect(facts[0].fileCount).toBe(2673);
      expect(facts[0].languages).toEqual(['typescript', 'json']);
    }
  });

  it('2. PromptFormatterRegistry formats WorkspaceStatisticsFact into prioritized PromptSection', () => {
    const registry = new PromptFormatterRegistry([
      new WorkspaceStatisticsFormatter(),
      new FileListFormatter(),
      new WorkspaceSearchFormatter(),
      new FileContentFormatter(),
      new TerminalOutputFormatter(),
      new GitDiffFormatter(),
      new ErrorTraceFormatter(),
    ]);

    const fact = {
      kind: 'workspace_statistics' as const,
      fileCount: 2673,
      languages: ['typescript', 'json'],
    };

    const section = registry.format(fact);
    expect(section).not.toBeNull();
    expect(section?.category).toBe('grounding');
    expect(section?.priority).toBe(10);
    expect(section?.content).toContain('2673 total files in project.');
    expect(section?.content).toContain('Languages: typescript, json');
  });

  it('3. PromptComposer composes unified prompt containing 2673 and strict grounding directives', () => {
    const composer = new PromptComposer();

    const request: ResponseRequest = {
      userPrompt: 'How many files are there in this project?',
      workspace: { root: '/repo/root' },
      execution: { success: true, goal: 'WORKSPACE_STATISTICS' },
      verification: { success: true },
      reflection: { recommendations: [] },
      context: { summary: '' },
      groundedContext: {
        executionResults: [],
        repositoryFacts: [
          {
            kind: 'workspace_statistics',
            fileCount: 2673,
            languages: ['typescript'],
          },
        ],
        terminalFacts: [],
      },
    };

    const prompt = composer.compose(request);
    expect(prompt).toContain('2673 total files in project.');
    expect(prompt).toContain('CRITICAL REQUIREMENT: Base your answer strictly on the Grounding Repository / Terminal Facts');
  });

  it('4. FactInterpreter and ResponseContextBuilder process raw execution context using ResultNormalizer and strategy handlers', () => {
    const builder = new ResponseContextBuilder();

    const context: any = {
      workspaceRoot: '/test/workspace',
      userPrompt: 'How many files are there in this project?',
      generatedPlan: { goal: 'WORKSPACE_STATISTICS' },
      executionOutcome: { success: true },
      verificationReport: { success: true },
      reflectionReport: { recommendations: [] },
      executionResults: [
        {
          taskId: 'task_2',
          toolId: 'search_workspace',
          status: 'completed',
          durationMs: 4,
          cost: 0,
          result: {
            version: 1,
            success: true,
            goal: ExecutionGoal.WORKSPACE_STATISTICS,
            kind: ExecutionResultKind.WORKSPACE_STATS,
            payload: {
              filesCount: 2673,
              symbolsCount: 0,
              circularDependenciesCount: 0,
              languages: ['typescript'],
              projects: ['@forge/desktop'],
            },
            metadata: { toolId: 'search_workspace', durationMs: 4, cached: false, source: 'repo', timestamp: '' },
          },
        },
      ],
    };

    const request = builder.build(context, 'How many files are there in this project?');
    expect(request.groundedContext?.repositoryFacts).toHaveLength(1);
    expect(request.groundedContext?.repositoryFacts[0].kind).toBe('workspace_statistics');

    const composer = new PromptComposer();
    const prompt = composer.compose(request);
    expect(prompt).toContain('2673 total files in project.');
  });

  it('5. Open/Closed Principle: Can register custom strategy handler without modifying core classes', () => {
    class AstAnalysisInterpreter implements IKnowledgeInterpreter {
      readonly kind = 'AST_ANALYSIS' as any;
      interpret(result: any): any[] {
        return [{ kind: 'ast_analysis', nodesCount: 42 }];
      }
    }

    class AstAnalysisFormatter implements IPromptFactFormatter<any> {
      readonly factKind = 'ast_analysis';
      format(fact: any): PromptSection {
        return {
          title: 'AST Analysis',
          category: 'grounding',
          priority: 15,
          content: `- AST Nodes Analyzed: ${fact.nodesCount}`,
        };
      }
    }

    const interpreterReg = new KnowledgeInterpreterRegistry([new AstAnalysisInterpreter()]);
    const interpreted = interpreterReg.interpret({ kind: 'AST_ANALYSIS' } as any);
    expect(interpreted).toEqual([{ kind: 'ast_analysis', nodesCount: 42 }]);

    const formatterReg = new PromptFormatterRegistry([new AstAnalysisFormatter()]);
    const formatted = formatterReg.format(interpreted[0]);
    expect(formatted?.content).toBe('- AST Nodes Analyzed: 42');
  });
});
