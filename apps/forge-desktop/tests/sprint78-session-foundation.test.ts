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
import { ContextResolutionService } from '../electron/main/ai/memory/resolution/context-resolution-service';
import { ExecutionDomain } from '../electron/main/ai/memory/domains/execution-domain';

describe('Sprint 78 — Session Foundation & Memory Core Integration Tests', () => {
  let container: DesktopContainer;
  let sessionManager: SessionContextManager;
  let resolutionService: ContextResolutionService;
  let orchestrator: AiOrchestrator;

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
    resolutionService = container.resolve<ContextResolutionService>(T.IContextResolutionService);
    orchestrator = container.resolve<AiOrchestrator>(T.IAiOrchestrator);

    const workspaceService = container.resolve<any>(T.IWorkspaceService);
    const mockRoot = path.join(__dirname, '../electron');
    workspaceService.getRootPath = () => mockRoot;

    // Clear session for clean test isolation
    sessionManager.clearSession('default_session');
  });

  it('Scenario 1: Turn 1 "How many files?" -> Turn 2 "List them" resolves Turn 1 file list', async () => {
    // Turn 1
    const res1 = await orchestrator.executeRequest({
      id: 'req_sprint78_1a',
      prompt: 'How many files are in this workspace?',
    });
    expect(res1.success).toBe(true);

    const session = sessionManager.getActiveSession();
    expect(session.execution.getEvents().length).toBeGreaterThan(0);

    // Turn 2
    const res2 = await orchestrator.executeRequest({
      id: 'req_sprint78_1b',
      prompt: 'List them',
    });
    expect(res2.success).toBe(true);

    // Verify resolved prompt hint attached in initialContext
    expect(res2.finalContext.prompt).toContain('Referring to previously found files:');
  }, 20000);

  it('Scenario 2: Turn 1 "How many files?" -> Turn 2 "List them" -> Turn 3 "How many were there?" returns count without re-execution', async () => {
    await orchestrator.executeRequest({
      id: 'req_sprint78_2a',
      prompt: 'How many files are in this workspace?',
    });

    await orchestrator.executeRequest({
      id: 'req_sprint78_2b',
      prompt: 'List them',
    });

    const res3 = await orchestrator.executeRequest({
      id: 'req_sprint78_2c',
      prompt: 'How many were there?',
    });

    expect(res3.success).toBe(true);
    expect(res3.finalContext.prompt).toContain('Previously recorded count:');
  }, 20000);

  it('Scenario 3: "Read main/index.ts" -> "Summarize it" -> "Explain that section" (Context survival)', async () => {
    const session = sessionManager.getActiveSession();

    // Emit simulated file_content event
    session.execution.emitEvent({
      id: 'evt_sim_read_1',
      sessionId: session.sessionId,
      turnId: 'req_read_1',
      taskId: 'task_read_1',
      toolId: 'read_file',
      type: 'tool_completed',
      timestamp: new Date().toISOString(),
      durationMs: 12,
      success: true,
      payload: {
        filePath: 'main/index.ts',
        content: 'console.log("Hello Forge Main");',
      },
    });

    const resolvedTurn2 = resolutionService.resolve('Summarize it', session);
    expect(resolvedTurn2.hasResolvedReferences).toBe(true);
    expect(resolvedTurn2.resolvedPrompt).toContain('main/index.ts');

    const resolvedTurn3 = resolutionService.resolve('Explain that section', session);
    expect(resolvedTurn3.hasResolvedReferences).toBe(true);
    expect(resolvedTurn3.resolvedPrompt).toContain('main/index.ts');
  });

  it('Scenario 4: "Run tests" -> "Fix the error" (Error target identification)', async () => {
    const session = sessionManager.getActiveSession();

    // Emit simulated tool_failed event
    session.execution.emitEvent({
      id: 'evt_sim_fail_1',
      sessionId: session.sessionId,
      turnId: 'req_test_1',
      taskId: 'task_test_1',
      toolId: 'run_terminal_command',
      type: 'tool_failed',
      timestamp: new Date().toISOString(),
      durationMs: 500,
      success: false,
      payload: {
        error: 'TypeError: Cannot read property of undefined in index.ts:42',
      },
    });

    const resolved = resolutionService.resolve('Fix the error', session);
    expect(resolved.hasResolvedReferences).toBe(true);
    expect(resolved.resolvedPrompt).toContain('TypeError: Cannot read property of undefined');
  });

  it('Scenario 5: Multi-turn flow "Search for main/index.ts" -> "Open it" -> "Summarize it"', async () => {
    const session = sessionManager.getActiveSession();

    // Turn 1 search result
    session.execution.emitEvent({
      id: 'evt_sim_search_1',
      sessionId: session.sessionId,
      turnId: 'req_search_1',
      taskId: 'task_search_1',
      toolId: 'search_workspace',
      type: 'tool_completed',
      timestamp: new Date().toISOString(),
      durationMs: 15,
      success: true,
      payload: {
        results: [{ filePath: 'main/index.ts' }],
      },
    });

    const resTurn2 = resolutionService.resolve('Open it', session);
    expect(resTurn2.hasResolvedReferences).toBe(true);
    expect(resTurn2.resolvedPrompt).toContain('main/index.ts');

    // Turn 2 execution result (read file content)
    session.execution.emitEvent({
      id: 'evt_sim_open_1',
      sessionId: session.sessionId,
      turnId: 'req_open_1',
      taskId: 'task_open_1',
      toolId: 'read_file',
      type: 'tool_completed',
      timestamp: new Date().toISOString(),
      durationMs: 8,
      success: true,
      payload: {
        filePath: 'main/index.ts',
        content: '// Entry point',
      },
    });

    const resTurn3 = resolutionService.resolve('Summarize it', session);
    expect(resTurn3.hasResolvedReferences).toBe(true);
    expect(resTurn3.resolvedPrompt).toContain('main/index.ts');
  });
});
