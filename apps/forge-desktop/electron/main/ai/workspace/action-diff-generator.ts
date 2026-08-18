/**
 * action-diff-generator.ts
 *
 * Sprint 86 Phase 5 — Action Diff Generator
 *
 * Generates unified diff previews (FileDiffPreview[]) for proposed WorkspaceEdits
 * without mutating disk files.
 */

import * as fs from 'fs';

export interface TextEdit {
  readonly filePath: string;
  readonly startLine: number;
  readonly startColumn: number;
  readonly endLine: number;
  readonly endColumn: number;
  readonly newText: string;
}

export interface WorkspaceEdit {
  readonly id: string;
  readonly description: string;
  readonly edits: readonly TextEdit[];
  readonly createdAt: string;
}

export interface DiffHunk {
  readonly oldStart: number;
  readonly oldLines: number;
  readonly newStart: number;
  readonly newLines: number;
  readonly content: string;
}

export interface FileDiffPreview {
  readonly filePath: string;
  readonly hunks: readonly DiffHunk[];
}

export class ActionDiffGenerator {
  /**
   * Generate diff previews for all edits grouped by file.
   */
  generate(edit: WorkspaceEdit): FileDiffPreview[] {
    const fileGroups = new Map<string, TextEdit[]>();
    for (const e of edit.edits) {
      const list = fileGroups.get(e.filePath) || [];
      list.push(e);
      fileGroups.set(e.filePath, list);
    }

    const previews: FileDiffPreview[] = [];

    for (const [filePath, edits] of fileGroups.entries()) {
      let oldContent = '';
      try {
        if (fs.existsSync(filePath)) {
          oldContent = fs.readFileSync(filePath, 'utf8');
        }
      } catch {
        oldContent = '';
      }

      const hunks = this.createHunks(oldContent, edits);
      previews.push({ filePath, hunks });
    }

    return previews;
  }

  private createHunks(oldContent: string, edits: TextEdit[]): DiffHunk[] {
    const oldLines = oldContent.split(/\r?\n/);
    const hunks: DiffHunk[] = [];

    // Sort edits by startLine
    const sortedEdits = [...edits].sort((a, b) => a.startLine - b.startLine);

    for (const edit of sortedEdits) {
      const startIdx = Math.max(0, edit.startLine - 1);
      const endIdx = Math.min(oldLines.length, edit.endLine);

      const oldSnippet = oldLines.slice(startIdx, endIdx).join('\n');
      const diffLines: string[] = [];

      oldLines.slice(startIdx, endIdx).forEach((line) => {
        diffLines.push(`- ${line}`);
      });
      edit.newText.split(/\r?\n/).forEach((line) => {
        diffLines.push(`+ ${line}`);
      });

      hunks.push({
        oldStart: edit.startLine,
        oldLines: endIdx - startIdx,
        newStart: edit.startLine,
        newLines: edit.newText.split(/\r?\n/).length,
        content: diffLines.join('\n'),
      });
    }

    return hunks;
  }
}
