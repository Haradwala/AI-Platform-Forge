/**
 * intelligence-timeline-publisher.ts — Timeline Event Publisher for Engineering Intelligence Engine
 */
import type { IDesktopEventBus } from '../../container/service-interfaces';
import { IndexJobStatus, ImpactAnalysisReport, DeadCodeReport, AssembledContext } from '../contracts/intelligence-types';
export declare class IntelligenceTimelinePublisher {
    private readonly eventBus?;
    constructor(eventBus?: IDesktopEventBus | undefined);
    publishIndexingStarted(job: IndexJobStatus): void;
    publishIndexingCompleted(job: IndexJobStatus): void;
    publishImpactAnalysis(workspaceRoot: string, report: ImpactAnalysisReport): void;
    publishDeadCodeDetected(workspaceRoot: string, report: DeadCodeReport): void;
    publishContextAssembled(workspaceRoot: string, contextUsage: AssembledContext['tokenUsage']): void;
    private emit;
}
