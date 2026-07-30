/**
 * mcp-runtime.ts
 *
 * MCP Runtime implementing IAiRuntime with runtimeType = "mcp".
 * Manages connections to multiple MCP servers, tool discovery, resource retrieval,
 * health tracking, and integration with Forge ToolRegistry.
 */

import type { IAiRuntime, RuntimeHealth } from '../runtime/runtime-types';
import type { IAiTokenStream, IToolRegistry } from '../../container/service-interfaces';
import { MCPServerState, type MCPServerConfig, type MCPHealth } from './mcp-server';
import { MockMCPTransport, type IMCPTransport } from './mcp-transport';
import { MCPClient, type MCPToolDefinition, type MCPResource } from './mcp-client';
import { MCPToolAdapter } from './mcp-tool-adapter';

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

export class MCPRuntime implements IMCPRuntime {
  readonly id = 'mcp-runtime';
  readonly name = 'Model Context Protocol (MCP) Runtime';
  readonly runtimeType = 'mcp';

  private readonly servers = new Map<string, {
    state: MCPServerState;
    client: MCPClient;
    transport: IMCPTransport;
  }>();

  constructor(private readonly toolRegistry?: IToolRegistry) {}

  async healthCheck(): Promise<RuntimeHealth> {
    const activeServers = Array.from(this.servers.values());
    if (activeServers.length === 0) {
      return { healthy: true, latencyMs: 0, error: 'No MCP servers connected.' };
    }

    let totalLatency = 0;
    let healthyCount = 0;

    for (const s of activeServers) {
      try {
        const latency = await s.client.ping();
        s.state.updateHealth(true, latency);
        totalLatency += latency;
        healthyCount++;
      } catch (err) {
        s.state.updateHealth(false, -1, undefined, err instanceof Error ? err.message : String(err));
      }
    }

    const healthy = healthyCount > 0;
    return {
      healthy,
      latencyMs: healthyCount > 0 ? Math.round(totalLatency / healthyCount) : -1,
      error: healthy ? undefined : 'All connected MCP servers failed health check.',
    };
  }

  async connect(config: MCPServerConfig, customTransport?: IMCPTransport): Promise<void> {
    const transport = customTransport || new MockMCPTransport(config.transport);
    const client = new MCPClient(transport);
    const state = new MCPServerState(config);

    await client.connect();
    const info = await client.initialize();
    state.updateHealth(true, 5, info.version);

    this.servers.set(config.id, { state, client, transport });

    // Auto-register MCP tools into ToolRegistry if attached
    if (this.toolRegistry) {
      const tools = await client.listTools();
      for (const t of tools) {
        const adapter = new MCPToolAdapter(client, t, config.id);
        this.toolRegistry.register(adapter);
      }
    }
  }

  async disconnect(serverId: string): Promise<void> {
    const entry = this.servers.get(serverId);
    if (!entry) return;

    await entry.client.disconnect();
    entry.state.updateHealth(false, -1);
    this.servers.delete(serverId);
  }

  async reconnect(serverId: string): Promise<void> {
    const entry = this.servers.get(serverId);
    if (!entry) {
      throw new Error(`Cannot reconnect: MCP server "${serverId}" is not registered.`);
    }

    await entry.client.disconnect();
    await entry.client.connect();
    const latency = await entry.client.ping();
    entry.state.updateHealth(true, latency);
  }

  async listTools(serverId?: string): Promise<MCPToolDefinition[]> {
    if (serverId) {
      const entry = this.servers.get(serverId);
      if (!entry) return [];
      return entry.client.listTools();
    }

    const allTools: MCPToolDefinition[] = [];
    for (const entry of this.servers.values()) {
      const tools = await entry.client.listTools();
      allTools.push(...tools);
    }
    return allTools;
  }

  async callTool(serverId: string, toolName: string, args: Record<string, any> = {}): Promise<string> {
    const entry = this.servers.get(serverId);
    if (!entry) {
      throw new Error(`MCP server "${serverId}" is not connected.`);
    }
    return entry.client.callTool(toolName, args);
  }

  async listResources(serverId?: string): Promise<MCPResource[]> {
    if (serverId) {
      const entry = this.servers.get(serverId);
      if (!entry) return [];
      return entry.client.listResources();
    }

    const allResources: MCPResource[] = [];
    for (const entry of this.servers.values()) {
      const resources = await entry.client.listResources();
      allResources.push(...resources);
    }
    return allResources;
  }

  async readResource(serverId: string, uri: string): Promise<string> {
    const entry = this.servers.get(serverId);
    if (!entry) {
      throw new Error(`MCP server "${serverId}" is not connected.`);
    }
    return entry.client.readResource(uri);
  }

  health(serverId?: string): MCPHealth {
    if (serverId) {
      const entry = this.servers.get(serverId);
      if (!entry) return { connected: false, latencyMs: -1, lastSeen: 0, error: 'Server not found' };
      return entry.state.getHealth();
    }

    const activeServers = Array.from(this.servers.values());
    if (activeServers.length === 0) {
      return { connected: false, latencyMs: -1, lastSeen: 0, error: 'No MCP servers' };
    }

    const first = activeServers[0].state.getHealth();
    return first;
  }

  async generateStream(
    prompt: string,
    options?: Record<string, any>,
    signal?: AbortSignal
  ): Promise<IAiTokenStream> {
    let onTokenCb: ((token: string) => void) | undefined;
    let onCompleteCb: ((fullText: string) => void) | undefined;
    let onErrorCb: ((err: Error) => void) | undefined;

    const stream: IAiTokenStream = {
      onToken: (cb) => { onTokenCb = cb; return stream; },
      onComplete: (cb) => { onCompleteCb = cb; return stream; },
      onError: (cb) => { onErrorCb = cb; return stream; },
      cancel: () => {},
    };

    setTimeout(async () => {
      if (signal?.aborted) {
        onErrorCb?.(new Error('MCP execution cancelled by AbortSignal.'));
        return;
      }

      const activeServers = Array.from(this.servers.values());
      const responseText = activeServers.length > 0
        ? `[MCP Runtime Response for prompt: "${prompt.slice(0, 40)}..."] Connected servers: ${activeServers.length}`
        : `[MCP Runtime] Prompt processed: "${prompt.slice(0, 40)}..."`;

      onTokenCb?.(responseText);
      onCompleteCb?.(responseText);
    }, 10);

    return stream;
  }

  async listAvailableModels(): Promise<string[]> {
    return ['mcp-server-delegate'];
  }
}
