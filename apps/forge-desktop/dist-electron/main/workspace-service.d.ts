import type { IWorkspaceService, IFileTreeItem, IDesktopLogger, IDesktopEventBus } from './container/service-interfaces';
import type { IWindowRegistry } from './window-registry';
/**
 * WorkspaceService — handles folder open/close, CRUD operations on files,
 * and watches for changes via chokidar to stream them to the renderer.
 */
export declare class WorkspaceService implements IWorkspaceService {
    private readonly registry;
    private readonly logger;
    private readonly eventBus?;
    private rootPath;
    private watcher;
    constructor(registry: IWindowRegistry, logger: IDesktopLogger, eventBus?: IDesktopEventBus | undefined);
    getRootPath(): string | null;
    open(workspaceRoot: string): Promise<IFileTreeItem>;
    close(): Promise<void>;
    getRecentWorkspaces(): Promise<string[]>;
    getTree(): Promise<IFileTreeItem | null>;
    readFile(filePath: string): Promise<string>;
    writeFile(filePath: string, content: string): Promise<void>;
    createFile(filePath: string): Promise<void>;
    createFolder(folderPath: string): Promise<void>;
    deleteEntry(entryPath: string): Promise<void>;
    renameEntry(oldPath: string, newPath: string): Promise<void>;
    private validatePath;
    private buildTree;
    private startWatcher;
    private stopWatcher;
    private sendToAllWindows;
}
