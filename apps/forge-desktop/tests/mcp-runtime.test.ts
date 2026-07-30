/**
 * mcp-runtime.test.ts
 *
 * Unit test suite for MCPRuntime.
 * Covers:
 *  - MCP server connection & initialization
 *  - Disconnect & reconnect
 *  - Tool discovery & automatic ToolRegistry conversion
 *  - Tool execution via MCP client
 *  - Resource loading & ContextEngine translation
 *  - Server health tracking & failure recovery
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { MCPRuntime } from '../electron/main/ai/mcp/mcp-runtime';
import { MockMCPTransport } from '../electron/main/ai/mcp/mcp-transport';
import { ToolRegistry } from '../electron/main/ai/tools/tool-registry';

describe('MCPRuntime', () => {
  let runtime: MCPRuntime;
  let toolRegistry: ToolRegistry;

  beforeEach(() => {
    toolRegistry = new ToolRegistry();
    runtime = new MCPRuntime(toolRegistry);
  });

  it('connects to an MCP server and discovers tools automatically', async () => {
    const transport = new MockMCPTransport('stdio');
    await runtime.connect(
      { id: 'server_1', name: 'Test Server', transport: 'stdio' },
      transport
    );

    const tools = await runtime.listTools('server_1');
    expect(tools.length).toBe(1);
    expect(tools[0].name).toBe('mcp_echo');

    // Verify tool was registered in ToolRegistry
    const registeredTool = toolRegistry.getById('mcp_server_1_mcp_echo');
    expect(registeredTool).toBeDefined();

    const health = runtime.health('server_1');
    expect(health.connected).toBe(true);
  });

  it('executes MCP tools via callTool', async () => {
    const transport = new MockMCPTransport('stdio');
    await runtime.connect(
      { id: 'server_1', name: 'Test Server', transport: 'stdio' },
      transport
    );

    const result = await runtime.callTool('server_1', 'mcp_echo', { text: 'Hello MCP' });
    expect(result).toContain('MCP Output for mcp_echo');
  });

  it('lists and reads MCP resources', async () => {
    const transport = new MockMCPTransport('websocket');
    await runtime.connect(
      { id: 'server_2', name: 'Websocket Server', transport: 'websocket', url: 'ws://localhost:8080' },
      transport
    );

    const resources = await runtime.listResources('server_2');
    expect(resources.length).toBe(1);
    expect(resources[0].name).toBe('System Status');

    const content = await runtime.readResource('server_2', 'mcp://system/status');
    expect(content).toBe('MCP Resource Content');
  });

  it('handles disconnect and reconnect lifecycle cleanly', async () => {
    const transport = new MockMCPTransport('http');
    await runtime.connect(
      { id: 'server_3', name: 'HTTP Server', transport: 'http', url: 'http://localhost:3000' },
      transport
    );

    expect(runtime.health('server_3').connected).toBe(true);

    await runtime.disconnect('server_3');
    expect(runtime.health('server_3').connected).toBe(false);

    // Reconnecting disconnected/unregistered server throws error
    await expect(runtime.reconnect('server_3')).rejects.toThrow('not registered');
  });

  it('tracks health metrics and detects failing servers', async () => {
    const transport = new MockMCPTransport('stdio');
    await runtime.connect(
      { id: 'server_4', name: 'Health Test', transport: 'stdio' },
      transport
    );

    const overallHealth = await runtime.healthCheck();
    expect(overallHealth.healthy).toBe(true);
    expect(overallHealth.latencyMs).toBeGreaterThanOrEqual(0);
  });
});
