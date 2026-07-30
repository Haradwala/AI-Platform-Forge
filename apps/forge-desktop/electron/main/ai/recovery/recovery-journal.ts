import * as fs from 'fs';
import * as path from 'path';

export interface RecoveryAttemptLog {
  strategyId: string;
  success: boolean;
  durationMs: number;
  timestamp: string;
}

export class RecoveryJournal {
  private logs: RecoveryAttemptLog[] = [];

  logAttempt(strategyId: string, success: boolean, durationMs: number): void {
    this.logs.push({
      strategyId,
      success,
      durationMs,
      timestamp: new Date().toISOString(),
    });
  }

  getLogs(): RecoveryAttemptLog[] {
    return this.logs;
  }

  saveJournal(workspaceRoot: string | null): void {
    if (!workspaceRoot) return;
    const recoveryDir = path.join(workspaceRoot, '.forge', 'recovery');
    if (!fs.existsSync(recoveryDir)) {
      fs.mkdirSync(recoveryDir, { recursive: true });
    }
    fs.writeFileSync(path.join(recoveryDir, 'attempts.json'), JSON.stringify(this.logs, null, 2), 'utf8');
  }

  clear(): void {
    this.logs = [];
  }
}
