"use strict";
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
exports.WorkspaceDiscoveryService = void 0;
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
class WorkspaceDiscoveryService {
    async discover(rootPath) {
        const projects = [];
        const languages = new Set();
        let filesCount = 0;
        const scan = async (dir) => {
            const entries = await fs.promises.readdir(dir, { withFileTypes: true });
            for (const entry of entries) {
                const fullPath = path.join(dir, entry.name);
                if (entry.name === 'node_modules' || entry.name === '.git' || entry.name === 'dist' || entry.name === 'build' || entry.name === '.forge') {
                    continue;
                }
                if (entry.isDirectory()) {
                    // Detect project types
                    const files = await fs.promises.readdir(fullPath);
                    const hasPackageJson = files.includes('package.json');
                    const hasCargoToml = files.includes('Cargo.toml');
                    const hasGoMod = files.includes('go.mod');
                    if (hasPackageJson || hasCargoToml || hasGoMod) {
                        const projectType = hasPackageJson ? 'NodeJS' : hasCargoToml ? 'Rust' : 'Go';
                        const packageManager = hasPackageJson ? (files.includes('pnpm-lock.yaml') ? 'pnpm' : 'npm') : hasCargoToml ? 'cargo' : 'go-modules';
                        // Framework detection
                        const frameworks = [];
                        if (hasPackageJson) {
                            try {
                                const pkg = JSON.parse(await fs.promises.readFile(path.join(fullPath, 'package.json'), 'utf8'));
                                const deps = { ...pkg.dependencies, ...pkg.devDependencies };
                                if (deps.react)
                                    frameworks.push('react');
                                if (deps.next)
                                    frameworks.push('nextjs');
                                if (deps.vite)
                                    frameworks.push('vite');
                            }
                            catch {
                                // Ignore parsing errors
                            }
                        }
                        projects.push({
                            name: entry.name,
                            path: fullPath,
                            type: projectType,
                            packageManager,
                            frameworks,
                        });
                    }
                    await scan(fullPath);
                }
                else if (entry.isFile()) {
                    filesCount++;
                    const ext = path.extname(entry.name).toLowerCase();
                    const lang = this.detectLanguage(ext);
                    if (lang) {
                        languages.add(lang);
                    }
                }
            }
        };
        try {
            await scan(rootPath);
        }
        catch (err) {
            console.error('[WorkspaceDiscoveryService] Scan error:', err);
        }
        return {
            name: path.basename(rootPath),
            rootPath,
            projects,
            languages: Array.from(languages),
            filesCount,
        };
    }
    detectLanguage(ext) {
        const mapping = {
            '.ts': 'TypeScript',
            '.tsx': 'TypeScript',
            '.js': 'JavaScript',
            '.jsx': 'JavaScript',
            '.py': 'Python',
            '.go': 'Go',
            '.rs': 'Rust',
            '.java': 'Java',
            '.cs': 'C#',
            '.cpp': 'C++',
            '.h': 'C++',
        };
        return mapping[ext] || null;
    }
}
exports.WorkspaceDiscoveryService = WorkspaceDiscoveryService;
//# sourceMappingURL=workspace-discovery.js.map