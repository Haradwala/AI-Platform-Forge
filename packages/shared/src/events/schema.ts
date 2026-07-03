export interface SystemEventMap {
  'process:started': { pid: number; command: string; env: Record<string, string> };
  'process:stdout': { pid: number; chunk: string };
  'process:stderr': { pid: number; chunk: string };
  'process:ended': { pid: number; exitCode: number; durationMs: number };
  'file:modified': { relativePath: string; size: number };
  'guardrail:alert': { ruleName: string; violationDetails: string };

  // Sprint 2 Lifecycle & Health Events
  'forge:booting': { timestamp: Date };
  'forge:initialized': { timestamp: Date; durationMs: number };
  'forge:ready': { timestamp: Date; durationMs: number };
  'forge:stopping': { timestamp: Date; reason?: string };
  'forge:stopped': { timestamp: Date; durationMs: number };
  'service:registered': { serviceName: string; timestamp: Date };
  'service:started': { serviceName: string; timestamp: Date; durationMs: number };
  'service:failed': { serviceName: string; error: string; timestamp: Date };
  'service:disposed': { serviceName: string; timestamp: Date };
  'health:changed': { serviceName: string; status: 'healthy' | 'degraded' | 'failed'; message?: string; timestamp: Date };
}
