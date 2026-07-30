"use strict";
/**
 * automation.module.ts — Composition Module for Engineering Automation Engine
 *
 * Registers WorkflowDefinitionParser, WorkflowTemplateRegistry, AutomationArtifactStore,
 * AutomationTimelinePublisher, AutomationResourceScheduler, AutomationStepExecutor,
 * AutomationPipelineRunner, AutomationCoordinator, TriggerManager, and
 * AutomationApplicationService in DesktopContainer.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.AutomationModule = void 0;
const tokens_1 = require("../container/tokens");
const workflow_definition_parser_1 = require("../automation/parser/workflow-definition-parser");
const workflow_template_registry_1 = require("../automation/templates/workflow-template-registry");
const automation_artifact_store_1 = require("../automation/artifacts/automation-artifact-store");
const automation_timeline_publisher_1 = require("../automation/timeline/automation-timeline-publisher");
const automation_resource_scheduler_1 = require("../automation/scheduler/automation-resource-scheduler");
const automation_step_executor_1 = require("../automation/execution/automation-step-executor");
const automation_pipeline_runner_1 = require("../automation/execution/automation-pipeline-runner");
const automation_coordinator_1 = require("../automation/coordinator/automation-coordinator");
const trigger_manager_1 = require("../automation/triggers/trigger-manager");
const automation_application_service_1 = require("../application/automation/automation-application-service");
class AutomationModule {
    name = 'AutomationModule';
    register(container) {
        if (container.isModuleLoaded(this.name))
            return;
        // 1. Workflow Definition Parser
        container.registerSingleton({
            token: tokens_1.T.IWorkflowDefinitionParser,
            name: 'IWorkflowDefinitionParser',
            lifetime: 'singleton',
            dependencies: [],
            factory: () => new workflow_definition_parser_1.WorkflowDefinitionParser(),
        });
        // 2. Workflow Template Registry
        container.registerSingleton({
            token: tokens_1.T.IWorkflowTemplateRegistry,
            name: 'IWorkflowTemplateRegistry',
            lifetime: 'singleton',
            dependencies: [],
            factory: () => new workflow_template_registry_1.WorkflowTemplateRegistry(),
        });
        // 3. Artifact Store
        container.registerSingleton({
            token: tokens_1.T.IAutomationArtifactStore,
            name: 'IAutomationArtifactStore',
            lifetime: 'singleton',
            dependencies: [],
            factory: () => new automation_artifact_store_1.AutomationArtifactStore(),
        });
        // 4. Timeline Publisher
        container.registerSingleton({
            token: tokens_1.T.IAutomationTimelinePublisher,
            name: 'IAutomationTimelinePublisher',
            lifetime: 'singleton',
            dependencies: [],
            factory: (r) => new automation_timeline_publisher_1.AutomationTimelinePublisher(r.tryResolve(tokens_1.T.IDesktopEventBus) ?? undefined),
        });
        // 5. Resource Scheduler
        container.registerSingleton({
            token: tokens_1.T.IAutomationResourceScheduler,
            name: 'IAutomationResourceScheduler',
            lifetime: 'singleton',
            dependencies: [],
            factory: () => new automation_resource_scheduler_1.AutomationResourceScheduler(4),
        });
        // 6. Step Executor
        container.registerSingleton({
            token: tokens_1.T.IAutomationStepExecutor,
            name: 'IAutomationStepExecutor',
            lifetime: 'singleton',
            dependencies: [],
            factory: (r) => new automation_step_executor_1.AutomationStepExecutor(r.tryResolve(tokens_1.T.IActionExecutor) ?? undefined, r.tryResolve(tokens_1.T.IAgentOrchestrator) ?? undefined, r.resolve(tokens_1.T.IAutomationArtifactStore)),
        });
        // 7. Pipeline Runner
        container.registerSingleton({
            token: tokens_1.T.IAutomationPipelineRunner,
            name: 'IAutomationPipelineRunner',
            lifetime: 'singleton',
            dependencies: [tokens_1.T.IAutomationStepExecutor, tokens_1.T.IAutomationTimelinePublisher, tokens_1.T.IAutomationResourceScheduler],
            factory: (r) => new automation_pipeline_runner_1.AutomationPipelineRunner(r.resolve(tokens_1.T.IAutomationStepExecutor), r.resolve(tokens_1.T.IAutomationTimelinePublisher), r.resolve(tokens_1.T.IAutomationResourceScheduler)),
        });
        // 8. Automation Coordinator
        container.registerSingleton({
            token: tokens_1.T.IAutomationCoordinator,
            name: 'IAutomationCoordinator',
            lifetime: 'singleton',
            dependencies: [tokens_1.T.IAutomationPipelineRunner, tokens_1.T.IAutomationResourceScheduler, tokens_1.T.IAutomationArtifactStore],
            factory: (r) => new automation_coordinator_1.AutomationCoordinator(r.resolve(tokens_1.T.IAutomationPipelineRunner), r.resolve(tokens_1.T.IAutomationResourceScheduler), r.resolve(tokens_1.T.IAutomationArtifactStore)),
        });
        // 9. Trigger Manager
        container.registerSingleton({
            token: tokens_1.T.ITriggerManager,
            name: 'ITriggerManager',
            lifetime: 'singleton',
            dependencies: [],
            factory: (r) => new trigger_manager_1.TriggerManager(r.tryResolve(tokens_1.T.IDesktopEventBus) ?? undefined, r.tryResolve(tokens_1.T.IAutomationCoordinator) ?? undefined),
        });
        // 10. Application Layer Service Facade
        container.registerSingleton({
            token: tokens_1.T.IAutomationApplicationService,
            name: 'IAutomationApplicationService',
            lifetime: 'singleton',
            dependencies: [
                tokens_1.T.IAutomationCoordinator,
                tokens_1.T.IWorkflowDefinitionParser,
                tokens_1.T.ITriggerManager,
                tokens_1.T.IWorkflowTemplateRegistry,
                tokens_1.T.IAutomationArtifactStore,
            ],
            factory: (r) => new automation_application_service_1.AutomationApplicationService(r.resolve(tokens_1.T.IAutomationCoordinator), r.resolve(tokens_1.T.IWorkflowDefinitionParser), r.resolve(tokens_1.T.ITriggerManager), r.resolve(tokens_1.T.IWorkflowTemplateRegistry), r.resolve(tokens_1.T.IAutomationArtifactStore)),
        });
    }
    static register(container) {
        new AutomationModule().register(container);
    }
}
exports.AutomationModule = AutomationModule;
//# sourceMappingURL=automation.module.js.map