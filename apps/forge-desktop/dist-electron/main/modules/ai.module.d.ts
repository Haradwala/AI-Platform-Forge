/**
 * ai.module.ts — Root AI Composition Module
 *
 * Implements IContainerModule and composes domain-specific sub-modules:
 * - ApplicationModule
 * - AiFoundationModule
 * - AiIntelligenceModule
 * - AiRuntimesModule
 * - AiActionsModule
 * - AiAgentsModule
 */
import type { IContainerModule, IDesktopContainer } from '../container/interfaces';
export declare class AiModule implements IContainerModule {
    readonly name = "AiModule";
    register(container: IDesktopContainer): void;
    static register(container: IDesktopContainer): void;
}
