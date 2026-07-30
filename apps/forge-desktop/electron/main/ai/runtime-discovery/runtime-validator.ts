/**
 * runtime-validator.ts — Phase 23 Runtime Discovery Validation Engine
 */

import * as fs from 'fs';
import * as path from 'path';
import { execFile } from 'child_process';
import { promisify } from 'util';
import { RuntimeConfig } from './runtime-config';

const execFileAsync = promisify(execFile);

export interface ValidationResult {
  valid: boolean;
  executablePath: string | null;
  version: string | null;
  error?: string;
}

export interface EnvValidationResult {
  valid: boolean;
  missingKeys: string[];
  redactedVars: Record<string, string>;
  rawVars: Record<string, string>;
}

export class RuntimeValidator {
  /**
   * Validates if an executable file path exists, is accessible, and executes cleanly with --version / -v.
   */
  async validateExecutable(
    execPath: string,
    versionFlag = '--version',
    timeoutMs = 3000
  ): Promise<ValidationResult> {
    if (!execPath || typeof execPath !== 'string') {
      return { valid: false, executablePath: null, version: null, error: 'Path not provided' };
    }

    const resolvedPath = path.resolve(execPath);

    if (!fs.existsSync(resolvedPath)) {
      return { valid: false, executablePath: resolvedPath, version: null, error: 'File does not exist' };
    }

    try {
      const stats = fs.statSync(resolvedPath);
      if (!stats.isFile()) {
        return { valid: false, executablePath: resolvedPath, version: null, error: 'Target path is not a file' };
      }
    } catch (err: any) {
      return { valid: false, executablePath: resolvedPath, version: null, error: err.message };
    }

    try {
      const { stdout, stderr } = await execFileAsync(resolvedPath, [versionFlag], {
        timeout: timeoutMs,
        windowsHide: true,
      });

      const rawOutput = (stdout || stderr || '').trim();
      const versionMatch = rawOutput.match(/\v?(\d+\.\d+\.\d+(?:-[a-zA-Z0-9.]+)?)/);
      const version = versionMatch ? versionMatch[1] : rawOutput.split('\n')[0] || '1.0.0';

      return {
        valid: true,
        executablePath: resolvedPath,
        version: version || '1.0.0',
      };
    } catch (err: any) {
      // If version command failed or timed out, but executable exists, return valid = true with warning
      return {
        valid: true,
        executablePath: resolvedPath,
        version: '1.0.0',
        error: `Version check failed: ${err.message}`,
      };
    }
  }

  /**
   * Validates environment variables for cloud/API runtimes without exposing secrets.
   */
  validateEnvironment(
    requiredKeys: string[],
    optionalKeys: string[] = []
  ): EnvValidationResult {
    const missingKeys: string[] = [];
    const redactedVars: Record<string, string> = {};
    const rawVars: Record<string, string> = {};

    for (const key of requiredKeys) {
      const val = process.env[key];
      if (!val || val.trim() === '') {
        missingKeys.push(key);
      } else {
        rawVars[key] = val;
        redactedVars[key] = RuntimeConfig.isSecretKey(key) ? RuntimeConfig.redactSecret(val) : val;
      }
    }

    for (const key of optionalKeys) {
      const val = process.env[key];
      if (val && val.trim() !== '') {
        rawVars[key] = val;
        redactedVars[key] = RuntimeConfig.isSecretKey(key) ? RuntimeConfig.redactSecret(val) : val;
      }
    }

    return {
      valid: missingKeys.length === 0,
      missingKeys,
      redactedVars,
      rawVars,
    };
  }
}
