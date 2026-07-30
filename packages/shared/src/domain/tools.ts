export interface IToolRequest {
  readonly toolId: string;
  readonly arguments: Record<string, any>;
  readonly workspaceId: string;
}

export interface IToolMetrics {
  readonly durationMs: number;
  readonly cpuUsagePercent?: number;
  readonly memoryBytes?: number;
}

export interface IExecutionResult {
  readonly toolId: string;
  readonly status: 'success' | 'failed' | 'cancelled' | 'timeout';
  readonly output: string;
  readonly errors: string[];
  readonly warnings: string[];
  readonly changedFiles: string[];
  readonly metrics: IToolMetrics;
  readonly timestamp: Date;
}
