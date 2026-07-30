/**
 * mcp-tool-adapter.ts
 *
 * Converts MCP tools into Forge ITool & IToolDefinition format for registration in ToolRegistry.
 */
import type { ITool, IToolDefinition, ToolResult } from '../../container/service-interfaces';
import type { MCPClient, MCPToolDefinition } from './mcp-client';
export declare class MCPToolAdapter implements ITool {
    private readonly client;
    private readonly mcpTool;
    readonly id: string;
    readonly name: string;
    readonly description: string;
    readonly inputSchema: Record<string, any>;
    readonly outputSchema: Record<string, any>;
    constructor(client: MCPClient, mcpTool: MCPToolDefinition, serverId: string);
    execute(input: Record<string, any>): Promise<ToolResult>;
    toDefinition(): IToolDefinition;
}
