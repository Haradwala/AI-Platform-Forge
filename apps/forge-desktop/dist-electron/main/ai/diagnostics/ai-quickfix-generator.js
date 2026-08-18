"use strict";
/**
 * ai-quickfix-generator.ts
 *
 * Sprint 86 Phase 6 — AI Quick Fix Generator
 *
 * Generates rule-based or AI-assisted quick fix suggestions for code diagnostics.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.AiQuickFixGenerator = void 0;
class AiQuickFixGenerator {
    /**
     * Generate quick fix suggestions for a diagnostic item.
     */
    async generateFix(diagnostic) {
        const suggestions = [];
        // Rule 1: Cannot find name / missing symbol reference fix
        if (diagnostic.message.includes('Cannot find name') ||
            diagnostic.message.includes('is not defined')) {
            const match = diagnostic.message.match(/['"]([^'"]+)['"]/);
            const missingSymbol = match ? match[1] : '';
            if (missingSymbol) {
                const fixEdit = {
                    id: `fix_import_${Date.now()}`,
                    description: `Add missing import for '${missingSymbol}'`,
                    edits: [
                        {
                            filePath: diagnostic.filePath,
                            startLine: 1,
                            startColumn: 1,
                            endLine: 1,
                            endColumn: 1,
                            newText: `import { ${missingSymbol} } from './${missingSymbol}';\n`,
                        },
                    ],
                    createdAt: new Date().toISOString(),
                };
                suggestions.push({
                    id: `fix_${diagnostic.id}_1`,
                    diagnosticId: diagnostic.id,
                    title: `Add import for ${missingSymbol}`,
                    description: `Automatically inject import statement for ${missingSymbol}`,
                    edit: fixEdit,
                    confidence: 0.9,
                    source: 'rule-based',
                    isPreferred: true,
                });
            }
        }
        // Rule 2: Unused variable or import
        if (diagnostic.message.includes('is declared but its value is never read') ||
            diagnostic.message.includes('Unused variable')) {
            const fixEdit = {
                id: `fix_unused_${Date.now()}`,
                description: `Remove unused item on line ${diagnostic.line}`,
                edits: [
                    {
                        filePath: diagnostic.filePath,
                        startLine: diagnostic.line,
                        startColumn: 1,
                        endLine: diagnostic.line + 1,
                        endColumn: 1,
                        newText: '',
                    },
                ],
                createdAt: new Date().toISOString(),
            };
            suggestions.push({
                id: `fix_${diagnostic.id}_2`,
                diagnosticId: diagnostic.id,
                title: `Remove unused code line`,
                description: `Deletes unused line at line ${diagnostic.line}`,
                edit: fixEdit,
                confidence: 0.85,
                source: 'rule-based',
                isPreferred: true,
            });
        }
        // Fallback: Generic AI fix suggestion
        if (suggestions.length === 0) {
            const fixEdit = {
                id: `fix_generic_${Date.now()}`,
                description: `AI fix for: ${diagnostic.message}`,
                edits: [
                    {
                        filePath: diagnostic.filePath,
                        startLine: diagnostic.line,
                        startColumn: diagnostic.column,
                        endLine: diagnostic.endLine ?? diagnostic.line,
                        endColumn: diagnostic.endColumn ?? diagnostic.column + 10,
                        newText: `/* TODO: Fix ${diagnostic.message} */`,
                    },
                ],
                createdAt: new Date().toISOString(),
            };
            suggestions.push({
                id: `fix_${diagnostic.id}_gen`,
                diagnosticId: diagnostic.id,
                title: `AI Quick Fix: ${diagnostic.message.slice(0, 40)}...`,
                description: `Generate fix for ${diagnostic.message}`,
                edit: fixEdit,
                confidence: 0.75,
                source: 'ai',
                isPreferred: false,
            });
        }
        return suggestions;
    }
}
exports.AiQuickFixGenerator = AiQuickFixGenerator;
//# sourceMappingURL=ai-quickfix-generator.js.map