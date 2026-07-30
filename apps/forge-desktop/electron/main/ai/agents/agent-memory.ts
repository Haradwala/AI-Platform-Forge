/**
 * agent-memory.ts — Phase 30 Shared Workspace Agent Memory
 *
 * Workspace-scoped memory shared by all agents, storing plans, reasoning,
 * artifacts, diagnostics, and outputs. Persists to .forge/session/agents.json.
 */

import * as fs from 'fs';
import * as path from 'path';
import { AgentMemoryEntry, AgentRole } from './agent-types';

export class AgentMemory {
  private getMemoryFile(workspaceRoot: string): string {
    const dir = path.join(workspaceRoot, '.forge', 'session');
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    return path.join(dir, 'agents.json');
  }

  async set(workspaceRoot: string, agentRole: AgentRole, key: string, value: any): Promise<AgentMemoryEntry> {
    const entries = await this.getAll(workspaceRoot);
    const id = `mem_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const entry: AgentMemoryEntry = {
      id,
      agentRole,
      key,
      value,
      timestamp: Date.now(),
      workspaceRoot,
    };

    const existingIdx = entries.findIndex((e) => e.key === key && e.agentRole === agentRole);
    if (existingIdx >= 0) {
      entries[existingIdx] = entry;
    } else {
      entries.push(entry);
    }

    const filePath = this.getMemoryFile(workspaceRoot);
    fs.writeFileSync(filePath, JSON.stringify(entries, null, 2), 'utf-8');
    return entry;
  }

  async get(workspaceRoot: string, key: string): Promise<AgentMemoryEntry | undefined> {
    const entries = await this.getAll(workspaceRoot);
    return entries.find((e) => e.key === key);
  }

  async getAll(workspaceRoot: string): Promise<AgentMemoryEntry[]> {
    try {
      const filePath = this.getMemoryFile(workspaceRoot);
      if (!fs.existsSync(filePath)) return [];
      const raw = fs.readFileSync(filePath, 'utf-8');
      return JSON.parse(raw || '[]');
    } catch (err) {
      return [];
    }
  }

  async clear(workspaceRoot: string): Promise<void> {
    try {
      const filePath = this.getMemoryFile(workspaceRoot);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    } catch (err) {
      // Ignore
    }
  }
}
