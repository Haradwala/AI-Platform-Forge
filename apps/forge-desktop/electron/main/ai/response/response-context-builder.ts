/**
 * response-context-builder.ts
 *
 * ResponseContextBuilder — assembles a structured, provider-agnostic
 * ResponseRequest from a completed PipelineContext.
 *
 * Responsibilities:
 *  - Read PipelineContext fields safely (every field is optional)
 *  - Produce a flat, typed ResponseRequest with no internal engineering types
 *  - Make NO decisions about prompt format or runtime selection
 *  - Remain stateless and dependency-free (no DI required)
 *
 * The ResponseGenerationEngine is responsible for turning ResponseRequest
 * into a runtime-specific prompt string.
 */

import type { PipelineContext } from '../pipeline/pipeline-context';
import type { ResponseRequest, GroundedContext } from './response-types';
import { FactInterpreter } from './fact-interpreter';

export class ResponseContextBuilder {
  private readonly factInterpreter = new FactInterpreter();

  /**
   * Assembles a ResponseRequest from the pipeline's final context and
   * the original user prompt.
   *
   * All fields degrade gracefully when context data is absent (e.g., when
   * a stage was skipped).
   */
  build(context: PipelineContext, userPrompt: string): ResponseRequest {
    // Use the real IPlan.goal field (not goalDescription)
    const goal =
      (context.generatedPlan as any)?.goal ||
      (context.generatedPlan as any)?.goalDescription ||
      userPrompt;

    const executionSuccess =
      context.executionOutcome?.success ??
      context.verificationReport?.success ??
      true;

    const verificationSuccess = context.verificationReport?.success ?? true;

    const recommendations: readonly string[] =
      context.reflectionReport?.recommendations ?? [];

    // Assemble a brief context summary from available collection data.
    const contextSummary = this._buildContextSummary(context);

    // Interpret execution results into structured GroundedContext facts
    let groundedContext: GroundedContext | undefined;
    if (context.executionResults && context.executionResults.length > 0) {
      groundedContext = this.factInterpreter.interpret(context.executionResults);
    }

    return {
      userPrompt,
      workspace: {
        root: context.workspaceRoot,
      },
      execution: {
        success: executionSuccess,
        goal,
      },
      verification: {
        success: verificationSuccess,
      },
      reflection: {
        recommendations,
      },
      context: {
        summary: contextSummary,
      },
      groundedContext,
    };
  }

  // ─── Private Helpers ────────────────────────────────────────────────────────

  private _buildContextSummary(context: PipelineContext): string {
    const parts: string[] = [];

    const collected = context.contextCollected as any;
    if (collected?.workspace?.rootPath) {
      parts.push(`Workspace: ${collected.workspace.rootPath}`);
    }
    if (collected?.workspace?.fileCount !== undefined) {
      parts.push(`Total files: ${collected.workspace.fileCount}`);
    }
    if (collected?.workspace?.languages?.length) {
      parts.push(`Languages: ${(collected.workspace.languages as string[]).join(', ')}`);
    }

    const memories = context.memoriesFetched;
    if (Array.isArray(memories) && memories.length > 0) {
      parts.push(`Relevant memories retrieved: ${memories.length}`);
    }

    return parts.length > 0 ? parts.join('\n') : '';
  }
}
