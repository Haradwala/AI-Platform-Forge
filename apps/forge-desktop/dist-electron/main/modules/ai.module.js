"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AiModule = void 0;
const tokens_1 = require("../container/tokens");
const application_module_1 = require("./application.module");
const ai_foundation_module_1 = require("./ai/ai-foundation.module");
const ai_intelligence_module_1 = require("./ai/ai-intelligence.module");
const ai_runtimes_module_1 = require("./ai/ai-runtimes.module");
const ai_actions_module_1 = require("./ai/ai-actions.module");
const ai_agents_module_1 = require("./ai/ai-agents.module");
const session_context_manager_1 = require("../ai/session/session-context-manager");
const context_resolution_service_1 = require("../ai/memory/resolution/context-resolution-service");
class AiModule {
    name = 'AiModule';
    register(container) {
        application_module_1.ApplicationModule.register(container);
        ai_foundation_module_1.AiFoundationModule.register(container);
        ai_intelligence_module_1.AiIntelligenceModule.register(container);
        ai_runtimes_module_1.AiRuntimesModule.register(container);
        ai_actions_module_1.AiActionsModule.register(container);
        ai_agents_module_1.AiAgentsModule.register(container);
        try {
            container.registerSingleton({
                token: tokens_1.T.ISessionContextManager,
                name: 'ISessionContextManager',
                lifetime: 'singleton',
                dependencies: [],
                factory: () => new session_context_manager_1.SessionContextManager()
            });
        }
        catch {
            // already registered
        }
        try {
            container.registerSingleton({
                token: tokens_1.T.IContextResolutionService,
                name: 'IContextResolutionService',
                lifetime: 'singleton',
                dependencies: [],
                factory: () => new context_resolution_service_1.ContextResolutionService()
            });
        }
        catch {
            // already registered
        }
    }
    static register(container) {
        new AiModule().register(container);
    }
}
exports.AiModule = AiModule;
//# sourceMappingURL=ai.module.js.map