/**
 * automation-artifact-store.ts — Step artifact persistence & exchange store
 *
 * Stores reports, diff patches, coverage XMLs, test outputs, and screenshots in `.forge/artifacts/<executionId>/`.
 */
import { AutomationArtifact } from '../contracts/automation-types';
export declare class AutomationArtifactStore {
    /**
     * Saves an artifact file to the workspace artifact directory.
     */
    saveArtifact(workspaceRoot: string, executionId: string, stepId: string, name: string, content: string | Buffer): Promise<AutomationArtifact>;
    /**
     * Reads the string content of an artifact.
     */
    readArtifact(filePath: string): Promise<string>;
    /**
     * Lists all artifacts for a pipeline execution.
     */
    listArtifacts(workspaceRoot: string, executionId: string): Promise<AutomationArtifact[]>;
}
