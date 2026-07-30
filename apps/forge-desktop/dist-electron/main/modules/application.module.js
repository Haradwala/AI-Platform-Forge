"use strict";
/**
 * application.module.ts — Composition Module for Application Layer Services
 *
 * Registers application services (Workspace, Terminal, Git, Runtime, Agent, Engineering)
 * in DesktopContainer, keeping application boundary separate from action infrastructure.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApplicationModule = void 0;
const tokens_1 = require("../container/tokens");
const workspace_application_service_1 = require("../application/workspace/workspace-application-service");
const terminal_application_service_1 = require("../application/terminal/terminal-application-service");
const git_application_service_1 = require("../application/git/git-application-service");
const runtime_application_service_1 = require("../application/runtime/runtime-application-service");
const agent_application_service_1 = require("../application/agents/agent-application-service");
const repository_health_application_service_1 = require("../repository-health/application/repository-health-application-service");
const engineering_application_service_1 = require("../application/engineering-application-service");
const automation_module_1 = require("./automation.module");
const intelligence_module_1 = require("./intelligence.module");
const runtimes_module_1 = require("./runtimes.module");
class ApplicationModule {
    name = 'ApplicationModule';
    register(container) {
        if (container.isModuleLoaded(this.name))
            return;
        // Subsystem Modules
        if (!container.isModuleLoaded('AutomationModule')) {
            container.loadModule(new automation_module_1.AutomationModule());
        }
        if (!container.isModuleLoaded('IntelligenceModule')) {
            container.loadModule(new intelligence_module_1.IntelligenceModule());
        }
        if (!container.isModuleLoaded('RuntimesModule')) {
            container.loadModule(new runtimes_module_1.RuntimesModule());
        }
        // Workspace Application Service
        container.registerSingleton({
            token: tokens_1.T.IWorkspaceApplicationService,
            name: 'IWorkspaceApplicationService',
            lifetime: 'singleton',
            dependencies: [tokens_1.T.IActionExecutor],
            factory: (resolver) => new workspace_application_service_1.WorkspaceApplicationService(resolver.resolve(tokens_1.T.IActionExecutor))
        });
        // Terminal Application Service
        container.registerSingleton({
            token: tokens_1.T.ITerminalApplicationService,
            name: 'ITerminalApplicationService',
            lifetime: 'singleton',
            dependencies: [tokens_1.T.IActionExecutor],
            factory: (resolver) => new terminal_application_service_1.TerminalApplicationService(resolver.resolve(tokens_1.T.IActionExecutor))
        });
        // Git Application Service
        container.registerSingleton({
            token: tokens_1.T.IGitApplicationService,
            name: 'IGitApplicationService',
            lifetime: 'singleton',
            dependencies: [tokens_1.T.IActionExecutor],
            factory: (resolver) => new git_application_service_1.GitApplicationService(resolver.resolve(tokens_1.T.IActionExecutor))
        });
        // Runtime Application Service
        container.registerSingleton({
            token: tokens_1.T.IRuntimeApplicationService,
            name: 'IRuntimeApplicationService',
            lifetime: 'singleton',
            dependencies: [],
            factory: (resolver) => new runtime_application_service_1.RuntimeApplicationService(resolver.tryResolve(tokens_1.T.IRuntimeRouter) ?? undefined, resolver.tryResolve(tokens_1.T.IRuntimeExecutionManager) ?? undefined, resolver.tryResolve(tokens_1.T.IMultiRuntimeApplicationService) ?? undefined)
        });
        // Agent Application Service
        container.registerSingleton({
            token: tokens_1.T.IAgentApplicationService,
            name: 'IAgentApplicationService',
            lifetime: 'singleton',
            dependencies: [],
            factory: (resolver) => new agent_application_service_1.AgentApplicationService(resolver.tryResolve(tokens_1.T.IAgentOrchestrator) ?? undefined, resolver.tryResolve(tokens_1.T.IAgentRegistry) ?? undefined, resolver.tryResolve(tokens_1.T.IAgentMemory) ?? undefined)
        });
        // Repository Health Application Service
        container.registerSingleton({
            token: tokens_1.T.IRepositoryHealthApplicationService,
            name: 'IRepositoryHealthApplicationService',
            lifetime: 'singleton',
            dependencies: [],
            factory: (resolver) => new repository_health_application_service_1.RepositoryHealthApplicationService(resolver.tryResolve(tokens_1.T.IDesktopEventBus) ?? undefined)
        });
        // Engineering Master Application Service Facade
        container.registerSingleton({
            token: tokens_1.T.IEngineeringApplicationService,
            name: 'IEngineeringApplicationService',
            lifetime: 'singleton',
            dependencies: [
                tokens_1.T.IWorkspaceApplicationService,
                tokens_1.T.ITerminalApplicationService,
                tokens_1.T.IGitApplicationService,
                tokens_1.T.IRuntimeApplicationService,
                tokens_1.T.IAgentApplicationService,
                tokens_1.T.IAutomationApplicationService,
                tokens_1.T.IIntelligenceApplicationService
            ],
            factory: (resolver) => new engineering_application_service_1.EngineeringApplicationService(resolver.resolve(tokens_1.T.IWorkspaceApplicationService), resolver.resolve(tokens_1.T.ITerminalApplicationService), resolver.resolve(tokens_1.T.IGitApplicationService), resolver.resolve(tokens_1.T.IRuntimeApplicationService), resolver.resolve(tokens_1.T.IAgentApplicationService), resolver.resolve(tokens_1.T.IAutomationApplicationService), resolver.resolve(tokens_1.T.IIntelligenceApplicationService), resolver.tryResolve(tokens_1.T.IRepositoryHealthApplicationService) ?? undefined)
        });
    }
    static register(container) {
        if (!container.isModuleLoaded('ApplicationModule')) {
            container.loadModule(new automation_module_1.AutomationModule());
            container.loadModule(new intelligence_module_1.IntelligenceModule());
            container.loadModule(new runtimes_module_1.RuntimesModule());
            container.loadModule(new ApplicationModule());
        }
    }
}
exports.ApplicationModule = ApplicationModule;
//# sourceMappingURL=application.module.js.map