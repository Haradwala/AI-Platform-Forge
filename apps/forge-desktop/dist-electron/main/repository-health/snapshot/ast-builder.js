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
exports.ASTBuilder = void 0;
const fs = __importStar(require("fs/promises"));
const path = __importStar(require("path"));
class ASTBuilder {
    async buildASTNodes(rootPath, relativePaths) {
        const map = new Map();
        for (const relPath of relativePaths) {
            const absPath = path.join(rootPath, relPath);
            try {
                const content = await fs.readFile(absPath, 'utf-8');
                const info = this.parseContent(content);
                map.set(relPath, info);
            }
            catch {
                map.set(relPath, {
                    exportedClasses: [],
                    exportedInterfaces: [],
                    exportedFunctions: [],
                    importedModules: [],
                    diTokenDeclarations: [],
                    ipcChannelRegistrations: [],
                    eventBusTopicSubscriptions: [],
                    methodCount: 0,
                    cyclomaticComplexity: 1,
                    maxNestingDepth: 1
                });
            }
        }
        return map;
    }
    parseContent(content) {
        const exportedClasses = [];
        const exportedInterfaces = [];
        const exportedFunctions = [];
        const importedModules = [];
        const diTokenDeclarations = [];
        const ipcChannelRegistrations = [];
        const eventBusTopicSubscriptions = [];
        // Classes
        const classRegex = /export\s+(?:abstract\s+)?class\s+([A-Za-z0-9_]+)/g;
        let match;
        while ((match = classRegex.exec(content)) !== null) {
            exportedClasses.push(match[1]);
        }
        // Interfaces
        const interfaceRegex = /export\s+interface\s+([A-Za-z0-9_]+)/g;
        while ((match = interfaceRegex.exec(content)) !== null) {
            exportedInterfaces.push(match[1]);
        }
        // Functions
        const funcRegex = /export\s+(?:async\s+)?function\s+([A-Za-z0-9_]+)/g;
        while ((match = funcRegex.exec(content)) !== null) {
            exportedFunctions.push(match[1]);
        }
        // Imports
        const importRegex = /import\s+.*?from\s+['"]([^'"]+)['"]/g;
        while ((match = importRegex.exec(content)) !== null) {
            importedModules.push(match[1]);
        }
        // DI Tokens
        const tokenRegex = /Symbol\(['"]([A-Za-z0-9_.]+)['"]\)/g;
        while ((match = tokenRegex.exec(content)) !== null) {
            diTokenDeclarations.push(match[1]);
        }
        // IPC Routes
        const ipcRegex = /['"](workspace:[^'"]+|intelligence:[^'"]+|runtimes:[^'"]+|automation:[^'"]+|repository:[^'"]+|timeline:[^'"]+)['"]/g;
        while ((match = ipcRegex.exec(content)) !== null) {
            ipcChannelRegistrations.push(match[1]);
        }
        // Event topics
        const eventRegex = /['"](agent\.[^'"]+|runtime\.[^'"]+|intelligence\.[^'"]+|automation\.[^'"]+|repository\.[^'"]+)['"]/g;
        while ((match = eventRegex.exec(content)) !== null) {
            eventBusTopicSubscriptions.push(match[1]);
        }
        // Method count heuristic
        const methodMatches = content.match(/(?:public|private|protected|async)\s+[A-Za-z0-9_]+\s*\(/g) || [];
        const methodCount = methodMatches.length;
        // Complexity heuristic (if, for, while, switch, &&, ||)
        const complexityMatches = content.match(/\b(if|for|while|switch|catch)\b|\&\&|\|\|/g) || [];
        const cyclomaticComplexity = 1 + complexityMatches.length;
        // Nesting depth heuristic
        let currentDepth = 0;
        let maxNestingDepth = 0;
        for (let i = 0; i < content.length; i++) {
            if (content[i] === '{') {
                currentDepth++;
                if (currentDepth > maxNestingDepth)
                    maxNestingDepth = currentDepth;
            }
            else if (content[i] === '}') {
                if (currentDepth > 0)
                    currentDepth--;
            }
        }
        return {
            exportedClasses,
            exportedInterfaces,
            exportedFunctions,
            importedModules,
            diTokenDeclarations,
            ipcChannelRegistrations,
            eventBusTopicSubscriptions,
            methodCount,
            cyclomaticComplexity,
            maxNestingDepth
        };
    }
}
exports.ASTBuilder = ASTBuilder;
//# sourceMappingURL=ast-builder.js.map