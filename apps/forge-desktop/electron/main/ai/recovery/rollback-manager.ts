import * as fs from 'fs';

export class RollbackManager {
  private snapshots: Map<string, string> = new Map();

  saveSnapshot(filePath: string): void {
    if (fs.existsSync(filePath)) {
      this.snapshots.set(filePath, fs.readFileSync(filePath, 'utf8'));
    }
  }

  restoreSnapshots(): void {
    for (const [filePath, content] of this.snapshots.entries()) {
      fs.writeFileSync(filePath, content, 'utf8');
    }
  }

  clearSnapshots(): void {
    this.snapshots.clear();
  }
}
