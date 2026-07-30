import type { ISessionManager, IWorkspaceService, IDesktopLogger } from './container/service-interfaces';
import * as fs from 'fs';
import * as path from 'path';

export class SessionManager implements ISessionManager {
  private readonly logger: IDesktopLogger;
  private readonly workspaceService: IWorkspaceService;
  private fallbackSessionPath = '';

  constructor(logger: IDesktopLogger, workspaceService: IWorkspaceService) {
    this.logger = logger;
    this.workspaceService = workspaceService;
  }

  setFallbackSessionPath(p: string): void {
    this.fallbackSessionPath = p;
  }

  private getSessionFilePath(): string | null {
    const root = this.workspaceService.getRootPath();
    if (root) {
      return path.join(root, '.forge', 'session.json');
    }
    return this.fallbackSessionPath || null;
  }

  private sessionState: any = null;

  async save(state?: any): Promise<void> {
    const sessionFile = this.getSessionFilePath();
    if (!sessionFile) {
      this.logger.warn('[SessionManager] No active workspace or fallback path to save session.');
      return;
    }

    try {
      if (state !== undefined) {
        this.sessionState = state;
      }
      const data = {
        lastSaved: new Date().toISOString(),
        version: '1.0.0',
        workspaceRoot: this.workspaceService.getRootPath(),
        state: this.sessionState || {},
      };

      const dir = path.dirname(sessionFile);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }

      fs.writeFileSync(sessionFile, JSON.stringify(data, null, 2), 'utf-8');
      this.logger.info(`[SessionManager] Session saved successfully to ${sessionFile}`);
    } catch (err: any) {
      this.logger.error(`[SessionManager] Failed to save session: ${err.message}`);
      throw err;
    }
  }

  async restore(): Promise<any> {
    const sessionFile = this.getSessionFilePath();
    if (!sessionFile || !fs.existsSync(sessionFile)) {
      this.logger.info('[SessionManager] No previous session file discovered.');
      return null;
    }

    try {
      const raw = fs.readFileSync(sessionFile, 'utf-8');
      const data = JSON.parse(raw);
      this.sessionState = data.state;
      this.logger.info(`[SessionManager] Session restored from ${sessionFile}. Last saved: ${data.lastSaved}`);
      return data;
    } catch (err: any) {
      this.logger.error(`[SessionManager] Failed to restore session: ${err.message}`);
      throw err;
    }
  }

  async clear(): Promise<void> {
    const sessionFile = this.getSessionFilePath();
    if (sessionFile && fs.existsSync(sessionFile)) {
      try {
        fs.unlinkSync(sessionFile);
        this.logger.info('[SessionManager] Session cleared.');
      } catch (err: any) {
        this.logger.error(`[SessionManager] Failed to clear session: ${err.message}`);
        throw err;
      }
    }
  }
}
export default SessionManager;
