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
export declare class MCPServerState {
    readonly config: MCPServerConfig;
    private healthData;
    constructor(config: MCPServerConfig);
    updateHealth(healthy: boolean, latencyMs?: number, version?: string, error?: string): MCPHealth;
    getHealth(): MCPHealth;
}
