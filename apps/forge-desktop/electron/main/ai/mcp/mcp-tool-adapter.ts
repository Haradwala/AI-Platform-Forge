/**
 * mcp-tool-adapter.ts
 *
 * Converts MCP tools into Forge ITool & IToolDefinition format for registration in ToolRegistry.
 */

import type { ITool, IToolDefinition, ToolResult } from '../../container/service-interfaces';
import type { MCPClient, MCPToolDefinition } from './mcp-client';

export class MCPToolAdapter implements ITool {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly inputSchema: Record<string, any>;
  readonly outputSchema: Record<string, any>;

  constructor(
    private readonly client: MCPClient,
    private readonly mcpTool: MCPToolDefinition,
    serverId: string
  ) {
    this.id = `mcp_${serverId}_${mcpTool.name}`;
    this.name = mcpTool.name;
    this.description = mcpTool.description || `MCP Tool (${mcpTool.name})`;
    this.inputSchema = mcpTool.inputSchema || {};
    this.outputSchema = { type: 'object' };
  }

  async execute(input: Record<string, any>): Promise<ToolResult> {
    const start = Date.now();
    try {
      const outputText = await this.client.callTool(this.mcpTool.name, input);
      return {
        success: true,
        data: { text: outputText },
        durationMs: Date.now() - start,
      };
    } catch (err) {
      return {
        success: false,
        error: {
          name: 'MCPToolError',
          code: 'MCP_TOOL_ERROR',
          message: err instanceof Error ? err.message : String(err),
        },
        durationMs: Date.now() - start,
      };
    }
  }

  toDefinition(): IToolDefinition {
    return {
      id: this.id,
      description: this.description,
      inputSchema: this.inputSchema,
      outputSchema: this.outputSchema,
    };
  }
}
