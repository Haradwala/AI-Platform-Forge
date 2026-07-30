/**
 * runtime-detector.ts — Phase 23 Runtime Detector Engine
 */

import * as os from 'os';
import * as fs from 'fs';
import * as path from 'path';
import { RuntimeValidator } from './runtime-validator';
import { RuntimeConfig } from './runtime-config';
import type { KnownRuntimeId, RuntimeCategory, RuntimeCapabilities } from './runtime-types';

export interface DetectionResult {
  id: KnownRuntimeId;
  name: string;
  category: RuntimeCategory;
  installed: boolean;
  version: string | null;
  executablePath: string | null;
  envVars: Record<string, string>; // Redacted in UI/logs
  rawEnvVars: Record<string, string>; // Internal only
  capabilities: RuntimeCapabilities;
  installUrl: string;
  missingDependencies?: string[];
}

export class RuntimeDetector {
  private validator = new RuntimeValidator();

  /**
   * Scans system PATH and common installation directories across Windows, macOS, and Linux.
   */
  async detectAll(config?: RuntimeConfig): Promise<DetectionResult[]> {
    const customPaths = config?.getConfig().customExecutablePaths || {};

    const detections = await Promise.all([
      this.detectOllama(customPaths['ollama']),
      this.detectClaudeCode(customPaths['claude-code']),
      this.detectGeminiCli(customPaths['gemini-cli']),
      this.detectCodexCli(customPaths['codex-cli']),
      this.detectAider(customPaths['aider']),
      this.detectOpenCode(customPaths['opencode']),
      this.detectGoose(customPaths['goose']),
      this.detectOpenRouter(),
      this.detectOpenAI(),
    ]);

    return detections;
  }

  // ─── Individual Runtime Detectors ──────────────────────────────────────────

  private async detectOllama(customPath?: string): Promise<DetectionResult> {
    const binaryNames = os.platform() === 'win32' ? ['ollama.exe', 'ollama'] : ['ollama'];
    const extraPaths = [
      'C:\\Program Files\\Ollama',
      'C:\\Users\\' + (process.env.USERNAME || '') + '\\AppData\\Local\\Programs\\Ollama',
      '/usr/local/bin',
      '/opt/homebrew/bin',
      '/usr/bin',
    ];

    const foundPath = customPath || (await this.findExecutable(binaryNames, extraPaths));
    let version: string | null = null;
    let installed = false;

    if (foundPath) {
      const res = await this.validator.validateExecutable(foundPath, '--version');
      installed = res.valid;
      version = res.version;
    }

    return {
      id: 'ollama',
      name: 'Ollama Local LLM Runner',
      category: 'local',
      installed,
      version,
      executablePath: foundPath,
      envVars: {},
      rawEnvVars: {},
      capabilities: { streaming: true, tools: true, mcp: true, approval: true, resume: true },
      installUrl: 'https://ollama.com/download',
    };
  }

  private async detectClaudeCode(customPath?: string): Promise<DetectionResult> {
    const binaryNames = os.platform() === 'win32' ? ['claude.cmd', 'claude.exe', 'claude'] : ['claude'];
    const foundPath = customPath || (await this.findExecutable(binaryNames));

    let version: string | null = null;
    let installed = false;

    if (foundPath) {
      const res = await this.validator.validateExecutable(foundPath, '--version');
      installed = res.valid;
      version = res.version;
    }

    const envRes = this.validator.validateEnvironment([], ['ANTHROPIC_API_KEY']);

    return {
      id: 'claude-code',
      name: 'Claude Code CLI',
      category: 'cli',
      installed,
      version,
      executablePath: foundPath,
      envVars: envRes.redactedVars,
      rawEnvVars: envRes.rawVars,
      capabilities: { streaming: true, tools: true, mcp: true, approval: true, resume: true, images: true },
      installUrl: 'https://docs.anthropic.com/en/docs/agents-and-tools/claude-code',
    };
  }

  private async detectGeminiCli(customPath?: string): Promise<DetectionResult> {
    const binaryNames = os.platform() === 'win32' ? ['gemini.cmd', 'gemini.exe', 'gemini'] : ['gemini'];
    const foundPath = customPath || (await this.findExecutable(binaryNames));

    let version: string | null = null;
    let installed = false;

    if (foundPath) {
      const res = await this.validator.validateExecutable(foundPath, '--version');
      installed = res.valid;
      version = res.version;
    }

    const envRes = this.validator.validateEnvironment([], ['GEMINI_API_KEY']);

    return {
      id: 'gemini-cli',
      name: 'Gemini CLI Assistant',
      category: 'cli',
      installed,
      version,
      executablePath: foundPath,
      envVars: envRes.redactedVars,
      rawEnvVars: envRes.rawVars,
      capabilities: { streaming: true, tools: true, mcp: true, approval: true, resume: true },
      installUrl: 'https://github.com/google/gemini-cli',
    };
  }

  private async detectCodexCli(customPath?: string): Promise<DetectionResult> {
    const binaryNames = os.platform() === 'win32' ? ['codex.cmd', 'codex.exe', 'codex'] : ['codex'];
    const foundPath = customPath || (await this.findExecutable(binaryNames));

    let version: string | null = null;
    let installed = false;

    if (foundPath) {
      const res = await this.validator.validateExecutable(foundPath, '--version');
      installed = res.valid;
      version = res.version;
    }

    const envRes = this.validator.validateEnvironment([], ['OPENAI_API_KEY']);

    return {
      id: 'codex-cli',
      name: 'Codex CLI Agent',
      category: 'cli',
      installed,
      version,
      executablePath: foundPath,
      envVars: envRes.redactedVars,
      rawEnvVars: envRes.rawVars,
      capabilities: { streaming: true, tools: true, mcp: false, approval: true },
      installUrl: 'https://github.com/openai/codex-cli',
    };
  }

