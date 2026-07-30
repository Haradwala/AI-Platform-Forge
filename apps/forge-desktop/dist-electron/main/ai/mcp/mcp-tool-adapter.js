"use strict";
/**
 * mcp-tool-adapter.ts
 *
 * Converts MCP tools into Forge ITool & IToolDefinition format for registration in ToolRegistry.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.MCPToolAdapter = void 0;
class MCPToolAdapter {
    client;
    mcpTool;
    id;
    name;
    description;
    inputSchema;
    outputSchema;
    constructor(client, mcpTool, serverId) {
        this.client = client;
        this.mcpTool = mcpTool;
        this.id = `mcp_${serverId}_${mcpTool.name}`;
        this.name = mcpTool.name;
        this.description = mcpTool.description || `MCP Tool (${mcpTool.name})`;
        this.inputSchema = mcpTool.inputSchema || {};
        this.outputSchema = { type: 'object' };
    }
    async execute(input) {
        const start = Date.now();
        try {
            const outputText = await this.client.callTool(this.mcpTool.name, input);
            return {
                success: true,
                data: { text: outputText },
                durationMs: Date.now() - start,
            };
        }
        catch (err) {
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
    toDefinition() {
        return {
            id: this.id,
            description: this.description,
            inputSchema: this.inputSchema,
            outputSchema: this.outputSchema,
        };
    }
}
exports.MCPToolAdapter = MCPToolAdapter;
//# sourceMappingURL=mcp-tool-adapter.js.map