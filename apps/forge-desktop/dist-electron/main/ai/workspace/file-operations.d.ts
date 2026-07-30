/**
 * file-operations.ts
 *
 * Safe atomic file system operations supporting AbortSignal cancellation.
 * Implements atomic writes via temporary files and atomic renames.
 */
export declare class FileOperations {
    readFile(filePath: string, signal?: AbortSignal): Promise<string>;
    writeFile(filePath: string, content: string, signal?: AbortSignal): Promise<void>;
    createFile(filePath: string, content?: string, signal?: AbortSignal): Promise<void>;
    deleteFile(filePath: string, signal?: AbortSignal): Promise<void>;
    rename(oldPath: string, newPath: string, signal?: AbortSignal): Promise<void>;
    mkdir(dirPath: string, signal?: AbortSignal): Promise<void>;
    exists(filePath: string, signal?: AbortSignal): Promise<boolean>;
    list(dirPath: string, signal?: AbortSignal): Promise<string[]>;
}
