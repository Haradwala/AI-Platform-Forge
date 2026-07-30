import { ISymbol } from './repository-types';

export class SymbolIndexService {
  private readonly symbols = new Map<string, ISymbol>();

  addSymbols(fileSymbols: ISymbol[]): void {
    for (const sym of fileSymbols) {
      this.symbols.set(sym.id, sym);
    }
    this.resolveParentChildRelations();
  }

  removeSymbolsForFile(filePath: string): void {
    for (const [id, sym] of this.symbols.entries()) {
      if (sym.file === filePath) {
        this.symbols.delete(id);
      }
    }
  }

  getSymbol(id: string): ISymbol | undefined {
    return this.symbols.get(id);
  }

  getAll(): ISymbol[] {
    return Array.from(this.symbols.values());
  }

  clear(): void {
    this.symbols.clear();
  }

  private resolveParentChildRelations(): void {
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
