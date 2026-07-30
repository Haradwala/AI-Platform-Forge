/**
 * application.module.ts — Composition Module for Application Layer Services
 *
 * Registers application services (Workspace, Terminal, Git, Runtime, Agent, Engineering)
 * in DesktopContainer, keeping application boundary separate from action infrastructure.
 */

import type { IDesktopContainer, IContainerModule } from '../container/interfaces';
import { T } from '../container/tokens';
import { WorkspaceApplicationService } from '../application/workspace/workspace-application-service';
import { TerminalApplicationService } from '../application/terminal/terminal-application-service';
import { GitApplicationService } from '../application/git/git-application-service';
import { RuntimeApplicationService } from '../application/runtime/runtime-application-service';
import { AgentApplicationService } from '../application/agents/agent-application-service';
import { IntelligenceApplicationService } from '../application/intelligence/intelligence-application-service';
import { MultiRuntimeApplicationService } from '../application/runtime/multi-runtime-application-service';
import { AutomationApplicationService } from '../application/automation/automation-application-service';
import { RepositoryHealthApplicationService } from '../repository-health/application/repository-health-application-service';
import { EngineeringApplicationService } from '../application/engineering-application-service';
import { ActionExecutor } from '../ai/actions/action-executor';
import { RuntimeRouter } from '../ai/routing/runtime-router';
import { RuntimeExecutionManager } from '../ai/runtime/runtime-execution-manager';
import { AgentOrchestrator } from '../ai/agents/agent-orchestrator';
import { AgentRegistry } from '../ai/agents/agent-registry';
import { AgentMemory } from '../ai/agents/agent-memory';
import { AutomationModule } from './automation.module';
import { IntelligenceModule } from './intelligence.module';
import { RuntimesModule } from './runtimes.module';

export class ApplicationModule implements IContainerModule {
  readonly name = 'ApplicationModule';

  register(container: IDesktopContainer): void {
    if (container.isModuleLoaded(this.name)) return;

    // Subsystem Modules
    if (!container.isModuleLoaded('AutomationModule')) {
      container.loadModule(new AutomationModule());
    }
    if (!container.isModuleLoaded('IntelligenceModule')) {
      container.loadModule(new IntelligenceModule());
    }
    if (!container.isModuleLoaded('RuntimesModule')) {
      container.loadModule(new RuntimesModule());
    }

    // Workspace Application Service
    container.registerSingleton<WorkspaceApplicationService>({
      token: T.IWorkspaceApplicationService,
      name: 'IWorkspaceApplicationService',
      lifetime: 'singleton',
      dependencies: [T.IActionExecutor],
      factory: (resolver) => new WorkspaceApplicationService(resolver.resolve<ActionExecutor>(T.IActionExecutor))
    });

    // Terminal Application Service
    container.registerSingleton<TerminalApplicationService>({
      token: T.ITerminalApplicationService,
      name: 'ITerminalApplicationService',
      lifetime: 'singleton',
      dependencies: [T.IActionExecutor],
      factory: (resolver) => new TerminalApplicationService(resolver.resolve<ActionExecutor>(T.IActionExecutor))
    });

    // Git Application Service
    container.registerSingleton<GitApplicationService>({
      token: T.IGitApplicationService,
      name: 'IGitApplicationService',
      lifetime: 'singleton',
      dependencies: [T.IActionExecutor],
      factory: (resolver) => new GitApplicationService(resolver.resolve<ActionExecutor>(T.IActionExecutor))
    });

    // Runtime Application Service
    container.registerSingleton<RuntimeApplicationService>({
      token: T.IRuntimeApplicationService,
      name: 'IRuntimeApplicationService',
      lifetime: 'singleton',
      dependencies: [],
      factory: (resolver) => new RuntimeApplicationService(
        resolver.tryResolve<RuntimeRouter>(T.IRuntimeRouter) ?? undefined,
        resolver.tryResolve<RuntimeExecutionManager>(T.IRuntimeExecutionManager) ?? undefined,
        resolver.tryResolve<MultiRuntimeApplicationService>(T.IMultiRuntimeApplicationService) ?? undefined
      )
    });

    // Agent Application Service
    container.registerSingleton<AgentApplicationService>({
      token: T.IAgentApplicationService,
      name: 'IAgentApplicationService',
      lifetime: 'singleton',
      dependencies: [],
      factory: (resolver) => new AgentApplicationService(
        resolver.tryResolve<AgentOrchestrator>(T.IAgentOrchestrator) ?? undefined,
        resolver.tryResolve<AgentRegistry>(T.IAgentRegistry) ?? undefined,
        resolver.tryResolve<AgentMemory>(T.IAgentMemory) ?? undefined
      )
    });

    // Repository Health Application Service
    container.registerSingleton<RepositoryHealthApplicationService>({
      token: T.IRepositoryHealthApplicationService,
      name: 'IRepositoryHealthApplicationService',
      lifetime: 'singleton',
      dependencies: [],
      factory: (resolver) => new RepositoryHealthApplicationService(
        resolver.tryResolve<any>(T.IDesktopEventBus) ?? undefined
      )
    });

    // Engineering Master Application Service Facade
    container.registerSingleton<EngineeringApplicationService>({
      token: T.IEngineeringApplicationService,
      name: 'IEngineeringApplicationService',
      lifetime: 'singleton',
      dependencies: [
        T.IWorkspaceApplicationService,
        T.ITerminalApplicationService,
        T.IGitApplicationService,
        T.IRuntimeApplicationService,
        T.IAgentApplicationService,
        T.IAutomationApplicationService,
        T.IIntelligenceApplicationService
      ],
      factory: (resolver) => new EngineeringApplicationService(
        resolver.resolve<WorkspaceApplicationService>(T.IWorkspaceApplicationService),
        resolver.resolve<TerminalApplicationService>(T.ITerminalApplicationService),
        resolver.resolve<GitApplicationService>(T.IGitApplicationService),
        resolver.resolve<RuntimeApplicationService>(T.IRuntimeApplicationService),
        resolver.resolve<AgentApplicationService>(T.IAgentApplicationService),
        resolver.resolve<AutomationApplicationService>(T.IAutomationApplicationService),
        resolver.resolve<IntelligenceApplicationService>(T.IIntelligenceApplicationService),
        resolver.tryResolve<RepositoryHealthApplicationService>(T.IRepositoryHealthApplicationService) ?? undefined
      )
    });
  }

  static register(container: IDesktopContainer): void {
    if (!container.isModuleLoaded('ApplicationModule')) {
      container.loadModule(new AutomationModule());
      container.loadModule(new IntelligenceModule());
      container.loadModule(new RuntimesModule());
      container.loadModule(new ApplicationModule());
    }
  }
}
