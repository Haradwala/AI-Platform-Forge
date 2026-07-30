/**
 * mcp-server.ts
 *
 * MCP Server configuration schema, state tracking, and health monitor.
 */

export type MCPTransportType = 'stdio' | 'websocket' | 'http';

export interface MCPServerConfig {
  id: string;
  name: string;
  transport: MCPTransportType;
  command?: string;
  args?: string[];
  env?: Record<string, string>;
  url?: string;
}

export interface MCPHealth {
  connected: boolean;
  latencyMs: number;
  lastSeen: number;
  version?: string;
  error?: string;
}

export class MCPServerState {
  private healthData: MCPHealth = {
    connected: false,
    latencyMs: -1,
    lastSeen: 0,
  };

  constructor(public readonly config: MCPServerConfig) {}

  updateHealth(healthy: boolean, latencyMs = -1, version?: string, error?: string): MCPHealth {
    this.healthData = {
      connected: healthy,
      latencyMs,
      lastSeen: Date.now(),
      version: version || this.healthData.version,
      error,
    };
    return this.healthData;
  }

  getHealth(): MCPHealth {
    return { ...this.healthData };
  }
}
