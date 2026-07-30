"use strict";
/**
 * adapter-discovery.ts — Phase 20 CLI Adapter SDK & Registry
 *
 * Scans built-in paths, workspace directories, user home folders, and custom paths for CLI adapters.
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
exports.AdapterDiscovery = void 0;
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const os = __importStar(require("os"));
class AdapterDiscovery {
    customSearchPaths = [];
    constructor(customPaths) {
        if (customPaths) {
            this.customSearchPaths = customPaths.map((p) => path.resolve(p));
        }
    }
    addCustomPath(searchPath) {
        this.customSearchPaths.push(path.resolve(searchPath));
    }
    /**
     * Scans all 4 discovery locations for valid adapter directories (containing adapter.json).
     */
    async discoverAdapters(workspaceRoot) {
        const searchLocations = [];
        // 1. Built-in Forge adapters directory
        const builtinDir = path.resolve(__dirname, '../adapters');
        if (fs.existsSync(builtinDir)) {
            searchLocations.push({ dir: builtinDir, source: 'builtin' });
        }
        // 2. Workspace local adapters (.forge/adapters/)
        if (workspaceRoot) {
            const wsAdapters = path.join(workspaceRoot, '.forge', 'adapters');
            if (fs.existsSync(wsAdapters)) {
                searchLocations.push({ dir: wsAdapters, source: 'workspace' });
            }
        }
        // 3. User global adapters (~/.forge/adapters/)
        const userAdapters = path.join(os.homedir(), '.forge', 'adapters');
        if (fs.existsSync(userAdapters)) {
            searchLocations.push({ dir: userAdapters, source: 'user' });
        }
        // 4. Custom user search paths
        for (const customPath of this.customSearchPaths) {
            if (fs.existsSync(customPath)) {
                searchLocations.push({ dir: customPath, source: 'custom' });
            }
        }
        const results = [];
        for (const location of searchLocations) {
            try {
                const entries = fs.readdirSync(location.dir, { withFileTypes: true });
                for (const entry of entries) {
                    if (entry.isDirectory()) {
                        const dirPath = path.join(location.dir, entry.name);
                        const manifestFile = path.join(dirPath, 'adapter.json');
                        if (fs.existsSync(manifestFile)) {
                            results.push({
                                id: entry.name,
                                directoryPath: dirPath,
                                source: location.source,
                            });
                        }
                    }
                }
            }
            catch {
                // Skip unreadable location
            }
        }
        return results;
    }
}
exports.AdapterDiscovery = AdapterDiscovery;
//# sourceMappingURL=adapter-discovery.js.map