/**
 * automation.module.ts — Composition Module for Engineering Automation Engine
 *
 * Registers WorkflowDefinitionParser, WorkflowTemplateRegistry, AutomationArtifactStore,
 * AutomationTimelinePublisher, AutomationResourceScheduler, AutomationStepExecutor,
 * AutomationPipelineRunner, AutomationCoordinator, TriggerManager, and
 * AutomationApplicationService in DesktopContainer.
 */
import type { IContainerModule, IDesktopContainer } from '../container/interfaces';
export declare class AutomationModule implements IContainerModule {
    readonly name = "AutomationModule";
    register(container: IDesktopContainer): void;
    static register(container: IDesktopContainer): void;
}
