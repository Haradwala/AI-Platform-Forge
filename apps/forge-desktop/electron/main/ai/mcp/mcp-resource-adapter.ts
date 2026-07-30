/**
 * mcp-resource-adapter.ts
 *
 * Exposes MCP resources as Forge ScoredContextItem entries for ContextEngine.
 */

import type { ScoredContextItem } from '../context/context-selector';
import type { MCPClient, MCPResource } from './mcp-client';

export class MCPResourceAdapter {
  constructor(
    private readonly client: MCPClient,
    private readonly serverId: string
  ) {}

  async fetchResourceContext(resource: MCPResource): Promise<ScoredContextItem> {
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
    } catch (err) {
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
