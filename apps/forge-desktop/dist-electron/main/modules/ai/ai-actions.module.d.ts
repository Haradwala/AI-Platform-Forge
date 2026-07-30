/**
 * ai-actions.module.ts — Sub-module for Engineering Action System
 *
 * Registers ActionRegistry, CoreActionProvider, GitActionProvider, UIActionProvider,
 * ActionHistory, and ActionExecutor.
 */
import type { IDesktopContainer } from '../../container/interfaces';
export declare class AiActionsModule {
    static register(container: IDesktopContainer): void;
}
