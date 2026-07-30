"use strict";
/**
 * file-operations.ts
 *
 * Safe atomic file system operations supporting AbortSignal cancellation.
 * Implements atomic writes via temporary files and atomic renames.
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
exports.FileOperations = void 0;
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
class FileOperations {
    async readFile(filePath, signal) {
        if (signal?.aborted)
            throw new Error('Operation cancelled by AbortSignal.');
        if (!fs.existsSync(filePath)) {
            throw new Error(`File does not exist: ${filePath}`);
        }
        return fs.readFileSync(filePath, 'utf8');
    }
    async writeFile(filePath, content, signal) {
        if (signal?.aborted)
            throw new Error('Operation cancelled by AbortSignal.');
        const dir = path.dirname(filePath);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        const tmpPath = `${filePath}.tmp.${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
        try {
            fs.writeFileSync(tmpPath, content, 'utf8');
            if (signal?.aborted) {
                if (fs.existsSync(tmpPath))
                    fs.unlinkSync(tmpPath);
                throw new Error('Operation cancelled by AbortSignal.');
            }
            fs.renameSync(tmpPath, filePath);
        }
        catch (err) {
            if (fs.existsSync(tmpPath)) {
                try {
                    fs.unlinkSync(tmpPath);
                }
                catch (_) { }
            }
            throw err;
        }
    }
    async createFile(filePath, content = '', signal) {
        if (signal?.aborted)
            throw new Error('Operation cancelled by AbortSignal.');
        if (fs.existsSync(filePath)) {
            throw new Error(`File already exists: ${filePath}`);
        }
        await this.writeFile(filePath, content, signal);
    }
    async deleteFile(filePath, signal) {
        if (signal?.aborted)
            throw new Error('Operation cancelled by AbortSignal.');
        if (!fs.existsSync(filePath))
            return;
        const stat = fs.statSync(filePath);
        if (stat.isDirectory()) {
            fs.rmSync(filePath, { recursive: true, force: true });
        }
        else {
            fs.unlinkSync(filePath);
        }
    }
    async rename(oldPath, newPath, signal) {
        if (signal?.aborted)
            throw new Error('Operation cancelled by AbortSignal.');
        if (!fs.existsSync(oldPath)) {
            throw new Error(`Path does not exist: ${oldPath}`);
        }
        const targetDir = path.dirname(newPath);
        if (!fs.existsSync(targetDir)) {
            fs.mkdirSync(targetDir, { recursive: true });
        }
        fs.renameSync(oldPath, newPath);
    }
    async mkdir(dirPath, signal) {
        if (signal?.aborted)
            throw new Error('Operation cancelled by AbortSignal.');
        if (!fs.existsSync(dirPath)) {
            fs.mkdirSync(dirPath, { recursive: true });
        }
    }
    async exists(filePath, signal) {
        if (signal?.aborted)
            throw new Error('Operation cancelled by AbortSignal.');
        return fs.existsSync(filePath);
    }
    async list(dirPath, signal) {
        if (signal?.aborted)
            throw new Error('Operation cancelled by AbortSignal.');
        if (!fs.existsSync(dirPath))
            return [];
        return fs.readdirSync(dirPath);
    }
}
exports.FileOperations = FileOperations;
//# sourceMappingURL=file-operations.js.map