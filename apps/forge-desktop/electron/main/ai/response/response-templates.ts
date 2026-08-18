/**
 * response-templates.ts
 *
 * Sprint 85 Wave 1 — Fast Response Templates
 *
 * Pre-formatted response templates for deterministic actions.
 */

export class ResponseTemplates {
  static opened(path: string): string {
    return `Opened ${path}`;
  }

  static found(count: number, query: string): string {
    return `Found ${count} matches for "${query}".`;
  }
}

export const opened = ResponseTemplates.opened;
export const found = ResponseTemplates.found;
