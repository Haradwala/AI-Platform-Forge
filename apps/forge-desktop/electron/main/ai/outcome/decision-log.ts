import * as fs from 'fs';
import * as path from 'path';

export interface IDecisionLogEntry {
  strategyId: string;
  reason: string;
  confidence: number;
  alternatives: string[];
}

export class DecisionLog {
  private entries: IDecisionLogEntry[] = [];

  logDecision(strategyId: string, reason: string, confidence: number, alternatives: string[]): void {
    this.entries.push({
      strategyId,
      reason,
      confidence,
      alternatives,
    });
  }

  getEntries(): IDecisionLogEntry[] {
    return this.entries;
  }

  saveDecisionLog(workspaceRoot: string | null): void {
    if (!workspaceRoot) return;
    const outcomeDir = path.join(workspaceRoot, '.forge', 'outcome');
    if (!fs.existsSync(outcomeDir)) {
      fs.mkdirSync(outcomeDir, { recursive: true });
    }
    fs.writeFileSync(path.join(outcomeDir, 'decisions.json'), JSON.stringify(this.entries, null, 2), 'utf8');
  }

  clear(): void {
    this.entries = [];
  }
}
