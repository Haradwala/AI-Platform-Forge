"use strict";
/**
 * runtime-health.ts — Phase 23 Runtime Health Checker
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.RuntimeHealthChecker = void 0;
const http = __importStar(require("http"));
const https = __importStar(require("https"));
const child_process_1 = require("child_process");
const util_1 = require("util");
const execFileAsync = (0, util_1.promisify)(child_process_1.execFile);
class RuntimeHealthChecker {
    /**
     * Evaluates the operational status and response latency of a discovered runtime.
     */
    async checkHealth(runtimeId, executablePath, rawEnvVars) {
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
    async checkOllamaHealth(runtimeId, startTime) {
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
                }
                else {
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
    async checkOpenAIHealth(runtimeId, envVars, startTime = Date.now()) {
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
            const options = {
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
                }
                else if (res.statusCode === 401) {
                    resolve({
                        runtimeId,
                        health: 'unhealthy',
                        latencyMs,
                        statusMessage: 'OpenAI API key invalid or unauthorized (HTTP 401)',
                    });
                }
                else {
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
    async checkOpenRouterHealth(runtimeId, envVars, startTime = Date.now()) {
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
            const options = {
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
                }
                else {
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
    async checkCliHealth(runtimeId, executablePath, startTime = Date.now()) {
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
        }
        catch (err) {
            return {
                runtimeId,
                health: 'degraded',
                latencyMs: Date.now() - startTime,
                statusMessage: `CLI version execution failed: ${err.message}`,
            };
        }
    }
}
exports.RuntimeHealthChecker = RuntimeHealthChecker;
//# sourceMappingURL=runtime-health.js.map