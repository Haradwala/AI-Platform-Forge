import type { IAiSessionService, IProviderRegistry, IRepositoryProvider, IExecutionEngine } from '../../container/service-interfaces';
import { MemoryRegistry } from '../memory/memory-registry';
export interface DiagnosticsSnapshot {
    readonly status: 'healthy' | 'warning' | 'degraded';
    readonly provider: string;
    readonly model: string;
    readonly repositoryIndexedCount: number;
    readonly memoryRecordsCount: number;
    readonly activeServices: string[];
    readonly lastExecutionStatus: string;
    readonly performanceCounters: Record<string, number>;
}
export declare class DiagnosticsService {
    private readonly sessionService;
    private readonly providerRegistry;
    private readonly repo;
    private readonly memoryRegistry;
    private readonly executionEngine;
    constructor(sessionService: IAiSessionService, providerRegistry: IProviderRegistry, repo: IRepositoryProvider, memoryRegistry: MemoryRegistry, executionEngine: IExecutionEngine);
    getDiagnosticsSnapshot(): Promise<DiagnosticsSnapshot>;
}
