/**
 * mcp-client.ts
 *
 * MCP Protocol client carrying out standard MCP JSON-RPC requests over an IMCPTransport.
 */

import type { IMCPTransport, JSONRPCRequest } from './mcp-transport';

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

export class MCPClient {
  private requestIdCounter = 1;

  constructor(private readonly transport: IMCPTransport) {}

  async connect(): Promise<void> {
    await this.transport.connect();
    await this.initialize();
  }

  async disconnect(): Promise<void> {
    await this.transport.disconnect();
  }

  isConnected(): boolean {
    return this.transport.isConnected();
  }

  async initialize(): Promise<{ name: string; version: string }> {
    const res = await this.call('initialize', {
      protocolVersion: '2024-11-05',
      capabilities: { tools: {}, resources: {} },
      clientInfo: { name: 'Forge-IDE', version: '1.0.0' },
    });
    return res.serverInfo || { name: 'mcp-server', version: '1.0.0' };
  }

  async listTools(): Promise<MCPToolDefinition[]> {
    const res = await this.call('tools/list', {});
    return res.tools || [];
  }

  async callTool(name: string, args: Record<string, any> = {}): Promise<string> {
    const res = await this.call('tools/call', { name, arguments: args });
    if (res.content && Array.isArray(res.content) && res.content.length > 0) {
      return res.content.map((c: any) => c.text || JSON.stringify(c)).join('\n');
    }
    return JSON.stringify(res);
  }

  async listResources(): Promise<MCPResource[]> {
    const res = await this.call('resources/list', {});
    return res.resources || [];
  }

  async readResource(uri: string): Promise<string> {
    const res = await this.call('resources/read', { uri });
    if (res.contents && Array.isArray(res.contents) && res.contents.length > 0) {
      return res.contents.map((c: any) => c.text || JSON.stringify(c)).join('\n');
    }
    return JSON.stringify(res);
  }

  async ping(): Promise<number> {
    const start = Date.now();
    await this.call('ping', {});
    return Date.now() - start;
  }

  private async call(method: string, params: Record<string, any>): Promise<any> {
    const req: JSONRPCRequest = {
      jsonrpc: '2.0',
      id: this.requestIdCounter++,
      method,
      params,
    };

    const res = await this.transport.send(req);
    if (res.error) {
      throw new Error(`MCP Error (${res.error.code}): ${res.error.message}`);
    }
    return res.result;
  }
}
