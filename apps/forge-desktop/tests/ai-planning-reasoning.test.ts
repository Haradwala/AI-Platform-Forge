import { describe, it, expect } from 'vitest';
import { ContextSufficiencyChecker } from '../electron/main/ai/context/context-sufficiency';
import { IntentDetector } from '../electron/main/ai/planner/intent-detector';
import { GoalExtractor } from '../electron/main/ai/planner/goal-extractor';
import { EvidenceCollector, AssumptionManager, ConstraintRegistry, ReasoningEngine } from '../electron/main/ai/reasoning/reasoning-engine';
import { DependencyResolver } from '../electron/main/ai/planner/dependency-resolver';
import { GoalTaskPlanner } from '../electron/main/ai/planner/task-planner';
import { PlanValidator } from '../electron/main/ai/planner/plan-validator';
import { PlanScorer } from '../electron/main/ai/planner/plan-scorer';
import { PlanApprovalPolicy } from '../electron/main/ai/planner/plan-approval-policy';
import { ToolSelector } from '../electron/main/ai/planner/tool-selector';
import { ExecutionPlanner } from '../electron/main/ai/planner/execution-planner';

describe('AI Planning & Reasoning System (Milestone 3.2)', () => {

  describe('Context Sufficiency Checker', () => {
    it('checks context completeness and details queries on missing indices', () => {
      const checker = new ContextSufficiencyChecker();
      const mockPackage = {
        timestamp: '',
        conversationId: '',
        activeProviderId: '',
        activeModelId: '',
        budgetTokens: 100,
        items: [],
      };

      const result = checker.checkSufficiency(mockPackage, 'fix login.ts errors');
      expect(result.sufficient).toBe(false);
      expect(result.missingDetails).toContain('Missing Active Editor Context.');
    });
  });

  describe('Intent & Goal Parsing Layer', () => {
    it('categorizes user request intent types correctly', () => {
      const detector = new IntentDetector();
      const intent = detector.detectIntent('please run tests and fix auth');
      expect(intent.type).toBe('debug');
      expect(intent.confidence).toBeGreaterThan(0.9);
    });

    it('extracts target files scope definitions from goal text parameters', () => {
      const extractor = new GoalExtractor();
      const goal = extractor.extractGoal('update login.ts component', 'login.ts');
      expect(goal.scope).toBe('file');
      expect(goal.targetFiles).toContain('login.ts');
    });
  });

  describe('Evidence & Assumptions Mappings', () => {
    it('records evidence snippets and tracks confidence logs', () => {
      const collector = new EvidenceCollector();
      const assumptions = new AssumptionManager();

      const evidence = collector.collectEvidence('auth.ts', 'class Jwt {}', [10, 20]);
      expect(evidence.snippet).toBe('class Jwt {}');

      const assumption = assumptions.addAssumption('Jwt is standard auth strategy', 0.95, evidence.id);
      expect(assumption.confidence).toBe(0.95);
      expect(assumption.evidenceId).toBe(evidence.id);
    });
  });

  describe('Constraint Registry & Reasoning Engine', () => {
    it('checks code constraints and evaluates planning risks', () => {
      const collector = new EvidenceCollector();
      const assumptions = new AssumptionManager();
      const registry = new ConstraintRegistry();
      const reasoning = new ReasoningEngine(assumptions, registry, collector);

      const report = reasoning.reason('debug database connection errors in package.json', []);
      expect(report.risksAssessed[0].level).toBe('high');
      expect(report.alternativeStrategies.length).toBeGreaterThan(0);
    });
  });

  describe('Dependency Resolving & Task Planning', () => {
    it('orders tasks sequentially based on imports dependencies', () => {
      const resolver = new DependencyResolver();
      const relations = resolver.resolveDependencies(['App.tsx', 'LoginController.ts', 'AuthService.ts']);
      
      const appRelation = relations.find((r) => r.file === 'App.tsx');
      expect(appRelation?.dependsOn).toContain('LoginController.ts');
    });

    it('constructs a validated graph with tool assignments and approvals policies', () => {
      const planner = new GoalTaskPlanner();
      const validator = new PlanValidator();
      const scorer = new PlanScorer();
      const policy = new PlanApprovalPolicy();
      const toolSelector = new ToolSelector();
      const execPlanner = new ExecutionPlanner();

      const mockGoal = {
        id: 'g1',
        description: 'Update auth.ts logic',
        scope: 'file' as const,
        targetFiles: ['auth.ts'],
      };

      const graph = planner.buildTaskGraph(mockGoal);
      const validation = validator.validate(graph);
      expect(validation.valid).toBe(true);

      const score = scorer.scorePlan(graph);
      expect(score.riskFactor).toBe('medium');

      const approval = policy.evaluateApprovalPolicy(score);
      expect(approval).toBe('ask_user');

      const tool = toolSelector.selectToolForTask(graph.nodes[0].title, graph.nodes[0].description);
      expect(tool).toBe('read_file');

      const strategy = execPlanner.determineStrategy(graph);
      expect(strategy.rollbackEnabled).toBe(true);
    });

    it('classifies repository intents correctly for workspace statistics, TODO search, file search, symbol search, and directory listing', () => {
      const planner = new GoalTaskPlanner();

      // 1. Workspace Statistics
      const intentStats = planner.classifyIntent('How many files are in this workspace?');
      expect(intentStats.type).toBe('workspace_statistics');
      const graphStats = planner.buildTaskGraph({ id: 'g1', description: 'How many files are in this workspace?', scope: 'workspace', targetFiles: [] });
      expect(graphStats.nodes[0].toolId).toBe('search_workspace');

      // 2. TODO search
      const intentTodo = planner.classifyIntent('Search TODO');
      expect(intentTodo.type).toBe('text_search');
      if (intentTodo.type === 'text_search') {
        expect(intentTodo.text).toBe('TODO');
      }
      const graphTodo = planner.buildTaskGraph({ id: 'g2', description: 'Search TODO', scope: 'workspace', targetFiles: [] });
      expect(graphTodo.nodes[0].toolId).toBe('search_workspace');

      // 3. File search
      const intentFiles = planner.classifyIntent('List all TypeScript files');
      expect(intentFiles.type).toBe('file_search');
      const graphFiles = planner.buildTaskGraph({ id: 'g3', description: 'List all TypeScript files', scope: 'workspace', targetFiles: [] });
      expect(graphFiles.nodes[0].toolId).toBe('search_workspace');

      // 4. Symbol search
      const intentSymbol = planner.classifyIntent('Find symbol TaskPlanner');
      expect(intentSymbol.type).toBe('symbol_lookup');
      if (intentSymbol.type === 'symbol_lookup') {
        expect(intentSymbol.symbol).toBe('TaskPlanner');
      }
      const graphSymbol = planner.buildTaskGraph({ id: 'g4', description: 'Find symbol TaskPlanner', scope: 'workspace', targetFiles: [] });
      expect(graphSymbol.nodes[0].toolId).toBe('search_workspace');

      // 5. Directory listing
      const intentDir = planner.classifyIntent('List project folders');
      expect(intentDir.type).toBe('list_dir');
      const graphDir = planner.buildTaskGraph({ id: 'g5', description: 'List project folders', scope: 'workspace', targetFiles: [] });
      expect(graphDir.nodes[0].toolId).toBe('list_dir');
    });
  });
});
