/**
 * engineering-intelligence-engine.ts — Phase 17 Engineering Intelligence Layer (Renderer Service)
 *
 * Exposes the EngineeringIntelligenceEngine API surface for the frontend UI.
 * Pure static analysis with zero LLM calls.
 */

import {
  EngineeringIntelligenceEngine,
  type FullRepositoryAnalysis,
  type ArchitectureSummary,
  type ImpactAnalysisResult,
  type DeadCodeReport,
  type DependencyTreeResult,
  type CallHierarchyResult,
  type HotspotItem,
  type RepositoryHealthReport,
  type WorkspaceStatsReport,
} from '../../electron/main/ai/intelligence/engineering-intelligence-engine';

export const intelligenceEngine = new EngineeringIntelligenceEngine();

export type {
  FullRepositoryAnalysis,
  ArchitectureSummary,
  ImpactAnalysisResult,
  DeadCodeReport,
  DependencyTreeResult,
  CallHierarchyResult,
  HotspotItem,
  RepositoryHealthReport,
  WorkspaceStatsReport,
};
