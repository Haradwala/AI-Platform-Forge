/**
 * external-environment.ts — Phase 18 External Runtime Foundation
 *
 * Configures PATH, environment variables, working directory, sandbox isolation, and temporary files.
 */

import * as os from 'os';
import * as path from 'path';
import * as fs from 'fs';

export class ExternalEnvironment {
  private customEnv: Record<string, string> = {};
  private workingDir: string = process.cwd();
  private sandboxDir: string = '';

  constructor(initialCwd?: string, initialEnv?: Record<string, string>) {
    if (initialCwd) {
      this.workingDir = path.resolve(initialCwd);
    }
    if (initialEnv) {
      this.customEnv = { ...initialEnv };
    }
    this.initSandboxDir();
  }

  private initSandboxDir(): void {
    const tempBase = os.tmpdir();
    this.sandboxDir = fs.mkdtempSync(path.join(tempBase, 'forge-external-rt-'));
  }

  /**
   * Resolves the full PATH including system defaults and custom search directories.
   */
  getSystemPath(): string {
    const currentPath = process.env.PATH || process.env.Path || '';
    const extraPaths = [
      '/usr/local/bin',
      '/usr/bin',
      '/bin',
      'C:\\Program Files\\nodejs',
      path.join(os.homedir(), '.cargo', 'bin'),
      path.join(os.homedir(), '.local', 'bin'),
    ];

    const merged = new Set([
      ...currentPath.split(path.delimiter),
      ...extraPaths.filter((p) => fs.existsSync(p)),
    ]);

    return Array.from(merged).join(path.delimiter);
  }

  /**
   * Constructs sanitized environment variables for process spawning.
   */
  getMergedEnvironment(): Record<string, string> {
    const sanitizedSystemEnv: Record<string, string> = {};
    for (const [key, value] of Object.entries(process.env)) {
      if (value !== undefined && !key.startsWith('FORGE_INTERNAL_SECRET')) {
        sanitizedSystemEnv[key] = value;
      }
    }

    return {
      ...sanitizedSystemEnv,
      PATH: this.getSystemPath(),
      Path: this.getSystemPath(),
      FORGE_SANDBOX_DIR: this.sandboxDir,
      FORGE_IS_EXTERNAL_RUNTIME: 'true',
      ...this.customEnv,
    };
  }

  getWorkingDirectory(): string {
    return this.workingDir;
  }

  setWorkingDirectory(dir: string): void {
    this.workingDir = path.resolve(dir);
  }

  getSandboxDirectory(): string {
    return this.sandboxDir;
  }

  dispose(): void {
    if (this.sandboxDir && fs.existsSync(this.sandboxDir)) {
      try {
        fs.rmSync(this.sandboxDir, { recursive: true, force: true });
      } catch {
        // Ignored on cleanup
      }
    }
  }
}
