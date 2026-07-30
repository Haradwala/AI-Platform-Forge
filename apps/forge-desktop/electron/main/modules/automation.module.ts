/**
 * automation.module.ts — Composition Module for Engineering Automation Engine
 *
 * Registers WorkflowDefinitionParser, WorkflowTemplateRegistry, AutomationArtifactStore,
 * AutomationTimelinePublisher, AutomationResourceScheduler, AutomationStepExecutor,
 * AutomationPipelineRunner, AutomationCoordinator, TriggerManager, and
 * AutomationApplicationService in DesktopContainer.
 */

import type { IContainerModule, IDesktopContainer } from '../container/interfaces';
import { T } from '../container/tokens';
import { WorkflowDefinitionParser } from '../automation/parser/workflow-definition-parser';
import { WorkflowTemplateRegistry } from '../automation/templates/workflow-template-registry';
import { AutomationArtifactStore } from '../automation/artifacts/automation-artifact-store';
import { AutomationTimelinePublisher } from '../automation/timeline/automation-timeline-publisher';
import { AutomationResourceScheduler } from '../automation/scheduler/automation-resource-scheduler';
import { AutomationStepExecutor } from '../automation/execution/automation-step-executor';
import { AutomationPipelineRunner } from '../automation/execution/automation-pipeline-runner';
import { AutomationCoordinator } from '../automation/coordinator/automation-coordinator';
import { TriggerManager } from '../automation/triggers/trigger-manager';
import { AutomationApplicationService } from '../application/automation/automation-application-service';
import type { IDesktopEventBus } from '../container/service-interfaces';
import type { ActionExecutor } from '../ai/actions/action-executor';
import type { AgentOrchestrator } from '../ai/agents/agent-orchestrator';

export class AutomationModule implements IContainerModule {
  readonly name = 'AutomationModule';

  register(container: IDesktopContainer): void {
    if (container.isModuleLoaded(this.name)) return;

    // 1. Workflow Definition Parser
    container.registerSingleton<WorkflowDefinitionParser>({
      token: T.IWorkflowDefinitionParser,
      name: 'IWorkflowDefinitionParser',
      lifetime: 'singleton',
      dependencies: [],
      factory: () => new WorkflowDefinitionParser(),
    });

    // 2. Workflow Template Registry
    container.registerSingleton<WorkflowTemplateRegistry>({
      token: T.IWorkflowTemplateRegistry,
      name: 'IWorkflowTemplateRegistry',
      lifetime: 'singleton',
      dependencies: [],
      factory: () => new WorkflowTemplateRegistry(),
    });

    // 3. Artifact Store
    container.registerSingleton<AutomationArtifactStore>({
      token: T.IAutomationArtifactStore,
      name: 'IAutomationArtifactStore',
      lifetime: 'singleton',
      dependencies: [],
      factory: () => new AutomationArtifactStore(),
    });

    // 4. Timeline Publisher
    container.registerSingleton<AutomationTimelinePublisher>({
      token: T.IAutomationTimelinePublisher,
      name: 'IAutomationTimelinePublisher',
      lifetime: 'singleton',
      dependencies: [],
      factory: (r) => new AutomationTimelinePublisher(
        r.tryResolve<IDesktopEventBus>(T.IDesktopEventBus) ?? undefined
      ),
    });

    // 5. Resource Scheduler
    container.registerSingleton<AutomationResourceScheduler>({
      token: T.IAutomationResourceScheduler,
      name: 'IAutomationResourceScheduler',
      lifetime: 'singleton',
      dependencies: [],
      factory: () => new AutomationResourceScheduler(4),
    });

    // 6. Step Executor
    container.registerSingleton<AutomationStepExecutor>({
      token: T.IAutomationStepExecutor,
      name: 'IAutomationStepExecutor',
      lifetime: 'singleton',
      dependencies: [],
      factory: (r) => new AutomationStepExecutor(
        r.tryResolve<ActionExecutor>(T.IActionExecutor) ?? undefined,
        r.tryResolve<AgentOrchestrator>(T.IAgentOrchestrator) ?? undefined,
        r.resolve<AutomationArtifactStore>(T.IAutomationArtifactStore)
      ),
    });

    // 7. Pipeline Runner
    container.registerSingleton<AutomationPipelineRunner>({
      token: T.IAutomationPipelineRunner,
      name: 'IAutomationPipelineRunner',
      lifetime: 'singleton',
      dependencies: [T.IAutomationStepExecutor, T.IAutomationTimelinePublisher, T.IAutomationResourceScheduler],
      factory: (r) => new AutomationPipelineRunner(
        r.resolve<AutomationStepExecutor>(T.IAutomationStepExecutor),
        r.resolve<AutomationTimelinePublisher>(T.IAutomationTimelinePublisher),
        r.resolve<AutomationResourceScheduler>(T.IAutomationResourceScheduler)
      ),
    });

    // 8. Automation Coordinator
    container.registerSingleton<AutomationCoordinator>({
      token: T.IAutomationCoordinator,
      name: 'IAutomationCoordinator',
      lifetime: 'singleton',
      dependencies: [T.IAutomationPipelineRunner, T.IAutomationResourceScheduler, T.IAutomationArtifactStore],
      factory: (r) => new AutomationCoordinator(
        r.resolve<AutomationPipelineRunner>(T.IAutomationPipelineRunner),
        r.resolve<AutomationResourceScheduler>(T.IAutomationResourceScheduler),
        r.resolve<AutomationArtifactStore>(T.IAutomationArtifactStore)
      ),
    });

    // 9. Trigger Manager
    container.registerSingleton<TriggerManager>({
      token: T.ITriggerManager,
      name: 'ITriggerManager',
      lifetime: 'singleton',
      dependencies: [],
      factory: (r) => new TriggerManager(
        r.tryResolve<IDesktopEventBus>(T.IDesktopEventBus) ?? undefined,
        r.tryResolve<AutomationCoordinator>(T.IAutomationCoordinator) ?? undefined
      ),
    });

    // 10. Application Layer Service Facade
    container.registerSingleton<AutomationApplicationService>({
      token: T.IAutomationApplicationService,
      name: 'IAutomationApplicationService',
      lifetime: 'singleton',
      dependencies: [
        T.IAutomationCoordinator,
        T.IWorkflowDefinitionParser,
        T.ITriggerManager,
        T.IWorkflowTemplateRegistry,
        T.IAutomationArtifactStore,
      ],
      factory: (r) => new AutomationApplicationService(
        r.resolve<AutomationCoordinator>(T.IAutomationCoordinator),
        r.resolve<WorkflowDefinitionParser>(T.IWorkflowDefinitionParser),
        r.resolve<TriggerManager>(T.ITriggerManager),
        r.resolve<WorkflowTemplateRegistry>(T.IWorkflowTemplateRegistry),
        r.resolve<AutomationArtifactStore>(T.IAutomationArtifactStore)
      ),
    });
  }

  static register(container: IDesktopContainer): void {
    new AutomationModule().register(container);
  }
}
