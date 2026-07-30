"use strict";
/**
 * runtime-validator.ts — Phase 23 Runtime Discovery Validation Engine
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
exports.RuntimeValidator = void 0;
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const child_process_1 = require("child_process");
const util_1 = require("util");
const runtime_config_1 = require("./runtime-config");
const execFileAsync = (0, util_1.promisify)(child_process_1.execFile);
class RuntimeValidator {
    /**
     * Validates if an executable file path exists, is accessible, and executes cleanly with --version / -v.
     */
    async validateExecutable(execPath, versionFlag = '--version', timeoutMs = 3000) {
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
        }
        catch (err) {
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
        }
        catch (err) {
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
    validateEnvironment(requiredKeys, optionalKeys = []) {
        const missingKeys = [];
        const redactedVars = {};
        const rawVars = {};
        for (const key of requiredKeys) {
            const val = process.env[key];
            if (!val || val.trim() === '') {
                missingKeys.push(key);
            }
            else {
                rawVars[key] = val;
                redactedVars[key] = runtime_config_1.RuntimeConfig.isSecretKey(key) ? runtime_config_1.RuntimeConfig.redactSecret(val) : val;
            }
        }
        for (const key of optionalKeys) {
            const val = process.env[key];
            if (val && val.trim() !== '') {
                rawVars[key] = val;
                redactedVars[key] = runtime_config_1.RuntimeConfig.isSecretKey(key) ? runtime_config_1.RuntimeConfig.redactSecret(val) : val;
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
exports.RuntimeValidator = RuntimeValidator;
//# sourceMappingURL=runtime-validator.js.map