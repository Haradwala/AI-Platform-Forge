/**
 * response-types.ts
 *
 * Type definitions for the Response Generation layer.
 *
 * Responsibilities:
 *  - ResponseRequest: structured, provider-agnostic context for generation
 *  - AiExecutionResult: the canonical result returned by AiOrchestrator
 *  - AiExecutionMetadata: telemetry attached to each generation
 *  - AiRequestResponse: the typed IPC contract for the ai:request channel
 */

import type { PipelineContext } from '../pipeline/pipeline-context';
import type { IExecutionResult } from '../execution/execution-types';

// ─── Prompt Section Contract ───────────────────────────────────────────────────

export interface PromptSection {
  readonly title: string;
  readonly category: 'grounding' | 'context' | 'execution' | 'verification' | 'system';
  readonly priority: number;
  readonly content: string;
}

// ─── Grounded Context & Knowledge Fact Structures ──────────────────────────────

export interface SearchMatch {
  readonly filePath: string;
  readonly line?: number;
  readonly text?: string;
}

export interface WorkspaceSearchFact {
  readonly kind: 'workspace_search';
  readonly query: string;
  readonly matches: readonly SearchMatch[];
  readonly totalMatches: number;
}

export interface DirectoryListingFact {
  readonly kind: 'directory_listing';
  readonly path?: string;
  readonly items: readonly string[];
}

export interface RepositoryFileListFact {
  readonly kind: 'file_list';
  readonly files: readonly string[];
  readonly total: number;
}

export interface FileContentFact {
  readonly kind: 'file_content';
  readonly path: string;
  readonly content: string;
}

export interface WorkspaceStatisticsFact {
  readonly kind: 'workspace_statistics';
  readonly fileCount: number;
  readonly symbolsCount?: number;
  readonly circularDependenciesCount?: number;
  readonly languages?: readonly string[];
  readonly projects?: readonly string[];
}

export interface GitDiffFact {
  readonly kind: 'git_diff';
  readonly diff: string;
}

export interface ErrorTraceFact {
  readonly kind: 'error_trace';
  readonly error: string;
}

export type RepositoryFact =
  | WorkspaceSearchFact
  | DirectoryListingFact
  | FileContentFact
  | WorkspaceStatisticsFact
  | RepositoryFileListFact
  | GitDiffFact
  | ErrorTraceFact;

export interface TerminalFact {
  readonly kind: 'terminal_output';
  readonly command: string;
  readonly stdout: string;
  readonly stderr?: string;
  readonly exitCode?: number;
}

export type KnowledgeFact = RepositoryFact | TerminalFact;

/**
 * GroundedContext — strictly typed collection of raw execution results
 * and interpreted facts crossing the boundary between execution and response.
 *
 * Canonical Rule:
 * Execution layers never produce prompts. Response layers never inspect tools.
 * GroundedContext is the only contract crossing that boundary.
 */
export interface GroundedContext {
  readonly executionResults: readonly IExecutionResult[];
  readonly repositoryFacts: readonly RepositoryFact[];
  readonly terminalFacts: readonly TerminalFact[];
  readonly knowledgeFacts?: readonly KnowledgeFact[];
}

// ─── Structured Request ───────────────────────────────────────────────────────

/**
 * ResponseRequest — provider-agnostic, structured context handed to
 * ResponseGenerationEngine. The engine is responsible for turning this
 * into a runtime-specific prompt.
 */
export interface ResponseRequest {
  /** The original natural-language prompt from the user. */
  readonly userPrompt: string;

  /** Workspace information. */
  readonly workspace: {
    readonly root: string | null;
  };

  /** High-level execution outcome. */
  readonly execution: {
    readonly success: boolean;
    readonly goal: string;
  };

  /** Verification outcome. */
  readonly verification: {
    readonly success: boolean;
  };

  /** Reflection insights. */
  readonly reflection: {
    readonly recommendations: readonly string[];
  };

  /** A brief, pre-assembled context summary (from ContextEngine, if available). */
  readonly context: {
    readonly summary: string;
  };

  /** Strictly typed facts produced by tool execution. */
  readonly groundedContext?: GroundedContext;

  /** Optional pre-formatted execution summary for fast responses. */
  readonly executionSummary?: string;
}

// ─── Metadata ─────────────────────────────────────────────────────────────────

/**
 * Telemetry for a single response generation.
 * Fields are optional so early implementations don't have to provide all of them.
 */
export interface AiExecutionMetadata {
  readonly runtime?: string;
  readonly model?: string;
  readonly durationMs?: number;
  readonly provider?: string;
  readonly tokensIn?: number;
  readonly tokensOut?: number;
  readonly fallbackUsed?: boolean;
  readonly streaming?: boolean;
  readonly timing?: Record<string, any>;
}

// ─── Result ───────────────────────────────────────────────────────────────────

/**
 * AiExecutionResult — the canonical return type of AiOrchestrator.executeRequest().
 *
 * Separates the human-readable response from the engineering artifacts
 * in PipelineContext so presentation and state stay decoupled.
 */
export interface AiExecutionResult {
  readonly success: boolean;
  readonly result: {
    readonly response: string;
    readonly metadata: AiExecutionMetadata;
  };
  readonly finalContext: PipelineContext;
}

// ─── IPC Contract ─────────────────────────────────────────────────────────────

/**
 * AiRequestResponse — the typed IPC payload sent over the ai:request channel.
 *
 * Using a named interface (rather than an anonymous object) ensures
 * consumer code can import and validate the shape without drift.
 */
export type AiRequestResponse = AiExecutionResult;
