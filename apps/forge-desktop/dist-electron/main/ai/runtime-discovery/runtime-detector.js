"use strict";
/**
 * runtime-detector.ts — Phase 23 Runtime Detector Engine
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
exports.RuntimeDetector = void 0;
const os = __importStar(require("os"));
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const runtime_validator_1 = require("./runtime-validator");
class RuntimeDetector {
    validator = new runtime_validator_1.RuntimeValidator();
    /**
     * Scans system PATH and common installation directories across Windows, macOS, and Linux.
     */
    async detectAll(config) {
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
    async detectOllama(customPath) {
        const binaryNames = os.platform() === 'win32' ? ['ollama.exe', 'ollama'] : ['ollama'];
        const extraPaths = [
            'C:\\Program Files\\Ollama',
            'C:\\Users\\' + (process.env.USERNAME || '') + '\\AppData\\Local\\Programs\\Ollama',
            '/usr/local/bin',
            '/opt/homebrew/bin',
            '/usr/bin',
        ];
        const foundPath = customPath || (await this.findExecutable(binaryNames, extraPaths));
        let version = null;
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
    async detectClaudeCode(customPath) {
        const binaryNames = os.platform() === 'win32' ? ['claude.cmd', 'claude.exe', 'claude'] : ['claude'];
        const foundPath = customPath || (await this.findExecutable(binaryNames));
        let version = null;
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
    async detectGeminiCli(customPath) {
        const binaryNames = os.platform() === 'win32' ? ['gemini.cmd', 'gemini.exe', 'gemini'] : ['gemini'];
        const foundPath = customPath || (await this.findExecutable(binaryNames));
        let version = null;
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
    async detectCodexCli(customPath) {
        const binaryNames = os.platform() === 'win32' ? ['codex.cmd', 'codex.exe', 'codex'] : ['codex'];
        const foundPath = customPath || (await this.findExecutable(binaryNames));
        let version = null;
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
    async detectAider(customPath) {
        const binaryNames = os.platform() === 'win32' ? ['aider.exe', 'aider'] : ['aider'];
        const foundPath = customPath || (await this.findExecutable(binaryNames));
        let version = null;
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
    async detectOpenCode(customPath) {
        const binaryNames = os.platform() === 'win32' ? ['opencode.exe', 'opencode', 'open-code'] : ['opencode', 'open-code'];
        const foundPath = customPath || (await this.findExecutable(binaryNames));
        let version = null;
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
    async detectGoose(customPath) {
        const binaryNames = os.platform() === 'win32' ? ['goose.exe', 'goose'] : ['goose'];
        const foundPath = customPath || (await this.findExecutable(binaryNames));
        let version = null;
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
    async detectOpenRouter() {
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
    async detectOpenAI() {
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
    async findExecutable(binaryNames, extraSearchDirs = []) {
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
            commonDirs.push(path.join(localAppData, 'Programs'), path.join(localAppData, 'Microsoft', 'WindowsApps'), path.join(appData, 'npm'), 'C:\\Program Files', 'C:\\Program Files (x86)');
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
                    }
                    catch {
                        // ignore access permission errors
                    }
                }
            }
        }
        return null;
    }
}
exports.RuntimeDetector = RuntimeDetector;
//# sourceMappingURL=runtime-detector.js.map