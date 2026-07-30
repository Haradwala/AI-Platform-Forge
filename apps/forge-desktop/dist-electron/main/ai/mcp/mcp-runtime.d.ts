/**
 * mcp-runtime.ts
 *
 * MCP Runtime implementing IAiRuntime with runtimeType = "mcp".
 * Manages connections to multiple MCP servers, tool discovery, resource retrieval,
 * health tracking, and integration with Forge ToolRegistry.
 */
import type { IAiRuntime, RuntimeHealth } from '../runtime/runtime-types';
import type { IAiTokenStream, IToolRegistry } from '../../container/service-interfaces';
import { type MCPServerConfig, type MCPHealth } from './mcp-server';
import { type IMCPTransport } from './mcp-transport';
import { type MCPToolDefinition, type MCPResource } from './mcp-client';
export interface IMCPRuntime extends IAiRuntime {
    connect(config: MCPServerConfig, transport?: IMCPTransport): Promise<void>;
    disconnect(serverId: string): Promise<void>;
    reconnect(serverId: string): Promise<void>;
    listTools(serverId?: string): Promise<MCPToolDefinition[]>;
    callTool(serverId: string, toolName: string, args?: Record<string, any>): Promise<string>;
    listResources(serverId?: string): Promise<MCPResource[]>;
    readResource(serverId: string, uri: string): Promise<string>;
    health(serverId?: string): MCPHealth;
}
export declare class MCPRuntime implements IMCPRuntime {
    private readonly toolRegistry?;
    readonly id = "mcp-runtime";
    readonly name = "Model Context Protocol (MCP) Runtime";
    readonly runtimeType = "mcp";
    private readonly servers;
    constructor(toolRegistry?: IToolRegistry | undefined);
    healthCheck(): Promise<RuntimeHealth>;
    connect(config: MCPServerConfig, customTransport?: IMCPTransport): Promise<void>;
    disconnect(serverId: string): Promise<void>;
    reconnect(serverId: string): Promise<void>;
    listTools(serverId?: string): Promise<MCPToolDefinition[]>;
    callTool(serverId: string, toolName: string, args?: Record<string, any>): Promise<string>;
    listResources(serverId?: string): Promise<MCPResource[]>;
    readResource(serverId: string, uri: string): Promise<string>;
    health(serverId?: string): MCPHealth;
    generateStream(prompt: string, options?: Record<string, any>, signal?: AbortSignal): Promise<IAiTokenStream>;
    listAvailableModels(): Promise<string[]>;
}
