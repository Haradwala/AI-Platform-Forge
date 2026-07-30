"use strict";
/**
 * automation-artifact-store.ts — Step artifact persistence & exchange store
 *
 * Stores reports, diff patches, coverage XMLs, test outputs, and screenshots in `.forge/artifacts/<executionId>/`.
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
exports.AutomationArtifactStore = void 0;
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
class AutomationArtifactStore {
    /**
     * Saves an artifact file to the workspace artifact directory.
     */
    async saveArtifact(workspaceRoot, executionId, stepId, name, content) {
        const dir = path.join(workspaceRoot, '.forge', 'artifacts', executionId);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        const safeName = name.replace(/[^a-zA-Z0-9._-]/g, '_');
        const filePath = path.join(dir, safeName);
        fs.writeFileSync(filePath, content);
        const stat = fs.statSync(filePath);
        const artifact = {
            id: `art_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
            executionId,
            stepId,
            name,
            path: filePath,
            sizeBytes: stat.size,
            createdAt: Date.now(),
        };
        return artifact;
    }
    /**
     * Reads the string content of an artifact.
     */
    async readArtifact(filePath) {
        if (!fs.existsSync(filePath)) {
            throw new Error(`Artifact file not found: ${filePath}`);
        }
        return fs.readFileSync(filePath, 'utf-8');
    }
    /**
     * Lists all artifacts for a pipeline execution.
     */
    async listArtifacts(workspaceRoot, executionId) {
        const dir = path.join(workspaceRoot, '.forge', 'artifacts', executionId);
        if (!fs.existsSync(dir)) {
            return [];
        }
        const files = fs.readdirSync(dir);
        return files.map((file) => {
            const filePath = path.join(dir, file);
            const stat = fs.statSync(filePath);
            return {
                id: `art_${file}`,
                executionId,
                stepId: 'unknown',
                name: file,
                path: filePath,
                sizeBytes: stat.size,
                createdAt: stat.birthtimeMs,
            };
        });
    }
}
exports.AutomationArtifactStore = AutomationArtifactStore;
//# sourceMappingURL=automation-artifact-store.js.map