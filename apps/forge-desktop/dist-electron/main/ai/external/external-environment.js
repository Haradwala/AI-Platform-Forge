"use strict";
/**
 * external-environment.ts — Phase 18 External Runtime Foundation
 *
 * Configures PATH, environment variables, working directory, sandbox isolation, and temporary files.
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
exports.ExternalEnvironment = void 0;
const os = __importStar(require("os"));
const path = __importStar(require("path"));
const fs = __importStar(require("fs"));
class ExternalEnvironment {
    customEnv = {};
    workingDir = process.cwd();
    sandboxDir = '';
    constructor(initialCwd, initialEnv) {
        if (initialCwd) {
            this.workingDir = path.resolve(initialCwd);
        }
        if (initialEnv) {
            this.customEnv = { ...initialEnv };
        }
        this.initSandboxDir();
    }
    initSandboxDir() {
        const tempBase = os.tmpdir();
        this.sandboxDir = fs.mkdtempSync(path.join(tempBase, 'forge-external-rt-'));
    }
    /**
     * Resolves the full PATH including system defaults and custom search directories.
     */
    getSystemPath() {
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
    getMergedEnvironment() {
        const sanitizedSystemEnv = {};
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
    getWorkingDirectory() {
        return this.workingDir;
    }
    setWorkingDirectory(dir) {
        this.workingDir = path.resolve(dir);
    }
    getSandboxDirectory() {
        return this.sandboxDir;
    }
    dispose() {
        if (this.sandboxDir && fs.existsSync(this.sandboxDir)) {
            try {
                fs.rmSync(this.sandboxDir, { recursive: true, force: true });
            }
            catch {
                // Ignored on cleanup
            }
        }
    }
}
exports.ExternalEnvironment = ExternalEnvironment;
//# sourceMappingURL=external-environment.js.map