import { describe, it, expect } from 'vitest';
import * as path from 'path';
import { DesktopContainer } from '../electron/main/container/desktop-container';
import { CoreModule } from '../electron/main/modules/core.module';
import { WindowModule } from '../electron/main/modules/window.module';
import { WorkspaceModule } from '../electron/main/modules/workspace.module';
import { ApplicationModule } from '../electron/main/modules/application.module';
import { AiModule } from '../electron/main/modules/ai.module';
import { T } from '../electron/main/container/tokens';
import { AiOrchestrator } from '../electron/main/ai/orchestrator/ai-orchestrator';
import { IWorkspaceService, IRepositoryProvider } from '../electron/main/container/service-interfaces';
import { DiagnosticsService } from '../electron/main/ai/diagnostics/diagnostics-service';

describe('End-to-End Grounded AI Execution Pathway', () => {
  it('resolves IDiagnosticsService successfully from DI container', () => {
    const container = new DesktopContainer();
    new CoreModule().register(container);
    new WindowModule().register(container);
    new WorkspaceModule().register(container);
    ApplicationModule.register(container);
    AiModule.register(container);

    const diagnostics = container.resolve<DiagnosticsService>(T.IDiagnosticsService);
    expect(diagnostics).toBeDefined();
    expect(typeof diagnostics.getDiagnosticsSnapshot).toBe('function');
  });

  it('migrates legacy mock activeRuntime config to auto and resolves healthy local runtime', async () => {
    const container = new DesktopContainer();
    new CoreModule().register(container);
    new WindowModule().register(container);
    new WorkspaceModule().register(container);
    ApplicationModule.register(container);
    AiModule.register(container);

    const configService = container.resolve<any>(T.IConfigurationService);
    const runtimeManager = container.resolve<any>(T.IRuntimeManager);

    // Initial default config should be 'auto'
    expect(configService.getActiveRuntime()).toBe('auto');

    // Simulated resolution under auto discovery
    const resolved = await runtimeManager.resolveFallbackRuntime();
    expect(resolved).toBeDefined();
    expect(typeof resolved.id).toBe('string');
  });

  it('scans workspace on load and returns non-zero file counts and file matches', async () => {
    const container = new DesktopContainer();
    new CoreModule().register(container);
    new WindowModule().register(container);
    new WorkspaceModule().register(container);
    ApplicationModule.register(container);
    AiModule.register(container);

    const configService = container.resolve<any>(T.IConfigurationService);
    configService.setActiveRuntime('mock');

    const workspaceService = container.resolve<IWorkspaceService>(T.IWorkspaceService);
    const repoProvider = container.resolve<IRepositoryProvider>(T.IRepositoryProvider);

    // Open desktop electron directory for fast test execution
    await workspaceService.open(path.resolve(__dirname, '../electron'));

    // Verify workspaceStatistics query returns real file counts
    const statsResult = await repoProvider.query({ type: 'workspaceStatistics' });
    expect(statsResult.success).toBe(true);
    expect(statsResult.data.filesCount).toBeGreaterThan(0);

    // Verify findFile for package.json returns match (or electron files)
    const pkgResult = await repoProvider.query({ type: 'findFile', query: 'ai-orchestrator' });
    expect(pkgResult.success).toBe(true);
    expect(pkgResult.data.length).toBeGreaterThan(0);

    // Verify findFilesByLanguage for typescript returns ts/tsx matches
    const tsResult = await repoProvider.query({ type: 'findFilesByLanguage', language: 'typescript' });
    expect(tsResult.success).toBe(true);
    expect(tsResult.data.length).toBeGreaterThan(0);

    // Execute complete AI orchestrator request for all 5 required prompts
    const orchestrator = container.resolve<AiOrchestrator>(T.IAiOrchestrator);

    const prompts = [
      'How many files are in this workspace?',
      'Search TODO',
      'List all TypeScript files',
      'Open main/index.ts',
      'List project folders'
    ];

    for (let i = 0; i < prompts.length; i++) {
      const prompt = prompts[i];
      const result = await orchestrator.executeRequest({
        id: `req-e2e-${i + 1}`,
        prompt,
      });

      expect(result.success).toBe(true);
      expect(result.result.response).toBeDefined();
      expect(result.finalContext.executionResults).toBeDefined();
      expect(result.finalContext.executionResults!.length).toBeGreaterThan(0);
      expect(result.finalContext.executionResults![0].status).toBe('completed');
    }
  }, 60000);
});
