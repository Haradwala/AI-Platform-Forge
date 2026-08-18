/**
 * active-file-grounding.ts
 *
 * Sprint 85 Wave 3 — Active File Grounding Service
 *
 * Detects follow-up questions when an editor tab is open (e.g. package.json)
 * and fetches the file content directly from IWorkspaceService so the response
 * engine can ground directly from the active file without needing broad workspace searches.
 */

import type { IWorkspaceService, IDesktopLogger } from '../../container/service-interfaces';
import type { FileContentFact } from './response-types';

export class ActiveFileGroundingService {
  constructor(
    private readonly workspaceService?: IWorkspaceService,
    private readonly logger?: IDesktopLogger
  ) {}

  /**
   * Determines if the user prompt is a content follow-up question for the active file.
   * If applicable, reads the file and returns a FileContentFact. Otherwise returns null.
   */
  async tryGround(
    activeFilePath: string | null | undefined,
    userPrompt: string
  ): Promise<FileContentFact | null> {
    if (!activeFilePath || !this.workspaceService) {
      return null;
    }

    const promptLower = (userPrompt || '').trim().toLowerCase();
    if (!promptLower) return null;

    // Action verbs / commands that shouldn't trigger active file grounding
    const actionPrefixes = ['open ', 'find ', 'delete ', 'rename ', 'create ', 'run ', 'git '];
    if (actionPrefixes.some((p) => promptLower.startsWith(p))) {
      return null;
    }

    // Keywords or phrases indicating follow-up or content question
    const contentKeywords = [
      'dependencies',
      'devdependencies',
      'scripts',
      'version',
      'author',
      'license',
      'exports',
      'imports',
      'functions',
      'methods',
      'classes',
      'what',
      'show',
      'describe',
      'explain',
      'which',
      'how',
      'list',
      'tell',
      'contents',
      'structure',
      'summary',
      'overview',
      'them',
      'those',
      'these',
      'it',
      'this file',
      'active file',
      'open file',
    ];

    const isContentQuestion =
      contentKeywords.some((kw) => promptLower.includes(kw)) ||
      promptLower.length <= 60; // short follow-ups

    if (!isContentQuestion) {
      return null;
    }

    try {
      const content = await this.workspaceService.readFile(activeFilePath);
      if (!content || !content.trim()) return null;

      this.logger?.info(
        `[ActiveFileGroundingService] Grounded prompt "${userPrompt}" using active file "${activeFilePath}" (${content.length} chars)`
      );

      return {
        kind: 'file_content',
        path: activeFilePath,
        content,
      };
    } catch (err: any) {
      this.logger?.warn(
        `[ActiveFileGroundingService] Failed to read active file "${activeFilePath}": ${err?.message || err}`
      );
      return null;
    }
  }
}
