/**
 * mcp-transport.ts
 *
 * Transport abstraction layer for Model Context Protocol (MCP).
 * Supports stdio (process execution), websocket, and HTTP transports for JSON-RPC 2.0 messages.
 */

export interface JSONRPCRequest {
  jsonrpc: '2.0';
  id: string | number;
  method: string;
  params?: Record<string, any>;
}

export interface JSONRPCResponse {
  jsonrpc: '2.0';
  id: string | number;
  result?: any;
  error?: { code: number; message: string; data?: any };
}

export interface IMCPTransport {
  readonly type: 'stdio' | 'websocket' | 'http';
  connect(): Promise<void>;
  disconnect(): Promise<void>;
  send(request: JSONRPCRequest): Promise<JSONRPCResponse>;
  isConnected(): boolean;
}

export class MockMCPTransport implements IMCPTransport {
  private connected = false;
  private responseHandler?: (req: JSONRPCRequest) => any;

  constructor(
    public readonly type: 'stdio' | 'websocket' | 'http',
    customHandler?: (req: JSONRPCRequest) => any
  ) {
    this.responseHandler = customHandler;
  }

  async connect(): Promise<void> {
    this.connected = true;
  }

  async disconnect(): Promise<void> {
    this.connected = false;
  }

  isConnected(): boolean {
    return this.connected;
  }

  async send(request: JSONRPCRequest): Promise<JSONRPCResponse> {
    if (!this.connected) {
      throw new Error(`MCP Transport (${this.type}) is not connected.`);
    }

    if (this.responseHandler) {
      const res = this.responseHandler(request);
      return { jsonrpc: '2.0', id: request.id, result: res };
    }

    // Default mock response handler for tests and stub transports
    if (request.method === 'initialize') {
      return {
        jsonrpc: '2.0',
        id: request.id,
        result: { protocolVersion: '2024-11-05', serverInfo: { name: 'mock-mcp-server', version: '1.0.0' } },
      };
    }

    if (request.method === 'tools/list') {
      return {
        jsonrpc: '2.0',
        id: request.id,
        result: {
          tools: [
            { name: 'mcp_echo', description: 'Echoes input back', inputSchema: { type: 'object' } },
          ],
        },
      };
    }

    if (request.method === 'tools/call') {
      return {
        jsonrpc: '2.0',
        id: request.id,
        result: { content: [{ type: 'text', text: `MCP Output for ${request.params?.name}` }] },
      };
    }

    if (request.method === 'resources/list') {
      return {
        jsonrpc: '2.0',
        id: request.id,
        result: {
          resources: [
            { uri: 'mcp://system/status', name: 'System Status', mimeType: 'application/json' },
          ],
        },
      };
    }

    if (request.method === 'resources/read') {
      return {
        jsonrpc: '2.0',
        id: request.id,
        result: { contents: [{ uri: request.params?.uri, text: 'MCP Resource Content' }] },
      };
    }

    if (request.method === 'ping') {
      return { jsonrpc: '2.0', id: request.id, result: {} };
    }

    return {
      jsonrpc: '2.0',
      id: request.id,
      error: { code: -32601, message: `Method not found: ${request.method}` },
    };
  }
}
