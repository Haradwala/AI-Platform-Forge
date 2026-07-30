/**
 * mcp-client.ts
 *
 * MCP Protocol client carrying out standard MCP JSON-RPC requests over an IMCPTransport.
 */
import type { IMCPTransport } from './mcp-transport';
export interface MCPToolDefinition {
    name: string;
    description?: string;
    inputSchema?: Record<string, any>;
}
export interface MCPResource {
    uri: string;
    name: string;
    mimeType?: string;
    description?: string;
}
export declare class MCPClient {
    private readonly transport;
    private requestIdCounter;
    constructor(transport: IMCPTransport);
    connect(): Promise<void>;
    disconnect(): Promise<void>;
    isConnected(): boolean;
    initialize(): Promise<{
        name: string;
        version: string;
    }>;
    listTools(): Promise<MCPToolDefinition[]>;
    callTool(name: string, args?: Record<string, any>): Promise<string>;
    listResources(): Promise<MCPResource[]>;
    readResource(uri: string): Promise<string>;
    ping(): Promise<number>;
    private call;
}
