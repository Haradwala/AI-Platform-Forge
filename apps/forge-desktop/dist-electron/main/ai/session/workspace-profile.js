"use strict";
/**
 * workspace-profile.ts — Phase 25-28 Workspace Profile Manager
 *
 * Manages .forge/workspace.json to persist workspace stack, feature tags,
 * preferred/fallback runtimes, and analysis recommendations.
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
exports.WorkspaceProfileManager = void 0;
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
class WorkspaceProfileManager {
    getProfilePath(workspaceRoot) {
        const forgeDir = path.join(workspaceRoot, '.forge');
        if (!fs.existsSync(forgeDir)) {
            fs.mkdirSync(forgeDir, { recursive: true });
        }
        return path.join(forgeDir, 'workspace.json');
    }
    /**
     * Reads or initializes the workspace profile.
     */
    getProfile(workspaceRoot) {
        const filePath = this.getProfilePath(workspaceRoot);
        if (fs.existsSync(filePath)) {
            try {
                const raw = fs.readFileSync(filePath, 'utf-8');
                return JSON.parse(raw);
            }
            catch (err) {
                console.error('[WorkspaceProfileManager] Error parsing workspace.json:', err);
            }
        }
        // Default profile template
        const defaultProfile = {
            language: 'typescript',
            framework: 'react',
            packageManager: 'pnpm',
            projectType: 'desktop',
            preferredRuntime: 'claude',
            fallbackRuntime: 'ollama',
            features: ['electron', 'vite', 'react', 'typescript'],
            analysis: {
                lastIndexed: new Date().toISOString(),
                healthScore: 95,
                runtimeRecommendations: [
                    { category: 'best_overall', runtimeId: 'claude', reason: 'Highest coding & tool performance' },
                    { category: 'best_local', runtimeId: 'ollama', reason: 'Zero latency offline inference' },
                    { category: 'fastest', runtimeId: 'groq', reason: 'Sub-100ms response streaming' },
                ],
            },
        };
        this.saveProfile(workspaceRoot, defaultProfile);
        return defaultProfile;
    }
    /**
     * Saves or updates the workspace profile.
     */
    saveProfile(workspaceRoot, profile) {
        try {
            const filePath = this.getProfilePath(workspaceRoot);
            fs.writeFileSync(filePath, JSON.stringify(profile, null, 2), 'utf-8');
        }
        catch (err) {
            console.error('[WorkspaceProfileManager] Error saving workspace.json:', err.message);
        }
    }
}
exports.WorkspaceProfileManager = WorkspaceProfileManager;
//# sourceMappingURL=workspace-profile.js.map