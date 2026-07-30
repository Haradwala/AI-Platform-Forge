/**
 * ai-agents.module.ts — Sub-module for Agent Framework & Multi-Agent Orchestration
 *
 * Registers AgentRegistry, AgentMemory, AgentScheduler, and AgentOrchestrator.
 */
import type { IDesktopContainer } from '../../container/interfaces';
export declare class AiAgentsModule {
    static register(container: IDesktopContainer): void;
}
