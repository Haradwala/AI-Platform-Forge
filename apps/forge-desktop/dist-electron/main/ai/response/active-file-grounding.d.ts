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
export declare class ActiveFileGroundingService {
    private readonly workspaceService?;
    private readonly logger?;
    constructor(workspaceService?: IWorkspaceService | undefined, logger?: IDesktopLogger | undefined);
    /**
     * Determines if the user prompt is a content follow-up question for the active file.
     * If applicable, reads the file and returns a FileContentFact. Otherwise returns null.
     */
    tryGround(activeFilePath: string | null | undefined, userPrompt: string): Promise<FileContentFact | null>;
}
