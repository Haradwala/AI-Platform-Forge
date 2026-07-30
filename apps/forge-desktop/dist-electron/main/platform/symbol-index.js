"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SymbolIndexService = void 0;
class SymbolIndexService {
    symbols = new Map();
    addSymbols(fileSymbols) {
        for (const sym of fileSymbols) {
            this.symbols.set(sym.id, sym);
        }
        this.resolveParentChildRelations();
    }
    removeSymbolsForFile(filePath) {
        for (const [id, sym] of this.symbols.entries()) {
            if (sym.file === filePath) {
                this.symbols.delete(id);
            }
        }
    }
    getSymbol(id) {
        return this.symbols.get(id);
    }
    getAll() {
        return Array.from(this.symbols.values());
    }
    clear() {
        this.symbols.clear();
    }
    resolveParentChildRelations() {
        for (const sym of this.symbols.values()) {
            sym.children = [];
        }
        for (const sym of this.symbols.values()) {
            if (sym.parent) {
                const parentSym = Array.from(this.symbols.values()).find((p) => p.name === sym.parent && p.file === sym.file);
                if (parentSym) {
                    parentSym.children.push(sym.id);
                }
            }
        }
    }
}
exports.SymbolIndexService = SymbolIndexService;
//# sourceMappingURL=symbol-index.js.map