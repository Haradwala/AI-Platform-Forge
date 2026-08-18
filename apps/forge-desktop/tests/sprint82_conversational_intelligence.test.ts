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
import { ExecutionResultKind } from '../electron/main/ai/contracts/execution-result-kind';

describe('Sprint 82 — Conversational Intelligence End-to-End Test Suite', () => {
  let container: DesktopContainer;
  let sessionManager: SessionContextManager;
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
    orchestrator = container.resolve<AiOrchestrator>(T.IAiOrchestrator);

    const workspaceService = container.resolve<any>(T.IWorkspaceService);
    const mockRoot = path.join(__dirname, '../electron');
    workspaceService.getRootPath = () => mockRoot;

    sessionManager.clearSession('default_session');
  });

  it('Conversation A: "How many files?" -> "List the first 20."', async () => {
    // Turn 1
    const res1 = await orchestrator.executeRequest({
      id: 'convA_turn1',
      prompt: 'How many files are there?',
    });
    expect(res1.success).toBe(true);

    const session = sessionManager.getActiveSession();
    expect(session.entities.getLatest(ExecutionResultKind.WORKSPACE_STATS)).toBeDefined();

    // Turn 2
    const res2 = await orchestrator.executeRequest({
      id: 'convA_turn2',
      prompt: 'List the first 20.',
    });
    expect(res2.success).toBe(true);

    const events = session.execution.getEvents();
    expect(events.length).toBeGreaterThan(0);
  }, 15000);

  it('Conversation B: "Find package.json" -> "Open the first one."', async () => {
    // Turn 1
    const res1 = await orchestrator.executeRequest({
      id: 'convB_turn1',
      prompt: 'Find package.json',
    });
    expect(res1.success).toBe(true);

    // Turn 2
    const res2 = await orchestrator.executeRequest({
      id: 'convB_turn2',
      prompt: 'Open the first one.',
    });
    expect(res2.success).toBe(true);
  }, 15000);

  it('Conversation C: "Run git status" -> "What changed?"', async () => {
    // Turn 1
    const res1 = await orchestrator.executeRequest({
      id: 'convC_turn1',
      prompt: 'Run git status',
    });
    expect(res1.success).toBe(true);

    // Turn 2
    const res2 = await orchestrator.executeRequest({
      id: 'convC_turn2',
      prompt: 'What changed?',
    });
    expect(res2.success).toBe(true);
  }, 15000);
});
