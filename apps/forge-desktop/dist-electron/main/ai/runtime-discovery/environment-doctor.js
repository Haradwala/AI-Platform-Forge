"use strict";
/**
 * environment-doctor.ts — Phase 23 Environment Diagnostics & Doctor
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
exports.EnvironmentDoctor = void 0;
const os = __importStar(require("os"));
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const child_process_1 = require("child_process");
const util_1 = require("util");
const runtime_config_1 = require("./runtime-config");
const execFileAsync = (0, util_1.promisify)(child_process_1.execFile);
class EnvironmentDoctor {
    /**
     * Evaluates system dependencies, environment variables, PATH configuration, and runtime requirements.
     */
    async runDiagnostics() {
        const rawPath = process.env.PATH || process.env.Path || '';
        const pathDelimiter = os.platform() === 'win32' ? ';' : ':';
        const pathDirs = rawPath.split(pathDelimiter).filter(Boolean);
        const issues = [];
        const missingDependencies = [];
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
        const environmentVariables = trackedKeys.map((key) => {
            const val = process.env[key];
            const isSet = !!(val && val.trim() !== '');
            const isSecret = runtime_config_1.RuntimeConfig.isSecretKey(key);
            return {
                key,
                status: isSet ? 'set' : 'missing',
                isSecret,
                value: isSet ? (isSecret ? runtime_config_1.RuntimeConfig.redactSecret(val) : val) : undefined,
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
    async checkDependency(command, args) {
        try {
            await execFileAsync(command, args, { timeout: 2000, windowsHide: true });
            return true;
        }
        catch {
            return false;
        }
    }
}
exports.EnvironmentDoctor = EnvironmentDoctor;
//# sourceMappingURL=environment-doctor.js.map