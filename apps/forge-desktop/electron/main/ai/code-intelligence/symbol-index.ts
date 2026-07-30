/**
 * symbol-index.ts
 *
 * Global symbol table providing O(1) lookup by name for declarations and references.
 * Tracks symbol kinds, file locations, line numbers, and export visibility.
 */

export type SymbolKind =
  | 'class'
  | 'interface'
  | 'enum'
  | 'function'
  | 'method'
  | 'variable'
  | 'jsx_component';

export interface SymbolDeclaration {
  id: string;
  name: string;
  kind: SymbolKind;
  filePath: string;
  line: number;
  isExported: boolean;
  details?: Record<string, any>;
}

export interface SymbolReference {
  symbolId: string;
  symbolName: string;
  filePath: string;
  line: number;
}

export class SymbolIndex {
  private readonly declarationsByName = new Map<string, SymbolDeclaration[]>();
  private readonly declarationsById = new Map<string, SymbolDeclaration>();
  private readonly referencesBySymbolName = new Map<string, SymbolReference[]>();
  private readonly fileToSymbolIds = new Map<string, Set<string>>();

  clear(): void {
    this.declarationsByName.clear();
    this.declarationsById.clear();
    this.referencesBySymbolName.clear();
    this.fileToSymbolIds.clear();
  }

  addDeclaration(decl: SymbolDeclaration): void {
    this.declarationsById.set(decl.id, decl);

    const existing = this.declarationsByName.get(decl.name) || [];
    existing.push(decl);
    this.declarationsByName.set(decl.name, existing);

    const fileSyms = this.fileToSymbolIds.get(decl.filePath) || new Set();
    fileSyms.add(decl.id);
    this.fileToSymbolIds.set(decl.filePath, fileSyms);
  }

  addReference(ref: SymbolReference): void {
    const existing = this.referencesBySymbolName.get(ref.symbolName) || [];
    existing.push(ref);
    this.referencesBySymbolName.set(ref.symbolName, existing);
  }

  findByName(name: string): SymbolDeclaration[] {
    return this.declarationsByName.get(name) || [];
  }

  getById(id: string): SymbolDeclaration | null {
    return this.declarationsById.get(id) || null;
  }

  getReferences(symbolName: string): SymbolReference[] {
    return this.referencesBySymbolName.get(symbolName) || [];
  }

  removeFileSymbols(filePath: string): void {
    const symbolIds = this.fileToSymbolIds.get(filePath);
    if (!symbolIds) return;

    for (const id of symbolIds) {
      const decl = this.declarationsById.get(id);
      if (decl) {
        this.declarationsById.delete(id);
        const nameList = this.declarationsByName.get(decl.name) || [];
        const filtered = nameList.filter((d) => d.id !== id);
        if (filtered.length > 0) {
          this.declarationsByName.set(decl.name, filtered);
        } else {
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
      } else {
        this.referencesBySymbolName.delete(name);
      }
    }
  }

  getAllDeclarations(): SymbolDeclaration[] {
    return Array.from(this.declarationsById.values());
  }
}
