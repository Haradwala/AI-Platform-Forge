import * as fs from 'fs/promises';
import * as path from 'path';
import { IWorkspaceScanner, IIgnoreRuleManager } from './interfaces/filesystem';
import { IWorkspaceFile, WorkspaceFile } from '@forge/shared';

export class WorkspaceScanner implements IWorkspaceScanner {
  async *scan(rootPath: string, ignore: IIgnoreRuleManager): AsyncGenerator<IWorkspaceFile, void, unknown> {
    yield* this.walk(rootPath, rootPath, ignore);
  }

  private async *walk(
    currentDir: string,
    rootPath: string,
    ignore: IIgnoreRuleManager
  ): AsyncGenerator<IWorkspaceFile, void, unknown> {
    let entries: string[] = [];
    try {
      entries = await fs.readdir(currentDir);
    } catch {
      return;
    }

    for (const entry of entries) {
      const fullPath = path.join(currentDir, entry);
      const relativePath = path.relative(rootPath, fullPath);

      if (ignore.isIgnored(relativePath)) {
        continue;
      }

      let stat;
      try {
        stat = await fs.stat(fullPath);
      } catch {
        continue;
      }

      const isDir = stat.isDirectory();
      const ext = isDir ? '' : path.extname(entry);

      const workspaceFile = new WorkspaceFile(
        entry,
        relativePath,
        fullPath,
        ext,
        stat.size,
        stat.mtime,
        isDir
      );

      yield workspaceFile;

      if (isDir) {
        yield* this.walk(fullPath, rootPath, ignore);
      }
    }
  }
}
