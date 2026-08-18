import { describe, it, expect, beforeEach } from 'vitest';
import * as path from 'path';
import { DesktopContainer } from '../electron/main/container/desktop-container';
import { CoreModule } from '../electron/main/modules/core.module';
import { WindowModule } from '../electron/main/modules/window.module';
import { WorkspaceModule } from '../electron/main/modules/workspace.module';
import { ApplicationModule } from '../electron/main/modules/application.module';
import { AiModule } from '../electron/main/modules/ai.module';
import { T } from '../electron/main/container/tokens';
import { AiOrchestrator } from '../electron/main/ai/orchestrator/ai-orchestrator';
import { SessionContextManager } from '../electron/main/ai/session/session-context-manager';
import { ExecutionGoal } from '../electron/main/ai/contracts/execution-goal';
import { ExecutionResultKind } from '../electron/main/ai/contracts/execution-result-kind';
import { ResultNormalizer } from '../electron/main/ai/pipeline/result-normalizer';
import { ResultValidator } from '../electron/main/ai/pipeline/result-validator';
import { EntityStore } from '../electron/main/ai/memory/store/entity-store';
import { ListWorkspaceFilesTool, SearchWorkspaceTool, ReadFileTool } from '../electron/main/ai/tools/built-in-tools';

describe('Sprint 80.5 — Execution Contract Stabilization Tests', () => {
  let container: DesktopContainer;
  let sessionManager: SessionContextManager;
  let orchestrator: AiOrchestrator;
  let normalizer: ResultNormalizer;
  let validator: ResultValidator;

  beforeEach(() => {
    container = new DesktopContainer();
    new CoreModule().register(container);
    new WindowModule().register(container);
    new WorkspaceModule().register(container);
    ApplicationModule.register(container);
    AiModule.register(container);

    const configService = container.resolve<any>(T.IConfigurationService);
    configService.setActiveRuntime('mock');

    sessionManager = container.resolve<SessionContextManager>(T.ISessionContextManager);
    orchestrator = container.resolve<AiOrchestrator>(T.IAiOrchestrator);
    normalizer = new ResultNormalizer();
    validator = new ResultValidator();

    const workspaceService = container.resolve<any>(T.IWorkspaceService);
    const mockRoot = path.join(__dirname, '../electron');
    workspaceService.getRootPath = () => mockRoot;

    sessionManager.clearSession('default_session');
  });

  it('Contract Test 1: ListWorkspaceFilesTool returns valid ExecutionResult<IWorkspaceFileListResult>', async () => {
    const workspaceService = container.resolve<any>(T.IWorkspaceService);
    const repositoryProvider = container.resolve<any>(T.IRepositoryProvider);
    const tool = new ListWorkspaceFilesTool(workspaceService, repositoryProvider);

    const result = await tool.execute({});
    expect(result.version).toBe(1);
    expect(result.success).toBe(true);
    expect(result.goal).toBe(ExecutionGoal.FILE_LIST);
    expect(result.kind).toBe(ExecutionResultKind.FILE_LIST);
    expect(Array.isArray(result.payload.files)).toBe(true);
    expect(typeof result.payload.total).toBe('number');

    const validation = validator.validate(result);
    expect(validation.valid).toBe(true);
    expect(validation.errors.length).toBe(0);
  });

  it('Contract Test 2: SearchWorkspaceTool in workspace_statistics mode returns WORKSPACE_STATS envelope without placeholder results', async () => {
    const workspaceService = container.resolve<any>(T.IWorkspaceService);
    const repositoryProvider = container.resolve<any>(T.IRepositoryProvider);
    const tool = new SearchWorkspaceTool(workspaceService, repositoryProvider);

    const result = await tool.execute({ mode: 'workspace_statistics' });
    expect(result.version).toBe(1);
    expect(result.goal).toBe(ExecutionGoal.WORKSPACE_STATISTICS);
    expect(result.kind).toBe(ExecutionResultKind.WORKSPACE_STATS);
    expect(typeof result.payload.filesCount).toBe('number');

    const normalized = normalizer.normalize(result);
    const validation = validator.validate(normalized);
    expect(validation.valid).toBe(true);
    expect(validation.errors.length).toBe(0);
  });

  it('Contract Test 3: EntityStore stores typed entities separate from event history', () => {
    const store = new EntityStore();
    store.set(ExecutionResultKind.FILE_LIST, {
      entityId: 'ent_1',
      category: 'file_list',
      kind: ExecutionResultKind.FILE_LIST,
      key: 'file_list',
      value: ['file1.ts', 'file2.ts'],
      turnId: 'turn_1',
      timestamp: new Date().toISOString(),
    });

    const retrieved = store.getLatest(ExecutionResultKind.FILE_LIST);
    expect(retrieved).toBeDefined();
    expect(retrieved?.value).toEqual(['file1.ts', 'file2.ts']);
  });

  it('Contract Test 4: End-to-end Turn 1 "How many files?" -> Turn 2 "List them" uses typed EntityStore memory', async () => {
    // Turn 1
    const res1 = await orchestrator.executeRequest({
      id: 'turn_1_req',
      prompt: 'How many files are in this project?',
    });
    expect(res1.success).toBe(true);

    const session = sessionManager.getActiveSession();
    expect(session.entities.getLatest(ExecutionResultKind.WORKSPACE_STATS)).toBeDefined();

    // Turn 2
    const res2 = await orchestrator.executeRequest({
      id: 'turn_2_req',
      prompt: 'List them',
    });
    expect(res2.success).toBe(true);
  }, 15000);
});
