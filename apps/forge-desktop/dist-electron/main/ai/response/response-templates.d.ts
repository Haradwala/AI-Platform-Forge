/**
 * response-templates.ts
 *
 * Sprint 85 Wave 1 — Fast Response Templates
 *
 * Pre-formatted response templates for deterministic actions.
 */
export declare class ResponseTemplates {
    static opened(path: string): string;
    static found(count: number, query: string): string;
}
export declare const opened: typeof ResponseTemplates.opened;
export declare const found: typeof ResponseTemplates.found;
