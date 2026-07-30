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
import { ApplicationModule } from './application.module';
import { AiFoundationModule } from './ai/ai-foundation.module';
import { AiIntelligenceModule } from './ai/ai-intelligence.module';
import { AiRuntimesModule } from './ai/ai-runtimes.module';
import { AiActionsModule } from './ai/ai-actions.module';
import { AiAgentsModule } from './ai/ai-agents.module';

export class AiModule implements IContainerModule {
  readonly name = 'AiModule';

  register(container: IDesktopContainer): void {
    ApplicationModule.register(container);
    AiFoundationModule.register(container);
    AiIntelligenceModule.register(container);
    AiRuntimesModule.register(container);
    AiActionsModule.register(container);
    AiAgentsModule.register(container);
  }

  static register(container: IDesktopContainer): void {
    new AiModule().register(container);
  }
}
