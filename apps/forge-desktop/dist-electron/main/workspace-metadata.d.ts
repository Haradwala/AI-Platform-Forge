export interface IWorkspaceConfig {
    readonly id: string;
    readonly name: string;
    readonly openedAt: string;
}
/**
 * WorkspaceMetadata — handles the creation and management of workspace-specific
 * metadata inside the .forge/ directory, and manages the global recent workspaces list.
 */
export declare class WorkspaceMetadata {
    /**
     * Initializes the .forge/ directory, creates subfolders, updates .gitignore,
     * and registers the folder in the recent workspaces list.
     */
    static init(workspaceRoot: string): void;
    /**
     * Returns the list of recent workspaces.
     */
    static getRecent(): string[];
    /**
     * Clears the list of recent workspaces.
     */
    static clearRecent(): void;
    private static addToRecent;
    private static getRecentFilePath;
}
