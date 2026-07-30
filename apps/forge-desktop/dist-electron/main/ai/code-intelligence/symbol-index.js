"use strict";
/**
 * symbol-index.ts
 *
 * Global symbol table providing O(1) lookup by name for declarations and references.
 * Tracks symbol kinds, file locations, line numbers, and export visibility.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.SymbolIndex = void 0;
class SymbolIndex {
    declarationsByName = new Map();
    declarationsById = new Map();
    referencesBySymbolName = new Map();
    fileToSymbolIds = new Map();
    clear() {
        this.declarationsByName.clear();
        this.declarationsById.clear();
        this.referencesBySymbolName.clear();
        this.fileToSymbolIds.clear();
    }
    addDeclaration(decl) {
        this.declarationsById.set(decl.id, decl);
        const existing = this.declarationsByName.get(decl.name) || [];
        existing.push(decl);
        this.declarationsByName.set(decl.name, existing);
        const fileSyms = this.fileToSymbolIds.get(decl.filePath) || new Set();
        fileSyms.add(decl.id);
        this.fileToSymbolIds.set(decl.filePath, fileSyms);
    }
    addReference(ref) {
        const existing = this.referencesBySymbolName.get(ref.symbolName) || [];
        existing.push(ref);
        this.referencesBySymbolName.set(ref.symbolName, existing);
    }
    findByName(name) {
        return this.declarationsByName.get(name) || [];
    }
    getById(id) {
        return this.declarationsById.get(id) || null;
    }
    getReferences(symbolName) {
        return this.referencesBySymbolName.get(symbolName) || [];
    }
    removeFileSymbols(filePath) {
        const symbolIds = this.fileToSymbolIds.get(filePath);
        if (!symbolIds)
            return;
        for (const id of symbolIds) {
            const decl = this.declarationsById.get(id);
            if (decl) {
                this.declarationsById.delete(id);
                const nameList = this.declarationsByName.get(decl.name) || [];
                const filtered = nameList.filter((d) => d.id !== id);
                if (filtered.length > 0) {
                    this.declarationsByName.set(decl.name, filtered);
                }
                else {
                    this.declarationsByName.delete(decl.name);
                }
            }
        }
        this.fileToSymbolIds.delete(filePath);
        // Filter out references originating from this file
        for (const [name, refs] of this.referencesBySymbolName.entries()) {
            const filtered = refs.filter((r) => r.filePath !== filePath);
            if (filtered.length > 0) {
                this.referencesBySymbolName.set(name, filtered);
            }
            else {
                this.referencesBySymbolName.delete(name);
            }
        }
    }
    getAllDeclarations() {
        return Array.from(this.declarationsById.values());
    }
}
exports.SymbolIndex = SymbolIndex;
//# sourceMappingURL=symbol-index.js.map