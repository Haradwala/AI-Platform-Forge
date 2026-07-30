import type { ISessionManager, IWorkspaceService, IDesktopLogger } from './container/service-interfaces';
export declare class SessionManager implements ISessionManager {
    private readonly logger;
    private readonly workspaceService;
    private fallbackSessionPath;
    constructor(logger: IDesktopLogger, workspaceService: IWorkspaceService);
    setFallbackSessionPath(p: string): void;
    private getSessionFilePath;
    private sessionState;
    save(state?: any): Promise<void>;
    restore(): Promise<any>;
    clear(): Promise<void>;
}
export default SessionManager;
