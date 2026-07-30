/**
 * environment-doctor.ts — Phase 23 Environment Diagnostics & Doctor
 */

import * as os from 'os';
import * as fs from 'fs';
import * as path from 'path';
import { execFile } from 'child_process';
import { promisify } from 'util';
import { RuntimeConfig } from './runtime-config';

const execFileAsync = promisify(execFile);

export interface EnvironmentIssue {
  id: string;
  severity: 'error' | 'warning' | 'info';
  title: string;
  description: string;
  recommendation: string;
  affectedRuntimeId?: string;
}

export interface EnvironmentVariableStatus {
  key: string;
  status: 'set' | 'missing';
  isSecret: boolean;
  value?: string; // Redacted for secrets
}

export interface EnvironmentDiagnostics {
  systemInfo: {
    platform: string;
    arch: string;
    nodeVersion: string;
    pathDirsCount: number;
    pathDirs: string[];
  };
  issues: EnvironmentIssue[];
  missingDependencies: string[];
  environmentVariables: EnvironmentVariableStatus[];
  timestamp: number;
}

export class EnvironmentDoctor {
  /**
   * Evaluates system dependencies, environment variables, PATH configuration, and runtime requirements.
   */
  async runDiagnostics(): Promise<EnvironmentDiagnostics> {
    const rawPath = process.env.PATH || process.env.Path || '';
    const pathDelimiter = os.platform() === 'win32' ? ';' : ':';
    const pathDirs = rawPath.split(pathDelimiter).filter(Boolean);

    const issues: EnvironmentIssue[] = [];
    const missingDependencies: string[] = [];

    // Check system core dependencies
    const nodeOk = await this.checkDependency('node', ['-v']);
    if (!nodeOk) {
      missingDependencies.push('node');
      issues.push({
        id: 'missing-node',
        severity: 'error',
        title: 'Node.js Engine Missing',
        description: 'Node.js is required for local CLI tool execution and script adapters.',
        recommendation: 'Install Node.js (v18+) from https://nodejs.org',
      });
    }

    const gitOk = await this.checkDependency('git', ['--version']);
    if (!gitOk) {
      missingDependencies.push('git');
      issues.push({
        id: 'missing-git',
        severity: 'warning',
        title: 'Git SCM Missing',
        description: 'Git is recommended for agent workspace control and diff operations in Aider and Claude Code.',
        recommendation: 'Install Git from https://git-scm.com',
      });
    }

    const pythonOk = await this.checkDependency(os.platform() === 'win32' ? 'python' : 'python3', ['--version']);
    if (!pythonOk) {
      missingDependencies.push('python');
      issues.push({
        id: 'missing-python',
        severity: 'info',
        title: 'Python Interpreter Missing',
        description: 'Python is required by Aider and some local code analysis extensions.',
        recommendation: 'Install Python 3.10+ from https://python.org or via package manager',
        affectedRuntimeId: 'aider',
      });
    }

    // Check PATH environment configuration
    if (os.platform() === 'darwin') {
      const hasBrewPath = pathDirs.some((d) => d.includes('/opt/homebrew/bin') || d.includes('/usr/local/bin'));
      if (!hasBrewPath) {
        issues.push({
          id: 'mac-brew-path',
          severity: 'warning',
          title: 'Homebrew Binaries Path Missing',
          description: 'Standard Homebrew paths (/opt/homebrew/bin) were not found in process PATH.',
          recommendation: 'Add Homebrew to PATH in your ~/.zshrc or ~/.bash_profile',
        });
      }
    }

    const homeDir = os.homedir();
    const cargoBin = path.join(homeDir, '.cargo', 'bin');
    if (fs.existsSync(cargoBin) && !pathDirs.includes(cargoBin)) {
      issues.push({
        id: 'cargo-path-missing',
        severity: 'info',
        title: 'Cargo Binaries Path Not in System PATH',
        description: `Found Rust Cargo bin folder (${cargoBin}) but it is not in process PATH.`,
        recommendation: `Add ${cargoBin} to your system PATH environment variable.`,
      });
    }

    // Environment variables status check
    const trackedKeys = [
      'OPENAI_API_KEY',
      'OPENROUTER_API_KEY',
      'ANTHROPIC_API_KEY',
      'GEMINI_API_KEY',
      'OLLAMA_HOST',
    ];

    const environmentVariables: EnvironmentVariableStatus[] = trackedKeys.map((key) => {
      const val = process.env[key];
      const isSet = !!(val && val.trim() !== '');
      const isSecret = RuntimeConfig.isSecretKey(key);
      return {
        key,
        status: isSet ? 'set' : 'missing',
        isSecret,
        value: isSet ? (isSecret ? RuntimeConfig.redactSecret(val) : val) : undefined,
      };
    });

    return {
      systemInfo: {
        platform: os.platform(),
        arch: os.arch(),
        nodeVersion: process.version,
        pathDirsCount: pathDirs.length,
        pathDirs,
      },
      issues,
      missingDependencies,
      environmentVariables,
      timestamp: Date.now(),
    };
  }

  private async checkDependency(command: string, args: string[]): Promise<boolean> {
    try {
      await execFileAsync(command, args, { timeout: 2000, windowsHide: true });
      return true;
    } catch {
      return false;
    }
  }
}
