import type { IDesktopContainer, IServiceResolver } from '../../container/interfaces';
import { T } from '../../container/tokens';
import { MCPRuntime } from '../../ai/mcp/mcp-runtime';
import { CLIManager } from '../../ai/cli/cli-manager';
import { ClaudeCodeRuntime } from '../../ai/runtime/cli/claude-runtime';
import { GeminiCLIRuntime } from '../../ai/runtime/cli/gemini-runtime';
import { CodexCLIRuntime } from '../../ai/runtime/cli/codex-runtime';
import { AiderCLIRuntime } from '../../ai/runtime/cli/aider-runtime';
import { GooseCLIRuntime } from '../../ai/runtime/cli/goose-runtime';
import { MockProvider } from '../../ai/providers/mock-provider';
import { OllamaProvider } from '../../ai/providers/ollama-provider';
import { OpenAIRuntime } from '../../ai/runtime/cloud/openai-runtime';
import { AnthropicRuntime } from '../../ai/runtime/cloud/anthropic-runtime';
import { GeminiRuntime } from '../../ai/runtime/cloud/gemini-runtime';
import { GroqRuntime } from '../../ai/runtime/cloud/groq-runtime';
import { OpenRouterRuntime } from '../../ai/runtime/cloud/openrouter-runtime';
import { RuntimeManager } from '../../ai/runtime/runtime-manager';
import type { IAiRuntime } from '../../ai/runtime/runtime-types';
import { RuntimeDiscoveryEngine } from '../../ai/runtime-discovery/runtime-discovery-engine';
import { RuntimeExecutionManager } from '../../ai/runtime/runtime-execution-manager';
import { JsonSessionStorage } from '../../ai/runtime/runtime-session-storage';
import { RuntimeEventBus } from '../../ai/runtime/runtime-event-bus';
import { RuntimeRouter } from '../../ai/routing/runtime-router';
import { RuntimeLearningEngine } from '../../ai/learning/runtime-learning-engine';
import { ExternalRuntimeManager } from '../../ai/external/external-runtime-manager';
import { ConfigurationService } from '../../config/configuration-service';

