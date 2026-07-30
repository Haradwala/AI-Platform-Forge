/**
 * action-history.ts — Phase 29 Multi-File Action History Audit Persistence
 *
 * Persists action execution history and timeline to .forge/history/
 * (actions.json, timeline.json, artifacts.json, errors.json).
 */

import * as fs from 'fs';
import * as path from 'path';
import { ActionRequest, ActionResult } from './action-types';

export interface ActionHistoryEntry {
  id: string;
  actionId: string;
  runtimeId: string;
  workspaceRoot: string;
  status: 'COMPLETED' | 'FAILED' | 'CANCELLED';
  timestamp: number;
  durationMs: number;
  params: any;
  result?: any;
  error?: string;
}

export class ActionHistory {
  private getHistoryDir(workspaceRoot: string): string {
    const dir = path.join(workspaceRoot, '.forge', 'history');
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    return dir;
  }

  /**
   * Logs an action execution into multi-file audit logs.
   */
  async recordAction(req: ActionRequest, res: ActionResult): Promise<void> {
    try {
      const dir = this.getHistoryDir(req.workspaceRoot);
      const entry: ActionHistoryEntry = {
        id: req.id,
        actionId: req.actionId,
        runtimeId: req.runtimeId,
        workspaceRoot: req.workspaceRoot,
        status: res.status,
        timestamp: req.timestamp,
        durationMs: res.durationMs,
        params: req.params,
        result: res.data,
        error: res.error,
      };

      // 1. Append to actions.json
      const actionsFile = path.join(dir, 'actions.json');
      let actions: ActionHistoryEntry[] = [];
      if (fs.existsSync(actionsFile)) {
        const raw = fs.readFileSync(actionsFile, 'utf-8');
        actions = JSON.parse(raw || '[]');
      }
      actions.push(entry);
      fs.writeFileSync(actionsFile, JSON.stringify(actions, null, 2), 'utf-8');

      // 2. Append to timeline.json
      const timelineFile = path.join(dir, 'timeline.json');
      let timeline: any[] = [];
      if (fs.existsSync(timelineFile)) {
        const raw = fs.readFileSync(timelineFile, 'utf-8');
        timeline = JSON.parse(raw || '[]');
      }
      timeline.push({
        id: req.id,
        actionId: req.actionId,
        status: res.status,
        timestamp: req.timestamp,
        durationMs: res.durationMs,
      });
      fs.writeFileSync(timelineFile, JSON.stringify(timeline, null, 2), 'utf-8');

      // 3. Append to errors.json if failed
      if (res.status === 'FAILED' && res.error) {
        const errorsFile = path.join(dir, 'errors.json');
        let errors: any[] = [];
        if (fs.existsSync(errorsFile)) {
          const raw = fs.readFileSync(errorsFile, 'utf-8');
          errors = JSON.parse(raw || '[]');
        }
        errors.push({ id: req.id, actionId: req.actionId, error: res.error, timestamp: Date.now() });
        fs.writeFileSync(errorsFile, JSON.stringify(errors, null, 2), 'utf-8');
      }

      // 4. Append artifacts to artifacts.json if present
      if (res.artifacts && res.artifacts.length > 0) {
        const artifactsFile = path.join(dir, 'artifacts.json');
        let artifacts: any[] = [];
        if (fs.existsSync(artifactsFile)) {
          const raw = fs.readFileSync(artifactsFile, 'utf-8');
          artifacts = JSON.parse(raw || '[]');
        }
        artifacts.push({ id: req.id, actionId: req.actionId, artifacts: res.artifacts, timestamp: Date.now() });
        fs.writeFileSync(artifactsFile, JSON.stringify(artifacts, null, 2), 'utf-8');
      }
    } catch (err: any) {
      console.error('[ActionHistory] Failed to record action audit log:', err.message);
    }
  }

  /**
   * Retrieves action history entries for a workspace.
   */
  async getHistory(workspaceRoot: string): Promise<ActionHistoryEntry[]> {
    try {
      const dir = this.getHistoryDir(workspaceRoot);
      const actionsFile = path.join(dir, 'actions.json');
      if (!fs.existsSync(actionsFile)) return [];
      const raw = fs.readFileSync(actionsFile, 'utf-8');
      return JSON.parse(raw || '[]');
    } catch (err) {
      return [];
    }
  }
}
