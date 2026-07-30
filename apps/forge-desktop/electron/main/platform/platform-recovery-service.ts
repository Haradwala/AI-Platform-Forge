import { IRuntimeService } from './runtime-service';
import * as fs from 'fs';
import * as path from 'path';
import { IWorkspaceService } from '../container/service-interfaces';

export class PlatformRecoveryService implements IRuntimeService {
  readonly id = 'PlatformRecoveryService';
  readonly version = '1.0.0';
  readonly dependencies = [];
  health: 'healthy' | 'warning' | 'degraded' | 'failed' = 'healthy';
  status: 'stopped' | 'starting' | 'running' | 'suspended' | 'error' = 'stopped';

  private snapshotsCount = 0;
  private readonly startTime = Date.now();

  constructor(private readonly workspaceService: IWorkspaceService) {}

  uptime(): number {
    return Date.now() - this.startTime;
  }

  metrics(): Record<string, any> {
    return {
      snapshotsCount: this.snapshotsCount,
    };
  }

  onStart(): void {}
  onRunning(): void {}
  onSuspend(): void {}
  onShutdown(): void {}

  saveSnapshot(state: any): void {
    const root = this.workspaceService.getRootPath();
    if (!root) return;

    const recoveryFile = path.join(root, '.forge', 'recovery.json');
    try {
      const dir = path.dirname(recoveryFile);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      fs.writeFileSync(recoveryFile, JSON.stringify({
        timestamp: new Date().toISOString(),
        state,
      }, null, 2));
      this.snapshotsCount++;
    } catch {
      this.health = 'warning';
    }
  }

  loadSnapshot(): any {
    const root = this.workspaceService.getRootPath();
    if (!root) return null;

    const recoveryFile = path.join(root, '.forge', 'recovery.json');
    try {
      if (fs.existsSync(recoveryFile)) {
        const content = fs.readFileSync(recoveryFile, 'utf8');
        return JSON.parse(content);
      }
    } catch {
      this.health = 'warning';
    }
    return null;
  }
}
