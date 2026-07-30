/**
 * runtime-health.ts — Phase 23 Runtime Health Checker
 */

import * as http from 'http';
import * as https from 'https';
import { execFile } from 'child_process';
import { promisify } from 'util';

const execFileAsync = promisify(execFile);

export interface HealthCheckResult {
  runtimeId: string;
  health: 'healthy' | 'degraded' | 'unhealthy' | 'unknown';
  latencyMs: number;
  statusMessage: string;
  details?: Record<string, unknown>;
}

export class RuntimeHealthChecker {
  /**
   * Evaluates the operational status and response latency of a discovered runtime.
   */
  async checkHealth(
    runtimeId: string,
    executablePath?: string | null,
    rawEnvVars?: Record<string, string>
  ): Promise<HealthCheckResult> {
    const startTime = Date.now();

    switch (runtimeId.toLowerCase()) {
      case 'ollama':
        return this.checkOllamaHealth(runtimeId, startTime);
      case 'openai':
        return this.checkOpenAIHealth(runtimeId, rawEnvVars, startTime);
      case 'openrouter':
        return this.checkOpenRouterHealth(runtimeId, rawEnvVars, startTime);
      case 'claude-code':
      case 'gemini-cli':
      case 'codex-cli':
      case 'aider':
      case 'opencode':
      case 'goose':
        return this.checkCliHealth(runtimeId, executablePath, startTime);
      default:
        if (executablePath) {
          return this.checkCliHealth(runtimeId, executablePath, startTime);
        }
        return {
          runtimeId,
          health: 'unknown',
          latencyMs: 0,
          statusMessage: 'No health check strategy available for custom runtime',
        };
    }
  }

  private async checkOllamaHealth(runtimeId: string, startTime: number): Promise<HealthCheckResult> {
    return new Promise((resolve) => {
      const req = http.get('http://127.0.0.1:11434/api/tags', { timeout: 2500 }, (res) => {
        const latencyMs = Date.now() - startTime;
        if (res.statusCode === 200) {
          resolve({
            runtimeId,
            health: 'healthy',
            latencyMs,
            statusMessage: 'Ollama local daemon responding normally',
          });
        } else {
          resolve({
            runtimeId,
            health: 'degraded',
            latencyMs,
            statusMessage: `Ollama daemon returned HTTP ${res.statusCode}`,
          });
        }
      });

      req.on('error', () => {
        resolve({
          runtimeId,
          health: 'unhealthy',
          latencyMs: Date.now() - startTime,
          statusMessage: 'Ollama service offline or unreachable on http://127.0.0.1:11434',
        });
      });

      req.on('timeout', () => {
        req.destroy();
        resolve({
          runtimeId,
          health: 'unhealthy',
          latencyMs: Date.now() - startTime,
          statusMessage: 'Ollama request timed out after 2500ms',
        });
      });
    });
  }

  private async checkOpenAIHealth(
    runtimeId: string,
    envVars?: Record<string, string>,
    startTime = Date.now()
  ): Promise<HealthCheckResult> {
    const apiKey = envVars?.['OPENAI_API_KEY'] || process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return {
        runtimeId,
        health: 'unhealthy',
        latencyMs: 0,
        statusMessage: 'OPENAI_API_KEY environment variable not configured',
      };
    }

    return new Promise((resolve) => {
      const options: https.RequestOptions = {
        hostname: 'api.openai.com',
        path: '/v1/models',
        method: 'GET',
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'User-Agent': 'Forge-Desktop-RuntimeDiscovery',
        },
        timeout: 4000,
      };

      const req = https.request(options, (res) => {
        const latencyMs = Date.now() - startTime;
        if (res.statusCode === 200) {
          resolve({
            runtimeId,
            health: 'healthy',
            latencyMs,
            statusMessage: 'OpenAI API key validated successfully',
          });
        } else if (res.statusCode === 401) {
          resolve({
            runtimeId,
            health: 'unhealthy',
            latencyMs,
            statusMessage: 'OpenAI API key invalid or unauthorized (HTTP 401)',
          });
        } else {
          resolve({
            runtimeId,
            health: 'degraded',
            latencyMs,
            statusMessage: `OpenAI API returned HTTP ${res.statusCode}`,
          });
        }
      });

      req.on('error', (err) => {
        resolve({
          runtimeId,
          health: 'degraded',
          latencyMs: Date.now() - startTime,
          statusMessage: `OpenAI network check error: ${err.message}`,
        });
      });

      req.on('timeout', () => {
        req.destroy();
        resolve({
          runtimeId,
          health: 'degraded',
          latencyMs: Date.now() - startTime,
          statusMessage: 'OpenAI health request timed out',
        });
      });

      req.end();
    });
  }

  private async checkOpenRouterHealth(
    runtimeId: string,
    envVars?: Record<string, string>,
    startTime = Date.now()
  ): Promise<HealthCheckResult> {
    const apiKey = envVars?.['OPENROUTER_API_KEY'] || process.env.OPENROUTER_API_KEY;
    if (!apiKey) {
      return {
        runtimeId,
        health: 'unhealthy',
        latencyMs: 0,
        statusMessage: 'OPENROUTER_API_KEY environment variable not configured',
      };
    }

    return new Promise((resolve) => {
      const options: https.RequestOptions = {
        hostname: 'openrouter.ai',
        path: '/api/v1/auth/key',
        method: 'GET',
        headers: {
          Authorization: `Bearer ${apiKey}`,
        },
        timeout: 4000,
      };

      const req = https.request(options, (res) => {
        const latencyMs = Date.now() - startTime;
        if (res.statusCode === 200) {
          resolve({
            runtimeId,
            health: 'healthy',
            latencyMs,
            statusMessage: 'OpenRouter API key validated',
          });
        } else {
          resolve({
            runtimeId,
            health: 'degraded',
            latencyMs,
            statusMessage: `OpenRouter returned HTTP ${res.statusCode}`,
          });
        }
      });

      req.on('error', (err) => {
        resolve({
          runtimeId,
          health: 'degraded',
          latencyMs: Date.now() - startTime,
          statusMessage: `OpenRouter network error: ${err.message}`,
        });
      });

      req.on('timeout', () => {
        req.destroy();
        resolve({
          runtimeId,
          health: 'degraded',
          latencyMs: Date.now() - startTime,
          statusMessage: 'OpenRouter request timed out',
        });
      });

      req.end();
    });
  }

  private async checkCliHealth(
    runtimeId: string,
    executablePath?: string | null,
    startTime = Date.now()
  ): Promise<HealthCheckResult> {
    if (!executablePath) {
      return {
        runtimeId,
        health: 'unhealthy',
        latencyMs: 0,
        statusMessage: 'CLI executable path not specified or not installed',
      };
    }

    try {
      await execFileAsync(executablePath, ['--version'], { timeout: 3000, windowsHide: true });
      const latencyMs = Date.now() - startTime;
      return {
        runtimeId,
        health: 'healthy',
        latencyMs,
        statusMessage: 'CLI binary executing clean responsive health check',
      };
    } catch (err: any) {
      return {
        runtimeId,
        health: 'degraded',
        latencyMs: Date.now() - startTime,
        statusMessage: `CLI version execution failed: ${err.message}`,
      };
    }
  }
}
