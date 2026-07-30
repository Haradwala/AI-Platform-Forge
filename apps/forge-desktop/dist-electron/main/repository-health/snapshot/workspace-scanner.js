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
exports.WorkspaceScanner = void 0;
const fs = __importStar(require("fs/promises"));
const path = __importStar(require("path"));
class WorkspaceScanner {
    async scanDirectory(rootPath) {
        const fileList = [];
        await this.walk(rootPath, rootPath, fileList);
        return fileList;
    }
    async walk(currentDir, rootPath, fileList) {
        try {
            const entries = await fs.readdir(currentDir, { withFileTypes: true });
            for (const entry of entries) {
                const fullPath = path.join(currentDir, entry.name);
                const relPath = path.relative(rootPath, fullPath);
                if (entry.isDirectory()) {
                    if (entry.name === 'node_modules' || entry.name === 'dist' || entry.name === '.git' || entry.name === '.forge') {
                        continue;
                    }
                    await this.walk(fullPath, rootPath, fileList);
                }
                else if (entry.isFile()) {
                    if (entry.name.endsWith('.ts') || entry.name.endsWith('.tsx') || entry.name.endsWith('.js') || entry.name.endsWith('.jsx')) {
                        fileList.push(relPath);
                    }
                }
            }
        }
        catch {
            // Ignore unreadable directories
        }
    }
}
exports.WorkspaceScanner = WorkspaceScanner;
//# sourceMappingURL=workspace-scanner.js.map