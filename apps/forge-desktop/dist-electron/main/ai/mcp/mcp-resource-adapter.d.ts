/**
 * mcp-resource-adapter.ts
 *
 * Exposes MCP resources as Forge ScoredContextItem entries for ContextEngine.
 */
import type { ScoredContextItem } from '../context/context-selector';
import type { MCPClient, MCPResource } from './mcp-client';
export declare class MCPResourceAdapter {
    private readonly client;
    private readonly serverId;
    constructor(client: MCPClient, serverId: string);
    fetchResourceContext(resource: MCPResource): Promise<ScoredContextItem>;
}