  private async detectAider(customPath?: string): Promise<DetectionResult> {
    const binaryNames = os.platform() === 'win32' ? ['aider.exe', 'aider'] : ['aider'];
    const foundPath = customPath || (await this.findExecutable(binaryNames));

    let version: string | null = null;
    let installed = false;

    if (foundPath) {
      const res = await this.validator.validateExecutable(foundPath, '--version');
      installed = res.valid;
      version = res.version;
    }

    const envRes = this.validator.validateEnvironment([], ['OPENAI_API_KEY', 'ANTHROPIC_API_KEY']);

    return {
      id: 'aider',
      name: 'Aider AI Pair Programmer',
      category: 'cli',
      installed,
      version,
      executablePath: foundPath,
      envVars: envRes.redactedVars,
      rawEnvVars: envRes.rawVars,
      capabilities: { streaming: true, tools: true, mcp: true, approval: true, resume: true },
      installUrl: 'https://aider.chat/docs/install.html',
    };
  }

  private async detectOpenCode(customPath?: string): Promise<DetectionResult> {
    const binaryNames = os.platform() === 'win32' ? ['opencode.exe', 'opencode', 'open-code'] : ['opencode', 'open-code'];
    const foundPath = customPath || (await this.findExecutable(binaryNames));

    let version: string | null = null;
    let installed = false;

    if (foundPath) {
      const res = await this.validator.validateExecutable(foundPath, '--version');
      installed = res.valid;
      version = res.version;
    }

    return {
      id: 'opencode',
      name: 'OpenCode Interpreter',
      category: 'cli',
      installed,
      version,
      executablePath: foundPath,
      envVars: {},
      rawEnvVars: {},
      capabilities: { streaming: true, tools: true, mcp: true, approval: false },
      installUrl: 'https://opencode.ai',
    };
  }

  private async detectGoose(customPath?: string): Promise<DetectionResult> {
    const binaryNames = os.platform() === 'win32' ? ['goose.exe', 'goose'] : ['goose'];
    const foundPath = customPath || (await this.findExecutable(binaryNames));

    let version: string | null = null;
    let installed = false;

    if (foundPath) {
      const res = await this.validator.validateExecutable(foundPath, '--version');
      installed = res.valid;
      version = res.version;
    }

    return {
      id: 'goose',
      name: 'Goose Open Source Agent',
      category: 'cli',
      installed,
      version,
      executablePath: foundPath,
      envVars: {},
      rawEnvVars: {},
      capabilities: { streaming: true, tools: true, mcp: true, approval: true, resume: true },
      installUrl: 'https://block.github.io/goose/',
    };
  }

  private async detectOpenRouter(): Promise<DetectionResult> {
    const envRes = this.validator.validateEnvironment(['OPENROUTER_API_KEY']);

    return {
      id: 'openrouter',
      name: 'OpenRouter Cloud Gateway',
      category: 'cloud',
      installed: envRes.valid,
      version: 'API v1',
      executablePath: null,
      envVars: envRes.redactedVars,
      rawEnvVars: envRes.rawVars,
      capabilities: { streaming: true, tools: true, mcp: false, approval: false },
      installUrl: 'https://openrouter.ai/keys',
    };
  }

  private async detectOpenAI(): Promise<DetectionResult> {
    const envRes = this.validator.validateEnvironment(['OPENAI_API_KEY']);

    return {
      id: 'openai',
      name: 'OpenAI Direct API',
      category: 'cloud',
      installed: envRes.valid,
      version: 'API v1',
      executablePath: null,
      envVars: envRes.redactedVars,
      rawEnvVars: envRes.rawVars,
      capabilities: { streaming: true, tools: true, mcp: false, approval: false },
      installUrl: 'https://platform.openai.com/api-keys',
    };
  }

  // ─── PATH & Directory Search Helper ────────────────────────────────────────

  private async findExecutable(binaryNames: string[], extraSearchDirs: string[] = []): Promise<string | null> {
    const rawPath = process.env.PATH || process.env.Path || '';
    const pathDelimiter = os.platform() === 'win32' ? ';' : ':';
    const pathDirs = rawPath.split(pathDelimiter).filter(Boolean);

    const homeDir = os.homedir();
    const commonDirs = [
      ...extraSearchDirs,
      ...pathDirs,
      path.join(homeDir, '.cargo', 'bin'),
      path.join(homeDir, '.local', 'bin'),
      path.join(homeDir, '.nvm', 'versions', 'node', 'current', 'bin'),
      '/usr/local/bin',
      '/opt/homebrew/bin',
      '/usr/bin',
      '/snap/bin',
    ];

    if (os.platform() === 'win32') {
      const localAppData = process.env.LOCALAPPDATA || path.join(homeDir, 'AppData', 'Local');
      const appData = process.env.APPDATA || path.join(homeDir, 'AppData', 'Roaming');
      commonDirs.push(
        path.join(localAppData, 'Programs'),
        path.join(localAppData, 'Microsoft', 'WindowsApps'),
        path.join(appData, 'npm'),
        'C:\\Program Files',
        'C:\\Program Files (x86)'
      );
    }

    const uniqueDirs = Array.from(new Set(commonDirs.filter(Boolean)));

    for (const dir of uniqueDirs) {
      for (const name of binaryNames) {
        const fullPath = path.join(dir, name);
        if (fs.existsSync(fullPath)) {
          try {
            const stat = fs.statSync(fullPath);
            if (stat.isFile()) {
              return fullPath;
            }
          } catch {
            // ignore access permission errors
          }
        }
      }
    }

    return null;
  }
}
