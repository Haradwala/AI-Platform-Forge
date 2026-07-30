/**
 * automation-artifact-store.ts — Step artifact persistence & exchange store
 *
 * Stores reports, diff patches, coverage XMLs, test outputs, and screenshots in `.forge/artifacts/<executionId>/`.
 */

import * as fs from 'fs';
import * as path from 'path';
import { AutomationArtifact } from '../contracts/automation-types';

export class AutomationArtifactStore {
  /**
   * Saves an artifact file to the workspace artifact directory.
   */
  async saveArtifact(
    workspaceRoot: string,
    executionId: string,
    stepId: string,
    name: string,
    content: string | Buffer
  ): Promise<AutomationArtifact> {
    const dir = path.join(workspaceRoot, '.forge', 'artifacts', executionId);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    const safeName = name.replace(/[^a-zA-Z0-9._-]/g, '_');
    const filePath = path.join(dir, safeName);
    fs.writeFileSync(filePath, content);

    const stat = fs.statSync(filePath);
    const artifact: AutomationArtifact = {
      id: `art_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      executionId,
      stepId,
      name,
      path: filePath,
      sizeBytes: stat.size,
      createdAt: Date.now(),
    };

    return artifact;
  }

  /**
   * Reads the string content of an artifact.
   */
  async readArtifact(filePath: string): Promise<string> {
    if (!fs.existsSync(filePath)) {
      throw new Error(`Artifact file not found: ${filePath}`);
    }
    return fs.readFileSync(filePath, 'utf-8');
  }

  /**
   * Lists all artifacts for a pipeline execution.
   */
  async listArtifacts(workspaceRoot: string, executionId: string): Promise<AutomationArtifact[]> {
    const dir = path.join(workspaceRoot, '.forge', 'artifacts', executionId);
    if (!fs.existsSync(dir)) {
      return [];
    }

    const files = fs.readdirSync(dir);
    return files.map((file) => {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);
      return {
        id: `art_${file}`,
        executionId,
        stepId: 'unknown',
        name: file,
        path: filePath,
        sizeBytes: stat.size,
        createdAt: stat.birthtimeMs,
      };
    });
  }
}
