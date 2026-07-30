"use strict";
/**
 * mcp-resource-adapter.ts
 *
 * Exposes MCP resources as Forge ScoredContextItem entries for ContextEngine.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.MCPResourceAdapter = void 0;
class MCPResourceAdapter {
    client;
    serverId;
    constructor(client, serverId) {
        this.client = client;
        this.serverId = serverId;
    }
    async fetchResourceContext(resource) {
        try {
            const content = await this.client.readResource(resource.uri);
            return {
                id: `mcp_res_${this.serverId}_${resource.name}`,
                source: 'workspace_files',
                path: resource.uri,
                content,
                score: 80,
                rankReasons: ['mcp_resource'],
            };
        }
        catch (err) {
            return {
                id: `mcp_res_${this.serverId}_${resource.name}`,
                source: 'workspace_files',
                path: resource.uri,
                content: `Error loading MCP resource: ${err instanceof Error ? err.message : String(err)}`,
                score: 0,
                rankReasons: ['mcp_resource_error'],
            };
        }
    }
}
exports.MCPResourceAdapter = MCPResourceAdapter;
//# sourceMappingURL=mcp-resource-adapter.js.map