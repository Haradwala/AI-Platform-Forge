"use strict";
/**
 * action-diff-generator.ts
 *
 * Sprint 86 Phase 5 — Action Diff Generator
 *
 * Generates unified diff previews (FileDiffPreview[]) for proposed WorkspaceEdits
 * without mutating disk files.
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
exports.ActionDiffGenerator = void 0;
const fs = __importStar(require("fs"));
class ActionDiffGenerator {
    /**
     * Generate diff previews for all edits grouped by file.
     */
    generate(edit) {
        const fileGroups = new Map();
        for (const e of edit.edits) {
            const list = fileGroups.get(e.filePath) || [];
            list.push(e);
            fileGroups.set(e.filePath, list);
        }
        const previews = [];
        for (const [filePath, edits] of fileGroups.entries()) {
            let oldContent = '';
            try {
                if (fs.existsSync(filePath)) {
                    oldContent = fs.readFileSync(filePath, 'utf8');
                }
            }
            catch {
                oldContent = '';
            }
            const hunks = this.createHunks(oldContent, edits);
            previews.push({ filePath, hunks });
        }
        return previews;
    }
    createHunks(oldContent, edits) {
        const oldLines = oldContent.split(/\r?\n/);
        const hunks = [];
        // Sort edits by startLine
        const sortedEdits = [...edits].sort((a, b) => a.startLine - b.startLine);
        for (const edit of sortedEdits) {
            const startIdx = Math.max(0, edit.startLine - 1);
            const endIdx = Math.min(oldLines.length, edit.endLine);
            const oldSnippet = oldLines.slice(startIdx, endIdx).join('\n');
            const diffLines = [];
            oldLines.slice(startIdx, endIdx).forEach((line) => {
                diffLines.push(`- ${line}`);
            });
            edit.newText.split(/\r?\n/).forEach((line) => {
                diffLines.push(`+ ${line}`);
            });
            hunks.push({
                oldStart: edit.startLine,
                oldLines: endIdx - startIdx,
                newStart: edit.startLine,
                newLines: edit.newText.split(/\r?\n/).length,
                content: diffLines.join('\n'),
            });
        }
        return hunks;
    }
}
exports.ActionDiffGenerator = ActionDiffGenerator;
//# sourceMappingURL=action-diff-generator.js.map