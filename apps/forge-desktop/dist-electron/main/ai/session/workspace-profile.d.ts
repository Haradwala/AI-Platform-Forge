/**
 * workspace-profile.ts — Phase 25-28 Workspace Profile Manager
 *
 * Manages .forge/workspace.json to persist workspace stack, feature tags,
 * preferred/fallback runtimes, and analysis recommendations.
 */
import { WorkspaceProfile } from '../contracts/execution-contracts';
export declare class WorkspaceProfileManager {
    private getProfilePath;
    /**
     * Reads or initializes the workspace profile.
     */
    getProfile(workspaceRoot: string): WorkspaceProfile;
    /**
     * Saves or updates the workspace profile.
     */
    saveProfile(workspaceRoot: string, profile: WorkspaceProfile): void;
}
