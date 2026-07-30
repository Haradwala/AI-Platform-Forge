/**
 * workspace-profile.ts — Phase 25-28 Workspace Profile Manager
 *
 * Manages .forge/workspace.json to persist workspace stack, feature tags,
 * preferred/fallback runtimes, and analysis recommendations.
 */

import * as fs from 'fs';
import * as path from 'path';
import { WorkspaceProfile } from '../contracts/execution-contracts';

export class WorkspaceProfileManager {
  private getProfilePath(workspaceRoot: string): string {
    const forgeDir = path.join(workspaceRoot, '.forge');
    if (!fs.existsSync(forgeDir)) {
      fs.mkdirSync(forgeDir, { recursive: true });
    }
    return path.join(forgeDir, 'workspace.json');
  }

  /**
   * Reads or initializes the workspace profile.
   */
  getProfile(workspaceRoot: string): WorkspaceProfile {
    const filePath = this.getProfilePath(workspaceRoot);
    if (fs.existsSync(filePath)) {
      try {
        const raw = fs.readFileSync(filePath, 'utf-8');
        return JSON.parse(raw);
      } catch (err) {
        console.error('[WorkspaceProfileManager] Error parsing workspace.json:', err);
      }
    }

    // Default profile template
    const defaultProfile: WorkspaceProfile = {
      language: 'typescript',
      framework: 'react',
      packageManager: 'pnpm',
      projectType: 'desktop',
      preferredRuntime: 'claude',
      fallbackRuntime: 'ollama',
      features: ['electron', 'vite', 'react', 'typescript'],
      analysis: {
        lastIndexed: new Date().toISOString(),
        healthScore: 95,
        runtimeRecommendations: [
          { category: 'best_overall', runtimeId: 'claude', reason: 'Highest coding & tool performance' },
          { category: 'best_local', runtimeId: 'ollama', reason: 'Zero latency offline inference' },
          { category: 'fastest', runtimeId: 'groq', reason: 'Sub-100ms response streaming' },
        ],
      },
    };

    this.saveProfile(workspaceRoot, defaultProfile);
    return defaultProfile;
  }

  /**
   * Saves or updates the workspace profile.
   */
  saveProfile(workspaceRoot: string, profile: WorkspaceProfile): void {
    try {
      const filePath = this.getProfilePath(workspaceRoot);
      fs.writeFileSync(filePath, JSON.stringify(profile, null, 2), 'utf-8');
    } catch (err: any) {
      console.error('[WorkspaceProfileManager] Error saving workspace.json:', err.message);
    }
  }
}
