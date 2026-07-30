import * as fs from 'fs/promises';
import * as path from 'path';

export class WorkspaceScanner {
  async scanDirectory(rootPath: string): Promise<string[]> {
    const fileList: string[] = [];
    await this.walk(rootPath, rootPath, fileList);
    return fileList;
  }

  private async walk(currentDir: string, rootPath: string, fileList: string[]): Promise<void> {
    try {
      const entries = await fs.readdir(currentDir, { withFileTypes: true });
      for (const entry of entries) {
        const fullPath = path.join(currentDir, entry.name);
        const relPath = path.relative(rootPath, fullPath);

        if (entry.isDirectory()) {
          if (entry.name === 'node_modules' || entry.name === 'dist' || entry.name === '.git' || entry.name === '.forge') {
            continue;
          }
          await this.walk(fullPath, rootPath, fileList);
        } else if (entry.isFile()) {
          if (entry.name.endsWith('.ts') || entry.name.endsWith('.tsx') || entry.name.endsWith('.js') || entry.name.endsWith('.jsx')) {
            fileList.push(relPath);
          }
        }
      }
    } catch {
      // Ignore unreadable directories
    }
  }
}
