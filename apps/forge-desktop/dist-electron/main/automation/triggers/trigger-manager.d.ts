/**
 * trigger-manager.ts — Central Trigger Manager & Event Multiplexer
 *
 * Listens for system and workspace events on DesktopEventBus and triggers
 * matching workflow executions via AutomationCoordinator.
 */
import type { IDesktopEventBus } from '../../container/service-interfaces';
import { AutomationWorkflowDefinition } from '../contracts/automation-types';
import { AutomationCoordinator } from '../coordinator/automation-coordinator';
export declare class TriggerManager {
    private readonly eventBus?;
    private readonly coordinator?;
    private registeredWorkflows;
    private gitEvaluator;
    private fileWatchEvaluator;
    private cronEvaluator;
    constructor(eventBus?: IDesktopEventBus | undefined, coordinator?: AutomationCoordinator | undefined);
    registerWorkflow(workflow: AutomationWorkflowDefinition): void;
    unregisterWorkflow(workflowId: string): void;
    /**
     * Evaluates an incoming event against all registered workflow triggers.
     */
    evaluateEvent(eventType: string, payload: any): Promise<void>;
    private setupEventListeners;
}
