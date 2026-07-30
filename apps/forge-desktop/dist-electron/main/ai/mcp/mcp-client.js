"use strict";
/**
 * mcp-client.ts
 *
 * MCP Protocol client carrying out standard MCP JSON-RPC requests over an IMCPTransport.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.MCPClient = void 0;
class MCPClient {
    transport;
    requestIdCounter = 1;
    constructor(transport) {
        this.transport = transport;
    }
    async connect() {
        await this.transport.connect();
        await this.initialize();
    }
    async disconnect() {
        await this.transport.disconnect();
    }
    isConnected() {
        return this.transport.isConnected();
    }
    async initialize() {
        const res = await this.call('initialize', {
            protocolVersion: '2024-11-05',
            capabilities: { tools: {}, resources: {} },
            clientInfo: { name: 'Forge-IDE', version: '1.0.0' },
        });
        return res.serverInfo || { name: 'mcp-server', version: '1.0.0' };
    }
    async listTools() {
        const res = await this.call('tools/list', {});
        return res.tools || [];
    }
    async callTool(name, args = {}) {
        const res = await this.call('tools/call', { name, arguments: args });
        if (res.content && Array.isArray(res.content) && res.content.length > 0) {
            return res.content.map((c) => c.text || JSON.stringify(c)).join('\n');
        }
        return JSON.stringify(res);
    }
    async listResources() {
        const res = await this.call('resources/list', {});
        return res.resources || [];
    }
    async readResource(uri) {
        const res = await this.call('resources/read', { uri });
        if (res.contents && Array.isArray(res.contents) && res.contents.length > 0) {
            return res.contents.map((c) => c.text || JSON.stringify(c)).join('\n');
        }
        return JSON.stringify(res);
    }
    async ping() {
        const start = Date.now();
        await this.call('ping', {});
        return Date.now() - start;
    }
    async call(method, params) {
        const req = {
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
exports.MCPClient = MCPClient;
//# sourceMappingURL=mcp-client.js.map