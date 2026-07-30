/**
 * runtime-learning-engine.ts — Phase 25-28 Runtime Learning Engine
 *
 * Tracks per-workspace runtime execution outcomes, latency, and success rates.
 * Dynamically adjusts runtime selection weights as Forge learns over time.
 */

import * as fs from 'fs';
import * as path from 'path';

export interface RuntimeExecutionRecord {
  runtimeId: string;
  workspaceRoot: string;
  taskType: string;
  success: boolean;
  durationMs: number;
  timestamp: number;
}

export interface WorkspaceLearningStats {
  workspaceRoot: string;
  totalExecutions: number;
  runtimes: Record<
    string,
    {
      successCount: number;
      failCount: number;
      avgDurationMs: number;
      lastUsed: number;
    }
  >;
}

export class RuntimeLearningEngine {
  private getLearningPath(workspaceRoot: string): string {
    const dir = path.join(workspaceRoot, '.forge', 'session');
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    return path.join(dir, 'learning.json');
  }

  /**
   * Logs a runtime execution outcome for a specific workspace.
   */
  async recordOutcome(record: RuntimeExecutionRecord): Promise<void> {
    try {
      const filePath = this.getLearningPath(record.workspaceRoot);
      let stats: WorkspaceLearningStats = {
        workspaceRoot: record.workspaceRoot,
        totalExecutions: 0,
        runtimes: {},
      };

      if (fs.existsSync(filePath)) {
        const raw = fs.readFileSync(filePath, 'utf-8');
        stats = JSON.parse(raw || '{}');
      }

      if (!stats.runtimes) stats.runtimes = {};

      const current = stats.runtimes[record.runtimeId] || {
        successCount: 0,
        failCount: 0,
        avgDurationMs: 0,
        lastUsed: 0,
      };

      if (record.success) {
        current.successCount++;
      } else {
        current.failCount++;
      }

      current.avgDurationMs = Math.round(
        (current.avgDurationMs * (current.successCount + current.failCount - 1) + record.durationMs) /
          (current.successCount + current.failCount)
      );
      current.lastUsed = record.timestamp;

      stats.runtimes[record.runtimeId] = current;
      stats.totalExecutions++;

      fs.writeFileSync(filePath, JSON.stringify(stats, null, 2), 'utf-8');
    } catch (err: any) {
      console.error('[RuntimeLearningEngine] Failed to record outcome:', err.message);
    }
  }

  /**
   * Retrieves historical success rates per runtime for a workspace.
   */
  getSuccessRates(workspaceRoot: string): Record<string, number> {
    try {
      const filePath = this.getLearningPath(workspaceRoot);
      if (!fs.existsSync(filePath)) return {};
      const raw = fs.readFileSync(filePath, 'utf-8');
      const stats: WorkspaceLearningStats = JSON.parse(raw || '{}');
      const rates: Record<string, number> = {};

      for (const [runtimeId, data] of Object.entries(stats.runtimes || {})) {
        const total = data.successCount + data.failCount;
        if (total > 0) {
          rates[runtimeId] = data.successCount / total;
        }
      }

      return rates;
    } catch (err) {
      return {};
    }
  }
}
