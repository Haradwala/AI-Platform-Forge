"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AiRuntimesModule = void 0;
const tokens_1 = require("../../container/tokens");
const mcp_runtime_1 = require("../../ai/mcp/mcp-runtime");
const cli_manager_1 = require("../../ai/cli/cli-manager");
const claude_runtime_1 = require("../../ai/runtime/cli/claude-runtime");
const gemini_runtime_1 = require("../../ai/runtime/cli/gemini-runtime");
const codex_runtime_1 = require("../../ai/runtime/cli/codex-runtime");
const aider_runtime_1 = require("../../ai/runtime/cli/aider-runtime");
const goose_runtime_1 = require("../../ai/runtime/cli/goose-runtime");
const mock_provider_1 = require("../../ai/providers/mock-provider");
const ollama_provider_1 = require("../../ai/providers/ollama-provider");
const openai_runtime_1 = require("../../ai/runtime/cloud/openai-runtime");
const anthropic_runtime_1 = require("../../ai/runtime/cloud/anthropic-runtime");
const gemini_runtime_2 = require("../../ai/runtime/cloud/gemini-runtime");
const groq_runtime_1 = require("../../ai/runtime/cloud/groq-runtime");
const openrouter_runtime_1 = require("../../ai/runtime/cloud/openrouter-runtime");
const runtime_discovery_engine_1 = require("../../ai/runtime-discovery/runtime-discovery-engine");
const runtime_execution_manager_1 = require("../../ai/runtime/runtime-execution-manager");
const runtime_session_storage_1 = require("../../ai/runtime/runtime-session-storage");
const runtime_event_bus_1 = require("../../ai/runtime/runtime-event-bus");
const runtime_router_1 = require("../../ai/routing/runtime-router");
const runtime_learning_engine_1 = require("../../ai/learning/runtime-learning-engine");
const external_runtime_manager_1 = require("../../ai/external/external-runtime-manager");
class AiRuntimesModule {
    static register(container) {
        // MCP Runtime
        container.registerSingleton({
            token: tokens_1.T.IMCPRuntime,
            name: 'IMCPRuntime',
            lifetime: 'singleton',
            dependencies: [],
            factory: () => new mcp_runtime_1.MCPRuntime()
        });
        // CLI Manager & CLI Runtimes
        container.registerSingleton({
            token: tokens_1.T.ICLIManager,
            name: 'ICLIManager',
            lifetime: 'singleton',
            dependencies: [],
            factory: () => new cli_manager_1.CLIManager()
        });
        container.registerSingleton({
            token: tokens_1.T.ClaudeCodeRuntime,
            name: 'ClaudeCodeRuntime',
            lifetime: 'singleton',
            dependencies: [tokens_1.T.ICLIManager],
            factory: (resolver) => new claude_runtime_1.ClaudeCodeRuntime(resolver.resolve(tokens_1.T.ICLIManager))
        });
        container.registerSingleton({
            token: tokens_1.T.GeminiCLIRuntime,
            name: 'GeminiCLIRuntime',
            lifetime: 'singleton',
            dependencies: [tokens_1.T.ICLIManager],
            factory: (resolver) => new gemini_runtime_1.GeminiCLIRuntime(resolver.resolve(tokens_1.T.ICLIManager))
        });
        container.registerSingleton({
            token: tokens_1.T.CodexCLIRuntime,
            name: 'CodexCLIRuntime',
            lifetime: 'singleton',
            dependencies: [tokens_1.T.ICLIManager],
            factory: (resolver) => new codex_runtime_1.CodexCLIRuntime(resolver.resolve(tokens_1.T.ICLIManager))
        });
        container.registerSingleton({
            token: tokens_1.T.AiderCLIRuntime,
            name: 'AiderCLIRuntime',
            lifetime: 'singleton',
            dependencies: [tokens_1.T.ICLIManager],
            factory: (resolver) => new aider_runtime_1.AiderCLIRuntime(resolver.resolve(tokens_1.T.ICLIManager))
        });
        container.registerSingleton({
            token: tokens_1.T.GooseCLIRuntime,
            name: 'GooseCLIRuntime',
            lifetime: 'singleton',
            dependencies: [tokens_1.T.ICLIManager],
            factory: (resolver) => new goose_runtime_1.GooseCLIRuntime(resolver.resolve(tokens_1.T.ICLIManager))
        });
        // Mock Provider & Ollama Local Runtime
        container.registerSingleton({
            token: tokens_1.T.MockProvider,
            name: 'MockProvider',
            lifetime: 'singleton',
            dependencies: [],
            factory: () => new mock_provider_1.MockProvider()
        });
        container.registerSingleton({
            token: tokens_1.T.OllamaProvider,
            name: 'OllamaProvider',
            lifetime: 'singleton',
            dependencies: [],
            factory: (resolver) => new ollama_provider_1.OllamaProvider(resolver, resolver.tryResolve(tokens_1.T.IConfigurationService) ?? undefined)
        });
        // Cloud Runtimes
        container.registerSingleton({
            token: tokens_1.T.OpenAIRuntime,
            name: 'OpenAIRuntime',
            lifetime: 'singleton',
            dependencies: [],
            factory: (resolver) => new openai_runtime_1.OpenAIRuntime(resolver, resolver.tryResolve(tokens_1.T.IConfigurationService) ?? undefined)
        });
        container.registerSingleton({
            token: tokens_1.T.AnthropicRuntime,
            name: 'AnthropicRuntime',
            lifetime: 'singleton',
            dependencies: [],
            factory: (resolver) => new anthropic_runtime_1.AnthropicRuntime(resolver, resolver.tryResolve(tokens_1.T.IConfigurationService) ?? undefined)
        });
        container.registerSingleton({
            token: tokens_1.T.GeminiRuntime,
            name: 'GeminiRuntime',
            lifetime: 'singleton',
            dependencies: [],
            factory: (resolver) => new gemini_runtime_2.GeminiRuntime(resolver, resolver.tryResolve(tokens_1.T.IConfigurationService) ?? undefined)
        });
        container.registerSingleton({
            token: tokens_1.T.GroqRuntime,
            name: 'GroqRuntime',
            lifetime: 'singleton',
            dependencies: [],
            factory: (resolver) => new groq_runtime_1.GroqRuntime(resolver, resolver.tryResolve(tokens_1.T.IConfigurationService) ?? undefined)
        });
        container.registerSingleton({
            token: tokens_1.T.OpenRouterRuntime,
            name: 'OpenRouterRuntime',
            lifetime: 'singleton',
            dependencies: [],
            factory: (resolver) => new openrouter_runtime_1.OpenRouterRuntime(resolver, resolver.tryResolve(tokens_1.T.IConfigurationService) ?? undefined)
        });
        // Runtime Discovery Engine
        container.registerSingleton({
            token: tokens_1.T.IRuntimeDiscoveryEngine,
            name: 'IRuntimeDiscoveryEngine',
            lifetime: 'singleton',
            dependencies: [],
            factory: () => new runtime_discovery_engine_1.RuntimeDiscoveryEngine()
        });
        // Session Storage & Event Bus
        container.registerSingleton({
            token: tokens_1.T.ISessionStorage,
            name: 'ISessionStorage',
            lifetime: 'singleton',
            dependencies: [],
            factory: () => new runtime_session_storage_1.JsonSessionStorage()
        });
        container.registerSingleton({
            token: tokens_1.T.IRuntimeEventBus,
            name: 'IRuntimeEventBus',
            lifetime: 'singleton',
            dependencies: [],
            factory: () => new runtime_event_bus_1.RuntimeEventBus()
        });
        // Runtime Execution Manager
        container.registerSingleton({
            token: tokens_1.T.IRuntimeExecutionManager,
            name: 'IRuntimeExecutionManager',
            lifetime: 'singleton',
            dependencies: [],
            factory: (resolver) => new runtime_execution_manager_1.RuntimeExecutionManager(resolver.tryResolve(tokens_1.T.IRuntimeEventBus) ?? new runtime_event_bus_1.RuntimeEventBus(), resolver.tryResolve(tokens_1.T.ISessionStorage) ?? new runtime_session_storage_1.JsonSessionStorage(), resolver.tryResolve(tokens_1.T.IRuntimeManager) ?? undefined, resolver.tryResolve(tokens_1.T.IExternalRuntimeManager) ?? undefined, resolver.tryResolve(tokens_1.T.ICLIManager) ?? undefined)
        });
        // Runtime Learning Engine & Router
        container.registerSingleton({
            token: tokens_1.T.IRuntimeLearningEngine,
            name: 'IRuntimeLearningEngine',
            lifetime: 'singleton',
            dependencies: [],
            factory: () => new runtime_learning_engine_1.RuntimeLearningEngine()
        });
        container.registerSingleton({
            token: tokens_1.T.IRuntimeRouter,
            name: 'IRuntimeRouter',
            lifetime: 'singleton',
            dependencies: [],
            factory: (resolver) => new runtime_router_1.RuntimeRouter(resolver.tryResolve(tokens_1.T.IRuntimeLearningEngine) ?? new runtime_learning_engine_1.RuntimeLearningEngine())
        });
        // External Runtime Manager
        container.registerSingleton({
            token: tokens_1.T.IExternalRuntimeManager,
            name: 'IExternalRuntimeManager',
            lifetime: 'singleton',
            dependencies: [tokens_1.T.IRuntimeManager],
            factory: (resolver) => new external_runtime_manager_1.ExternalRuntimeManager(resolver.tryResolve(tokens_1.T.IRuntimeManager) ?? undefined)
        });
    }
}
exports.AiRuntimesModule = AiRuntimesModule;
//# sourceMappingURL=ai-runtimes.module.js.map