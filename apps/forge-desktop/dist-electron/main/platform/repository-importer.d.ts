/**
 * repository-importer.ts — Phase 25-28 4-Stage Repository Importer
 *
 * Implements 4-stage pipeline: Acquire -> Normalize -> Analyze -> Open Workspace.
 * Abstracted importer supporting GitHub, GitLab, Bitbucket, Azure DevOps, Local Folders, ZIP, and Templates.
 */
import { RepositoryDescriptor, WorkspaceProfile } from '../ai/contracts/execution-contracts';
import { RepositoryAnalyzer, ComprehensiveProjectAnalysis } from './repository-analyzer';
import { WorkspaceProfileManager } from '../ai/session/workspace-profile';
export interface ImportResult {
    descriptor: RepositoryDescriptor;
    targetPath: string;
    analysis: ComprehensiveProjectAnalysis;
    profile: WorkspaceProfile;
    importedAt: number;
}
export declare class RepositoryImporter {
    private analyzer;
    private profileManager;
    constructor(analyzer?: RepositoryAnalyzer, profileManager?: WorkspaceProfileManager);
    /**
     * Runs 4-stage import pipeline for a repository descriptor.
     */
    importRepository(descriptor: RepositoryDescriptor, destinationRoot?: string): Promise<ImportResult>;
    private acquireRepo;
    private normalizeRepo;
}