export class AiRuntimesModule {
  static register(container: IDesktopContainer): void {
    // MCP Runtime
    container.registerSingleton<MCPRuntime>({
      token: T.IMCPRuntime,
      name: 'IMCPRuntime',
      lifetime: 'singleton',
      dependencies: [],
      factory: () => new MCPRuntime()
    });

    // CLI Manager & CLI Runtimes
    container.registerSingleton<CLIManager>({
      token: T.ICLIManager,
      name: 'ICLIManager',
      lifetime: 'singleton',
      dependencies: [],
      factory: () => new CLIManager()
    });

    container.registerSingleton<ClaudeCodeRuntime>({
      token: T.ClaudeCodeRuntime,
      name: 'ClaudeCodeRuntime',
      lifetime: 'singleton',
      dependencies: [T.ICLIManager],
      factory: (resolver: IServiceResolver) => new ClaudeCodeRuntime(resolver.resolve(T.ICLIManager))
    });

    container.registerSingleton<GeminiCLIRuntime>({
      token: T.GeminiCLIRuntime,
      name: 'GeminiCLIRuntime',
      lifetime: 'singleton',
      dependencies: [T.ICLIManager],
      factory: (resolver: IServiceResolver) => new GeminiCLIRuntime(resolver.resolve(T.ICLIManager))
    });

    container.registerSingleton<CodexCLIRuntime>({
      token: T.CodexCLIRuntime,
      name: 'CodexCLIRuntime',
      lifetime: 'singleton',
      dependencies: [T.ICLIManager],
      factory: (resolver: IServiceResolver) => new CodexCLIRuntime(resolver.resolve(T.ICLIManager))
    });

    container.registerSingleton<AiderCLIRuntime>({
      token: T.AiderCLIRuntime,
      name: 'AiderCLIRuntime',
      lifetime: 'singleton',
      dependencies: [T.ICLIManager],
      factory: (resolver: IServiceResolver) => new AiderCLIRuntime(resolver.resolve(T.ICLIManager))
    });

    container.registerSingleton<GooseCLIRuntime>({
      token: T.GooseCLIRuntime,
      name: 'GooseCLIRuntime',
      lifetime: 'singleton',
      dependencies: [T.ICLIManager],
      factory: (resolver: IServiceResolver) => new GooseCLIRuntime(resolver.resolve(T.ICLIManager))
    });

    // Mock Provider & Ollama Local Runtime
    container.registerSingleton<MockProvider>({
      token: T.MockProvider,
      name: 'MockProvider',
      lifetime: 'singleton',
      dependencies: [],
      factory: () => new MockProvider()
    });

    container.registerSingleton<OllamaProvider>({
      token: T.OllamaProvider,
      name: 'OllamaProvider',
      lifetime: 'singleton',
      dependencies: [],
      factory: (resolver: IServiceResolver) => new OllamaProvider(
        resolver,
        resolver.tryResolve<ConfigurationService>(T.IConfigurationService) ?? undefined
      )
    });

    // Cloud Runtimes
    container.registerSingleton<OpenAIRuntime>({
      token: T.OpenAIRuntime,
      name: 'OpenAIRuntime',
      lifetime: 'singleton',
      dependencies: [],
      factory: (resolver: IServiceResolver) => new OpenAIRuntime(
        resolver,
        resolver.tryResolve<ConfigurationService>(T.IConfigurationService) ?? undefined
      )
    });

    container.registerSingleton<AnthropicRuntime>({
      token: T.AnthropicRuntime,
      name: 'AnthropicRuntime',
      lifetime: 'singleton',
      dependencies: [],
      factory: (resolver: IServiceResolver) => new AnthropicRuntime(
        resolver,
        resolver.tryResolve<ConfigurationService>(T.IConfigurationService) ?? undefined
      )
    });

    container.registerSingleton<GeminiRuntime>({
      token: T.GeminiRuntime,
      name: 'GeminiRuntime',
      lifetime: 'singleton',
      dependencies: [],
      factory: (resolver: IServiceResolver) => new GeminiRuntime(
        resolver,
        resolver.tryResolve<ConfigurationService>(T.IConfigurationService) ?? undefined
      )
    });

    container.registerSingleton<GroqRuntime>({
      token: T.GroqRuntime,
      name: 'GroqRuntime',
      lifetime: 'singleton',
      dependencies: [],
      factory: (resolver: IServiceResolver) => new GroqRuntime(
        resolver,
        resolver.tryResolve<ConfigurationService>(T.IConfigurationService) ?? undefined
      )
    });

    container.registerSingleton<OpenRouterRuntime>({
      token: T.OpenRouterRuntime,
      name: 'OpenRouterRuntime',
      lifetime: 'singleton',
      dependencies: [],
      factory: (resolver: IServiceResolver) => new OpenRouterRuntime(
        resolver,
        resolver.tryResolve<ConfigurationService>(T.IConfigurationService) ?? undefined
      )
    });



    // Runtime Discovery Engine
    container.registerSingleton<RuntimeDiscoveryEngine>({
      token: T.IRuntimeDiscoveryEngine,
      name: 'IRuntimeDiscoveryEngine',
      lifetime: 'singleton',
      dependencies: [],
      factory: () => new RuntimeDiscoveryEngine()
    });

    // Session Storage & Event Bus
    container.registerSingleton<JsonSessionStorage>({
      token: T.ISessionStorage,
      name: 'ISessionStorage',
      lifetime: 'singleton',
      dependencies: [],
      factory: () => new JsonSessionStorage()
    });

    container.registerSingleton<RuntimeEventBus>({
      token: T.IRuntimeEventBus,
      name: 'IRuntimeEventBus',
      lifetime: 'singleton',
      dependencies: [],
      factory: () => new RuntimeEventBus()
    });

    // Runtime Execution Manager
    container.registerSingleton<RuntimeExecutionManager>({
      token: T.IRuntimeExecutionManager,
      name: 'IRuntimeExecutionManager',
      lifetime: 'singleton',
      dependencies: [],
      factory: (resolver: IServiceResolver) => new RuntimeExecutionManager(
        resolver.tryResolve<RuntimeEventBus>(T.IRuntimeEventBus) ?? new RuntimeEventBus(),
        resolver.tryResolve<JsonSessionStorage>(T.ISessionStorage) ?? new JsonSessionStorage(),
        resolver.tryResolve<RuntimeManager>(T.IRuntimeManager) ?? undefined,
        resolver.tryResolve<ExternalRuntimeManager>(T.IExternalRuntimeManager) ?? undefined,
        resolver.tryResolve<CLIManager>(T.ICLIManager) ?? undefined
      )
    });

    // Runtime Learning Engine & Router
    container.registerSingleton<RuntimeLearningEngine>({
      token: T.IRuntimeLearningEngine,
      name: 'IRuntimeLearningEngine',
      lifetime: 'singleton',
      dependencies: [],
      factory: () => new RuntimeLearningEngine()
    });

    container.registerSingleton<RuntimeRouter>({
      token: T.IRuntimeRouter,
      name: 'IRuntimeRouter',
      lifetime: 'singleton',
      dependencies: [],
      factory: (resolver: IServiceResolver) => new RuntimeRouter(
        resolver.tryResolve<RuntimeLearningEngine>(T.IRuntimeLearningEngine) ?? new RuntimeLearningEngine()
      )
    });

    // External Runtime Manager
    container.registerSingleton<ExternalRuntimeManager>({
      token: T.IExternalRuntimeManager,
      name: 'IExternalRuntimeManager',
      lifetime: 'singleton',
      dependencies: [T.IRuntimeManager],
      factory: (resolver: IServiceResolver) => new ExternalRuntimeManager(
        resolver.tryResolve<RuntimeManager>(T.IRuntimeManager) ?? undefined
      )
    });
  }
}
