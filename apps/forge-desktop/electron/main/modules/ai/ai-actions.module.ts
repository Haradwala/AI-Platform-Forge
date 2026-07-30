/**
 * ai-actions.module.ts — Sub-module for Engineering Action System
 *
 * Registers ActionRegistry, CoreActionProvider, GitActionProvider, UIActionProvider,
 * ActionHistory, and ActionExecutor.
 */

import type { IDesktopContainer } from '../../container/interfaces';
import { T } from '../../container/tokens';
import { ActionRegistry } from '../../ai/actions/action-registry';
import { CoreActionProvider } from '../../ai/actions/providers/core-action-provider';
import { GitActionProvider } from '../../ai/actions/providers/git-action-provider';
import { UIActionProvider } from '../../ai/actions/providers/ui-action-provider';
import { ActionHistory } from '../../ai/actions/action-history';
import { ActionExecutor } from '../../ai/actions/action-executor';
import type { IWorkspaceService, ITerminalService, ICodeIntelligenceEngine } from '../../container/service-interfaces';

export class AiActionsModule {
  static register(container: IDesktopContainer): void {
    // Action Registry & Action Providers
    container.registerSingleton<ActionRegistry>({
      token: T.IActionRegistry,
      name: 'IActionRegistry',
      lifetime: 'singleton',
      dependencies: [],
      factory: (resolver) => {
        const registry = new ActionRegistry();
        const wsService = resolver.tryResolve<IWorkspaceService>(T.IWorkspaceService);
        const termService = resolver.tryResolve<ITerminalService>(T.ITerminalService);
        const codeIntel = resolver.tryResolve<ICodeIntelligenceEngine>(T.ICodeIntelligenceEngine);

        registry.registerProvider(new CoreActionProvider(wsService ?? undefined, termService ?? undefined, codeIntel ?? undefined));
        registry.registerProvider(new GitActionProvider());
        registry.registerProvider(new UIActionProvider());
        return registry;
      }
    });

    // Action History
    container.registerSingleton<ActionHistory>({
      token: T.IActionHistory,
      name: 'IActionHistory',
      lifetime: 'singleton',
      dependencies: [],
      factory: () => new ActionHistory()
    });

    // Action Executor
    container.registerSingleton<ActionExecutor>({
      token: T.IActionExecutor,
      name: 'IActionExecutor',
      lifetime: 'singleton',
      dependencies: [],
      factory: (resolver: any) => new ActionExecutor(
        resolver.tryResolve(T.IActionRegistry) ?? new ActionRegistry(),
        resolver.tryResolve(T.IActionHistory) ?? new ActionHistory()
      )
    });
  }
}
