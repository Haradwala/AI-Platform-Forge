"use strict";
/**
 * typescript-parser.ts — TypeScript & JavaScript AST Symbol & Relationship Parser
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.TypeScriptParser = void 0;
class TypeScriptParser {
    languageId = 'typescript';
    supportedExtensions = ['.ts', '.tsx', '.js', '.jsx', '.cjs', '.mjs'];
    async parseFile(filePath, content, fileId) {
        const nodes = [];
        const edges = [];
        const lines = content.split('\n');
        const classRegex = /(?:export\s+)?(?:abstract\s+)?class\s+([a-zA-Z0-9_]+)(?:\s+extends\s+([a-zA-Z0-9_]+))?(?:\s+implements\s+([a-zA-Z0-9_,\s]+))?/g;
        const interfaceRegex = /(?:export\s+)?interface\s+([a-zA-Z0-9_]+)(?:\s+extends\s+([a-zA-Z0-9_]+))?/g;
        const fnRegex = /(?:export\s+)?(?:async\s+)?function\s+([a-zA-Z0-9_]+)\s*\(/g;
        const methodRegex = /(?:public|private|protected|async|static)?\s*([a-zA-Z0-9_]+)\s*\([^)]*\)\s*[:{]/g;
        const importRegex = /import\s+.*?\s+from\s+['"]([^'"]+)['"]/g;
        let currentContainer = '';
        lines.forEach((line, idx) => {
            const trimmed = line.trim();
            let match;
            // Import statements
            while ((match = importRegex.exec(line)) !== null) {
                const importPath = match[1];
                edges.push({
                    id: `edge_${fileId}_imp_${idx + 1}`,
                    sourceId: fileId,
                    targetId: importPath,
                    relationship: 'imports',
                });
            }
            // Classes
            while ((match = classRegex.exec(line)) !== null) {
                const className = match[1];
                currentContainer = className;
                const node = {
                    id: `node_${fileId}_cls_${className}`,
                    fileId,
                    filePath,
                    name: className,
                    kind: 'class',
                    startLine: idx + 1,
                    endLine: idx + 1,
                    signature: trimmed,
                };
                nodes.push(node);
                if (match[2]) {
                    edges.push({
                        id: `edge_${fileId}_ext_${className}`,
                        sourceId: node.id,
                        targetId: match[2],
                        relationship: 'extends',
                    });
                }
            }
            // Interfaces
            while ((match = interfaceRegex.exec(line)) !== null) {
                const interfaceName = match[1];
                const node = {
                    id: `node_${fileId}_int_${interfaceName}`,
                    fileId,
                    filePath,
                    name: interfaceName,
                    kind: 'interface',
                    startLine: idx + 1,
                    endLine: idx + 1,
                    signature: trimmed,
                };
                nodes.push(node);
            }
            // Functions
            while ((match = fnRegex.exec(line)) !== null) {
                const fnName = match[1];
                if (!['if', 'for', 'while', 'switch'].includes(fnName)) {
                    nodes.push({
                        id: `node_${fileId}_fn_${fnName}`,
                        fileId,
                        filePath,
                        name: fnName,
                        kind: 'function',
                        containerName: currentContainer || undefined,
                        startLine: idx + 1,
                        endLine: idx + 1,
                        signature: trimmed,
                    });
                }
            }
        });
        return { nodes, edges };
    }
}
exports.TypeScriptParser = TypeScriptParser;
//# sourceMappingURL=typescript-parser.js.map