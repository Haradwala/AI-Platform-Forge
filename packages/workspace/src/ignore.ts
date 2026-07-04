import picomatch from 'picomatch';
import * as fs from 'fs/promises';
import * as path from 'path';
import { IIgnoreRuleManager } from './interfaces/filesystem';

export class IgnoreRuleManager implements IIgnoreRuleManager {
  private patterns: string[] = [];
  private matchers: ((filePath: string) => boolean)[] = [];

  constructor(defaultPatterns: string[] = ['.git', 'node_modules', '.venv', 'dist']) {
    this.addPatterns(defaultPatterns);
  }

  addPatterns(patterns: string[]): void {
    const cleanPatterns = patterns
      .map(p => p.trim())
      .filter(p => p.length > 0 && !p.startsWith('#'));

    for (const pattern of cleanPatterns) {
      this.patterns.push(pattern);
      
      let globPattern = pattern;

      const isDirectoryOnly = globPattern.endsWith('/');
      if (isDirectoryOnly) {
        globPattern = globPattern.slice(0, -1);
      }

      const hasLeadingSlash = globPattern.startsWith('/');
      if (hasLeadingSlash) {
        globPattern = globPattern.slice(1);
      }

      let baseGlob = globPattern;
      if (!globPattern.includes('/') && !hasLeadingSlash) {
        baseGlob = `**/${globPattern}`;
      }

      try {
        this.matchers.push(picomatch(baseGlob, { dot: true }));
        this.matchers.push(picomatch(`${baseGlob}/**`, { dot: true }));
      } catch (err) {
        console.error(`IgnoreRuleManager: Invalid pattern skipped: ${pattern}`, err);
      }
    }
  }

  async loadGitignore(workspacePath: string): Promise<void> {
    const gitignorePath = path.join(workspacePath, '.gitignore');
    try {
      const content = await fs.readFile(gitignorePath, 'utf8');
      const lines = content.split(/\r?\n/);
      this.addPatterns(lines);
    } catch (err: any) {
      if (err.code !== 'ENOENT') {
        throw err;
      }
    }
  }

  isIgnored(relativePath: string): boolean {
    const normalizedPath = relativePath.replace(/\\/g, '/').replace(/^\.\//, '');

    for (const matcher of this.matchers) {
      if (matcher(normalizedPath)) {
        return true;
      }
    }
    return false;
  }
}
