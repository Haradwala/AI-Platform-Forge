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
exports.DependencyBuilder = void 0;
const path = __importStar(require("path"));
class DependencyBuilder {
    buildDependencyGraph(rootPath, astNodes) {
        const dependencyGraph = new Map();
        const reverseDependencyGraph = new Map();
        for (const fileKey of astNodes.keys()) {
            dependencyGraph.set(fileKey, new Set());
            reverseDependencyGraph.set(fileKey, new Set());
        }
        for (const [sourceFile, ast] of astNodes.entries()) {
            const sourceDir = path.dirname(sourceFile);
            for (const importPath of ast.importedModules) {
                if (importPath.startsWith('.')) {
                    let resolved = path.normalize(path.join(sourceDir, importPath));
                    // Try resolving extensions
                    let targetKey = null;
                    if (astNodes.has(resolved)) {
                        targetKey = resolved;
                    }
                    else if (astNodes.has(resolved + '.ts')) {
                        targetKey = resolved + '.ts';
                    }
                    else if (astNodes.has(resolved + '.tsx')) {
                        targetKey = resolved + '.tsx';
                    }
                    else if (astNodes.has(path.join(resolved, 'index.ts'))) {
                        targetKey = path.join(resolved, 'index.ts');
                    }
                    if (targetKey && targetKey !== sourceFile) {
                        dependencyGraph.get(sourceFile)?.add(targetKey);
                        if (!reverseDependencyGraph.has(targetKey)) {
                            reverseDependencyGraph.set(targetKey, new Set());
                        }
                        reverseDependencyGraph.get(targetKey)?.add(sourceFile);
                    }
                }
            }
        }
        return { dependencyGraph, reverseDependencyGraph };
    }
}
exports.DependencyBuilder = DependencyBuilder;
//# sourceMappingURL=dependency-builder.js.map