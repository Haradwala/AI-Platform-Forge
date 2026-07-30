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
    error?: {
        code: number;
        message: string;
        data?: any;
    };
}
export interface IMCPTransport {
    readonly type: 'stdio' | 'websocket' | 'http';
    connect(): Promise<void>;
    disconnect(): Promise<void>;
    send(request: JSONRPCRequest): Promise<JSONRPCResponse>;
    isConnected(): boolean;
}
export declare class MockMCPTransport implements IMCPTransport {
    readonly type: 'stdio' | 'websocket' | 'http';
    private connected;
    private responseHandler?;
    constructor(type: 'stdio' | 'websocket' | 'http', customHandler?: (req: JSONRPCRequest) => any);
    connect(): Promise<void>;
    disconnect(): Promise<void>;
    isConnected(): boolean;
    send(request: JSONRPCRequest): Promise<JSONRPCResponse>;
}
