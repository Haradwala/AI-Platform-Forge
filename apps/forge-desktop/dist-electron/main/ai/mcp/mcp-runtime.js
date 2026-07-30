"use strict";
/**
 * mcp-runtime.ts
 *
 * MCP Runtime implementing IAiRuntime with runtimeType = "mcp".
 * Manages connections to multiple MCP servers, tool discovery, resource retrieval,
 * health tracking, and integration with Forge ToolRegistry.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.MCPRuntime = void 0;
const mcp_server_1 = require("./mcp-server");
const mcp_transport_1 = require("./mcp-transport");
const mcp_client_1 = require("./mcp-client");
const mcp_tool_adapter_1 = require("./mcp-tool-adapter");
class MCPRuntime {
    toolRegistry;
    id = 'mcp-runtime';
    name = 'Model Context Protocol (MCP) Runtime';
    runtimeType = 'mcp';
    servers = new Map();
    constructor(toolRegistry) {
        this.toolRegistry = toolRegistry;
    }
    async healthCheck() {
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
            }
            catch (err) {
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
    async connect(config, customTransport) {
        const transport = customTransport || new mcp_transport_1.MockMCPTransport(config.transport);
        const client = new mcp_client_1.MCPClient(transport);
        const state = new mcp_server_1.MCPServerState(config);
        await client.connect();
        const info = await client.initialize();
        state.updateHealth(true, 5, info.version);
        this.servers.set(config.id, { state, client, transport });
        // Auto-register MCP tools into ToolRegistry if attached
        if (this.toolRegistry) {
            const tools = await client.listTools();
            for (const t of tools) {
                const adapter = new mcp_tool_adapter_1.MCPToolAdapter(client, t, config.id);
                this.toolRegistry.register(adapter);
            }
        }
    }
    async disconnect(serverId) {
        const entry = this.servers.get(serverId);
        if (!entry)
            return;
        await entry.client.disconnect();
        entry.state.updateHealth(false, -1);
        this.servers.delete(serverId);
    }
    async reconnect(serverId) {
        const entry = this.servers.get(serverId);
        if (!entry) {
            throw new Error(`Cannot reconnect: MCP server "${serverId}" is not registered.`);
        }
        await entry.client.disconnect();
        await entry.client.connect();
        const latency = await entry.client.ping();
        entry.state.updateHealth(true, latency);
    }
    async listTools(serverId) {
        if (serverId) {
            const entry = this.servers.get(serverId);
            if (!entry)
                return [];
            return entry.client.listTools();
        }
        const allTools = [];
        for (const entry of this.servers.values()) {
            const tools = await entry.client.listTools();
            allTools.push(...tools);
        }
        return allTools;
    }
    async callTool(serverId, toolName, args = {}) {
        const entry = this.servers.get(serverId);
        if (!entry) {
            throw new Error(`MCP server "${serverId}" is not connected.`);
        }
        return entry.client.callTool(toolName, args);
    }
    async listResources(serverId) {
        if (serverId) {
            const entry = this.servers.get(serverId);
            if (!entry)
                return [];
            return entry.client.listResources();
        }
        const allResources = [];
        for (const entry of this.servers.values()) {
            const resources = await entry.client.listResources();
            allResources.push(...resources);
        }
        return allResources;
    }
    async readResource(serverId, uri) {
        const entry = this.servers.get(serverId);
        if (!entry) {
            throw new Error(`MCP server "${serverId}" is not connected.`);
        }
        return entry.client.readResource(uri);
    }
    health(serverId) {
        if (serverId) {
            const entry = this.servers.get(serverId);
            if (!entry)
                return { connected: false, latencyMs: -1, lastSeen: 0, error: 'Server not found' };
            return entry.state.getHealth();
        }
        const activeServers = Array.from(this.servers.values());
        if (activeServers.length === 0) {
            return { connected: false, latencyMs: -1, lastSeen: 0, error: 'No MCP servers' };
        }
        const first = activeServers[0].state.getHealth();
        return first;
    }
    async generateStream(prompt, options, signal) {
        let onTokenCb;
        let onCompleteCb;
        let onErrorCb;
        const stream = {
            onToken: (cb) => { onTokenCb = cb; return stream; },
            onComplete: (cb) => { onCompleteCb = cb; return stream; },
            onError: (cb) => { onErrorCb = cb; return stream; },
            cancel: () => { },
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
    async listAvailableModels() {
        return ['mcp-server-delegate'];
    }
}
exports.MCPRuntime = MCPRuntime;
//# sourceMappingURL=mcp-runtime.js.map