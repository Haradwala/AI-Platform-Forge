"use strict";
/**
 * mcp-transport.ts
 *
 * Transport abstraction layer for Model Context Protocol (MCP).
 * Supports stdio (process execution), websocket, and HTTP transports for JSON-RPC 2.0 messages.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.MockMCPTransport = void 0;
class MockMCPTransport {
    type;
    connected = false;
    responseHandler;
    constructor(type, customHandler) {
        this.type = type;
        this.responseHandler = customHandler;
    }
    async connect() {
        this.connected = true;
    }
    async disconnect() {
        this.connected = false;
    }
    isConnected() {
        return this.connected;
    }
    async send(request) {
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
exports.MockMCPTransport = MockMCPTransport;
//# sourceMappingURL=mcp-transport.js.map