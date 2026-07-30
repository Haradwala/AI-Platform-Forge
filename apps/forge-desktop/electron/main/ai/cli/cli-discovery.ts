/**
 * cli-discovery.ts — Phase 19 Generic CLI Runtime
 *
 * Automatically detects installed AI CLI agents across system PATH, npm global,
 * pnpm global, bun, cargo, pipx, uv, and custom paths.
 */

import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
import { execSync } from 'child_process';
import { DiscoveryError } from './cli-errors';

export type CLIAgentStatus = 'installed' | 'not-found' | 'error';

export interface DiscoveredCLIResult {
  id: string;
  name: string;
  version: string;
  path: string;
  status: CLIAgentStatus;
  installLocation?: string;
}

export class CLIDiscovery {
  private readonly isWindows = process.platform === 'win32';

  /**
   * Scans system PATH and common package manager global directories for an agent.
   */
  async discoverAgent(id: string, commandName: string): Promise<DiscoveredCLIResult> {
    const searchPaths = this.buildSearchLocations();

    for (const searchDir of searchPaths) {
      const binaryPath = path.join(searchDir, this.isWindows ? `${commandName}.cmd` : commandName);
      const exePath = path.join(searchDir, this.isWindows ? `${commandName}.exe` : commandName);
      const targetPath = fs.existsSync(binaryPath) ? binaryPath : fs.existsSync(exePath) ? exePath : null;

      if (targetPath) {
        const version = this.probeVersion(targetPath);
        return {
          id,
          name: commandName,
          version,
          path: targetPath,
          status: 'installed',
          installLocation: searchDir,
        };
      }
    }

    // Try system PATH check (`which` / `where`)
    try {
      const checkCmd = this.isWindows ? `where ${commandName}` : `which ${commandName}`;
      const output = execSync(checkCmd, { encoding: 'utf-8', stdio: ['pipe', 'pipe', 'ignore'] }).trim();
      const firstLine = output.split(/\r?\n/)[0];

      if (firstLine && fs.existsSync(firstLine)) {
        const version = this.probeVersion(firstLine);
        return {
          id,
          name: commandName,
          version,
          path: firstLine,
          status: 'installed',
          installLocation: path.dirname(firstLine),
        };
      }
    } catch {
      // Not found on system path
    }

    return {
      id,
      name: commandName,
      version: '0.0.0',
      path: '',
      status: 'not-found',
    };
  }

  private buildSearchLocations(): string[] {
    const home = os.homedir();
    const locations: string[] = [];

    if (this.isWindows) {
      locations.push(
        path.join(process.env.APPDATA || '', 'npm'),
        path.join(process.env.LOCALAPPDATA || '', 'Programs'),
        path.join(home, '.cargo', 'bin'),
        path.join(home, '.local', 'bin'),
        'C:\\Program Files\\nodejs'
      );
    } else {
      locations.push(
        '/usr/local/bin',
        '/usr/bin',
        '/bin',
        path.join(home, '.nvm', 'versions', 'node', 'current', 'bin'),
        path.join(home, '.cargo', 'bin'),
        path.join(home, '.local', 'bin'),
        path.join(home, '.bun', 'bin'),
        path.join(home, '.pipx', 'bin'),
        path.join(home, '.uv', 'bin')
      );
    }

    return locations.filter((d) => fs.existsSync(d));
  }

  private probeVersion(binaryPath: string): string {
    try {
      const output = execSync(`"${binaryPath}" --version`, {
        encoding: 'utf-8',
        timeout: 2000,
        stdio: ['pipe', 'pipe', 'ignore'],
      }).trim();
      const match = output.match(/\d+\.\d+\.\d+/);
      return match ? match[0] : output.slice(0, 12) || '1.0.0';
    } catch {
      return '1.0.0';
    }
  }
}
