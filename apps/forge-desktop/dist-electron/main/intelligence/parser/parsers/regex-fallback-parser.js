"use strict";
/**
 * regex-fallback-parser.ts — Multilingual Regex-based Fallback AST Parser
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.RegexFallbackParser = void 0;
class RegexFallbackParser {
    languageId = 'generic_regex';
    supportedExtensions = [];
    async parseFile(filePath, content, fileId) {
        const nodes = [];
        const edges = [];
        const lines = content.split('\n');
        // Function/method regex match across languages
        const fnRegex = /(?:function|def|fn|func|public|private|protected|async)?\s+([a-zA-Z0-9_]+)\s*\(/g;
        // Class/interface regex match
        const classRegex = /(?:class|interface|type|struct|trait|enum)\s+([a-zA-Z0-9_]+)/g;
        lines.forEach((line, idx) => {
            let match;
            // Classes / Structs
            while ((match = classRegex.exec(line)) !== null) {
                const name = match[1];
                if (name && !['if', 'for', 'while', 'switch'].includes(name)) {
                    nodes.push({
                        id: `node_${fileId}_${idx + 1}_${name}`,
                        fileId,
                        filePath,
                        name,
                        kind: 'class',
                        startLine: idx + 1,
                        endLine: idx + 1,
                        signature: line.trim(),
                    });
                }
            }
            // Functions / Methods
            while ((match = fnRegex.exec(line)) !== null) {
                const name = match[1];
                if (name && !['if', 'for', 'while', 'switch', 'catch'].includes(name)) {
                    nodes.push({
                        id: `node_${fileId}_${idx + 1}_${name}`,
                        fileId,
                        filePath,
                        name,
                        kind: 'function',
                        startLine: idx + 1,
                        endLine: idx + 1,
                        signature: line.trim(),
                    });
                }
            }
        });
        return { nodes, edges };
    }
}
exports.RegexFallbackParser = RegexFallbackParser;
//# sourceMappingURL=regex-fallback-parser.js.map