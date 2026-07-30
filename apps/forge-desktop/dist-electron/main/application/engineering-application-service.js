"use strict";
/**
 * engineering-application-service.ts — Master Application Service Facade
 *
 * Combines all domain-specific application services (Workspace, Terminal, Git, Runtime, Agent)
 * into a single unified application boundary interface.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.EngineeringApplicationService = void 0;
class EngineeringApplicationService {
    workspace;
    terminal;
    git;
    runtime;
    agents;
    automation;
    intelligence;
    health;
    constructor(workspace, terminal, git, runtime, agents, automation, intelligence, health) {
        this.workspace = workspace;
        this.terminal = terminal;
        this.git = git;
        this.runtime = runtime;
        this.agents = agents;
        this.automation = automation;
        this.intelligence = intelligence;
        this.health = health;
    }
}
exports.EngineeringApplicationService = EngineeringApplicationService;
//# sourceMappingURL=engineering-application-service.js.map