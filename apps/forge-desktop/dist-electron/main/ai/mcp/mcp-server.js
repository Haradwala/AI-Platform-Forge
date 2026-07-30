"use strict";
/**
 * mcp-server.ts
 *
 * MCP Server configuration schema, state tracking, and health monitor.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.MCPServerState = void 0;
class MCPServerState {
    config;
    healthData = {
        connected: false,
        latencyMs: -1,
        lastSeen: 0,
    };
    constructor(config) {
        this.config = config;
    }
    updateHealth(healthy, latencyMs = -1, version, error) {
        this.healthData = {
            connected: healthy,
            latencyMs,
            lastSeen: Date.now(),
            version: version || this.healthData.version,
            error,
        };
        return this.healthData;
    }
    getHealth() {
        return { ...this.healthData };
    }
}
exports.MCPServerState = MCPServerState;
//# sourceMappingURL=mcp-server.js.map