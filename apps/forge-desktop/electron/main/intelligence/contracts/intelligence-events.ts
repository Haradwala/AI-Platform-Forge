/**
 * intelligence-events.ts — Timeline Event Payload Contracts for Engineering Intelligence Engine
 */

import { IndexJobStatus, ImpactAnalysisReport, DeadCodeReport, AssembledContext } from './intelligence-types';

export type IntelligenceEventType =
  | 'intelligence.indexing.started'
  | 'intelligence.indexing.progress'
  | 'intelligence.indexing.completed'
  | 'intelligence.indexing.failed'
  | 'intelligence.analysis.impact_calculated'
  | 'intelligence.analysis.dead_code_detected'
  | 'intelligence.context.assembled';

export interface IntelligenceTimelineEventPayload {
  workspaceRoot: string;
  timestamp: number;
  jobStatus?: IndexJobStatus;
  impactReport?: ImpactAnalysisReport;
  deadCodeReport?: DeadCodeReport;
  contextUsage?: AssembledContext['tokenUsage'];
  message?: string;
  error?: string;
}
