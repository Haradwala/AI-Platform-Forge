export interface FileTargetQuery {
    rawPrompt: string;
    intent: 'open' | 'find' | 'count' | 'list';
    basename?: string;
    relativePath?: string;
    extension?: string;
    language?: string;
    isAllFiles?: boolean;
}
export interface FolderTargetQuery {
    rawPrompt: string;
    isFolderQuery: boolean;
    intent: 'find' | 'count' | 'list';
    inDirectory?: string;
    folderName?: string;
    isAllFolders?: boolean;
}
export declare class FolderQueryNormalizer {
    /**
     * Normalizes natural language folder queries into a structured FolderTargetQuery.
     * Supports: "find all folders", "list folders", "folders in <dir>", "how many folders", "find folders named <name>".
     */
    static normalize(prompt: string): FolderTargetQuery;
}
export declare class FileQueryNormalizer {
    /**
     * Normalizes natural language prompts into a structured FileTargetQuery.
     * Delegates to QueryNormalizationEngine for canonical intent/domain/target resolution.
     */
    static normalize(prompt: string): FileTargetQuery;
}
