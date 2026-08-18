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
exports.FileQueryNormalizer = exports.FolderQueryNormalizer = void 0;
const path = __importStar(require("path"));
class FolderQueryNormalizer {
    /**
     * Normalizes natural language folder queries into a structured FolderTargetQuery.
     * Supports: "find all folders", "list folders", "folders in <dir>", "how many folders", "find folders named <name>".
     */
    static normalize(prompt) {
        const rawPrompt = (prompt || '').trim();
        const cleanPrompt = rawPrompt.toLowerCase();
        // Must explicitly mention folder(s) or directory / directories
        const isFolderQuery = /\b(folder|folders|directory|directories)\b/i.test(cleanPrompt);
        if (!isFolderQuery) {
            return { rawPrompt, isFolderQuery: false, intent: 'find' };
        }
        // 1. Determine Intent
        let intent = 'find';
        if (/\b(how many|count|total number of)\b/i.test(cleanPrompt)) {
            intent = 'count';
        }
        else if (/\b(list|show|display|enumerate)\b/i.test(cleanPrompt)) {
            intent = 'list';
        }
        else {
            intent = 'find';
        }
        // 2. Extract "named <folderName>" or "called <folderName>"
        let folderName;
        const nameMatch = rawPrompt.match(/\b(?:named|called|with name|name)\s+([a-zA-Z0-9_\-]+)/i);
        if (nameMatch && nameMatch[1]) {
            folderName = nameMatch[1];
        }
        // 3. Extract "in <directory>" or "under <directory>"
        let inDirectory;
        const inMatch = rawPrompt.match(/\b(?:in|under|inside|within)\s+([a-zA-Z0-9_\-\.\/]+)/i);
        if (inMatch && inMatch[1]) {
            const candidate = inMatch[1].trim().replace(/\\/g, '/');
            const lower = candidate.toLowerCase();
            if (!lower.includes('project') &&
                !lower.includes('workspace') &&
                !lower.includes('folder') &&
                !lower.includes('directory') &&
                !lower.includes('this')) {
                inDirectory = candidate;
            }
        }
        const isAllFolders = !folderName;
        return {
            rawPrompt,
            isFolderQuery: true,
            intent,
            inDirectory,
            folderName,
            isAllFolders,
        };
    }
}
exports.FolderQueryNormalizer = FolderQueryNormalizer;
const query_normalization_engine_1 = require("./query-normalization-engine");
class FileQueryNormalizer {
    /**
     * Normalizes natural language prompts into a structured FileTargetQuery.
     * Delegates to QueryNormalizationEngine for canonical intent/domain/target resolution.
     */
    static normalize(prompt) {
        const rawPrompt = (prompt || '').trim();
        if (!rawPrompt) {
            return { rawPrompt, intent: 'find' };
        }
        const norm = query_normalization_engine_1.QueryNormalizationEngine.normalize(rawPrompt);
        const cleanPrompt = rawPrompt.toLowerCase();
        // Map QueryIntent to FileTargetQuery intent
        let intent = 'find';
        if (norm.intent === 'count')
            intent = 'count';
        else if (norm.intent === 'list')
            intent = 'list';
        else if (norm.intent === 'open')
            intent = 'open';
        else
            intent = 'find';
        // 1. Check for "all files" query
        if ((norm.domain === 'workspace' || !norm.target) &&
            /\b(how many files|count files|total files|files in this project|files present in this project|files in workspace|workspace files)\b/i.test(cleanPrompt) &&
            !cleanPrompt.includes('.json') &&
            !cleanPrompt.includes('.ts') &&
            !cleanPrompt.includes('.tsx') &&
            !cleanPrompt.includes('.js') &&
            !cleanPrompt.includes('.md') &&
            !cleanPrompt.includes('package.json') &&
            !cleanPrompt.includes('typescript') &&
            !cleanPrompt.includes('javascript')) {
            return { rawPrompt, intent, isAllFiles: true };
        }
        // 2. Language target mapping
        if (norm.targetType === 'language') {
            if (norm.target === 'typescript') {
                return { rawPrompt, intent, language: 'typescript', extension: '.ts,.tsx' };
            }
            if (norm.target === 'javascript') {
                return { rawPrompt, intent, language: 'javascript', extension: '.js,.jsx' };
            }
            return { rawPrompt, intent, language: norm.target };
        }
        // 3. Extension target mapping
        if (norm.targetType === 'extension' && norm.target) {
            return { rawPrompt, intent, extension: norm.target };
        }
        // 4. Filename / Path target mapping
        if (norm.targetType === 'path' && norm.target) {
            const normalizedPath = norm.target.replace(/\\/g, '/');
            const basename = path.basename(normalizedPath);
            return { rawPrompt, intent, relativePath: normalizedPath, basename };
        }
        if (norm.targetType === 'filename' && norm.target) {
            const normalizedTarget = norm.target.replace(/\\/g, '/');
            if (normalizedTarget.includes('/')) {
                const basename = path.basename(normalizedTarget);
                return { rawPrompt, intent, relativePath: normalizedTarget, basename };
            }
            return { rawPrompt, intent, basename: normalizedTarget };
        }
        // 5. Check if language mentioned without explicit extension
        if (/\b(typescript|type-script)\b/i.test(cleanPrompt) || (/\b(ts|tsx)\b/i.test(cleanPrompt) && !cleanPrompt.includes('.'))) {
            return { rawPrompt, intent, language: 'typescript', extension: '.ts,.tsx' };
        }
        if (/\b(javascript|js|jsx)\b/i.test(cleanPrompt) && !cleanPrompt.includes('.')) {
            return { rawPrompt, intent, language: 'javascript', extension: '.js,.jsx' };
        }
        if (norm.target && norm.targetValidated && (norm.target.includes('.') || norm.target.includes('/'))) {
            const normalizedTarget = norm.target.replace(/\\/g, '/');
            if (normalizedTarget.includes('/')) {
                const basename = path.basename(normalizedTarget);
                return { rawPrompt, intent, relativePath: normalizedTarget, basename };
            }
            return { rawPrompt, intent, basename: normalizedTarget };
        }
        return { rawPrompt, intent };
    }
}
exports.FileQueryNormalizer = FileQueryNormalizer;
//# sourceMappingURL=file-query-normalizer.js.map