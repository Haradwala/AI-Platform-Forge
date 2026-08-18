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
import { T } from '../container/tokens';
import { ApplicationModule } from './application.module';
import { AiFoundationModule } from './ai/ai-foundation.module';
import { AiIntelligenceModule } from './ai/ai-intelligence.module';
import { AiRuntimesModule } from './ai/ai-runtimes.module';
import { AiActionsModule } from './ai/ai-actions.module';
import { AiAgentsModule } from './ai/ai-agents.module';
import { SessionContextManager } from '../ai/session/session-context-manager';
import { ContextResolutionService } from '../ai/memory/resolution/context-resolution-service';

export class AiModule implements IContainerModule {
  readonly name = 'AiModule';

  register(container: IDesktopContainer): void {
    ApplicationModule.register(container);
    AiFoundationModule.register(container);
    AiIntelligenceModule.register(container);
    AiRuntimesModule.register(container);
    AiActionsModule.register(container);
    AiAgentsModule.register(container);

    try {
      container.registerSingleton<SessionContextManager>({
        token: T.ISessionContextManager,
        name: 'ISessionContextManager',
        lifetime: 'singleton',
        dependencies: [],
        factory: () => new SessionContextManager()
      });
    } catch {
      // already registered
    }

    try {
      container.registerSingleton<ContextResolutionService>({
        token: T.IContextResolutionService,
        name: 'IContextResolutionService',
        lifetime: 'singleton',
        dependencies: [],
        factory: () => new ContextResolutionService()
      });
    } catch {
      // already registered
    }
  }

  static register(container: IDesktopContainer): void {
    new AiModule().register(container);
  }
}
