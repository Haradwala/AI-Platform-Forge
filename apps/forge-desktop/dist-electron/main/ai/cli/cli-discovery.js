"use strict";
/**
 * cli-discovery.ts — Phase 19 Generic CLI Runtime
 *
 * Automatically detects installed AI CLI agents across system PATH, npm global,
 * pnpm global, bun, cargo, pipx, uv, and custom paths.
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
exports.CLIDiscovery = void 0;
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const os = __importStar(require("os"));
const child_process_1 = require("child_process");
class CLIDiscovery {
    isWindows = process.platform === 'win32';
    /**
     * Scans system PATH and common package manager global directories for an agent.
     */
    async discoverAgent(id, commandName) {
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
            const output = (0, child_process_1.execSync)(checkCmd, { encoding: 'utf-8', stdio: ['pipe', 'pipe', 'ignore'] }).trim();
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
        }
        catch {
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
    buildSearchLocations() {
        const home = os.homedir();
        const locations = [];
        if (this.isWindows) {
            locations.push(path.join(process.env.APPDATA || '', 'npm'), path.join(process.env.LOCALAPPDATA || '', 'Programs'), path.join(home, '.cargo', 'bin'), path.join(home, '.local', 'bin'), 'C:\\Program Files\\nodejs');
        }
        else {
            locations.push('/usr/local/bin', '/usr/bin', '/bin', path.join(home, '.nvm', 'versions', 'node', 'current', 'bin'), path.join(home, '.cargo', 'bin'), path.join(home, '.local', 'bin'), path.join(home, '.bun', 'bin'), path.join(home, '.pipx', 'bin'), path.join(home, '.uv', 'bin'));
        }
        return locations.filter((d) => fs.existsSync(d));
    }
    probeVersion(binaryPath) {
        try {
            const output = (0, child_process_1.execSync)(`"${binaryPath}" --version`, {
                encoding: 'utf-8',
                timeout: 2000,
                stdio: ['pipe', 'pipe', 'ignore'],
            }).trim();
            const match = output.match(/\d+\.\d+\.\d+/);
            return match ? match[0] : output.slice(0, 12) || '1.0.0';
        }
        catch {
            return '1.0.0';
        }
    }
}
exports.CLIDiscovery = CLIDiscovery;
//# sourceMappingURL=cli-discovery.js.map