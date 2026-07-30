/**
 * repository-indexer.ts
 *
 * Incremental AST / regex indexer for workspace files.
 * Indexes files, folders, symbols, imports, exports, classes, and functions.
 */

export interface IndexedSymbol {
  name: string;
  kind: 'class' | 'function' | 'import' | 'export' | 'variable';
  filePath: string;
  line: number;
}

export interface IndexedFile {
  path: string;
  folder: string;
  imports: string[];
  exports: string[];
  symbols: IndexedSymbol[];
  mtime: number;
}

export class RepositoryIndexer {
  private readonly files = new Map<string, IndexedFile>();

  clear(): void {
    this.files.clear();
  }

  async indexWorkspace(
    files: Array<{ path: string; content: string; mtime?: number }>,
    signal?: AbortSignal
  ): Promise<void> {
    for (const f of files) {
      if (signal?.aborted) break;
      this.updateFile(f.path, f.content, f.mtime);
    }
  }

  updateFile(filePath: string, content: string, mtime = Date.now()): void {
    const folder = filePath.includes('/')
      ? filePath.substring(0, filePath.lastIndexOf('/'))
      : '';

    const imports: string[] = [];
    const exports: string[] = [];
    const symbols: IndexedSymbol[] = [];

    const lines = content.split('\n');
    for (let idx = 0; idx < lines.length; idx++) {
      const line = lines[idx];
      const lineNo = idx + 1;

      // 1. Imports
      const importMatch = line.match(/import\s+(?:(?:{[^}]+})|(?:\*\s+as\s+\w+)|(?:\w+))\s+from\s+['"]([^'"]+)['"]/);
      if (importMatch) {
        imports.push(importMatch[1]);
        symbols.push({ name: importMatch[1], kind: 'import', filePath, line: lineNo });
      }

      // 2. Exports
      const exportMatch = line.match(/export\s+(?:default\s+)?(?:class|function|const|let|var|type|interface)\s+(\w+)/);
      if (exportMatch) {
        exports.push(exportMatch[1]);
        symbols.push({ name: exportMatch[1], kind: 'export', filePath, line: lineNo });
      }

      // 3. Classes
      const classMatch = line.match(/(?:export\s+)?class\s+(\w+)/);
      if (classMatch) {
        symbols.push({ name: classMatch[1], kind: 'class', filePath, line: lineNo });
      }

      // 4. Functions / Methods
      const funcMatch = line.match(/(?:export\s+)?(?:async\s+)?function\s+(\w+)/);
      if (funcMatch) {
        symbols.push({ name: funcMatch[1], kind: 'function', filePath, line: lineNo });
      }
    }

    this.files.set(filePath, {
      path: filePath,
      folder,
      imports,
      exports,
      symbols,
      mtime,
    });
  }

  removeFile(filePath: string): void {
    this.files.delete(filePath);
  }

  getFile(filePath: string): IndexedFile | null {
    return this.files.get(filePath) || null;
  }

  getAllFiles(): IndexedFile[] {
    return Array.from(this.files.values());
  }

  getImports(filePath: string): string[] {
    return this.files.get(filePath)?.imports || [];
  }

  searchSymbols(query: string): IndexedSymbol[] {
    if (!query) return [];
    const lower = query.toLowerCase();
    const results: IndexedSymbol[] = [];

    for (const file of this.files.values()) {
      for (const sym of file.symbols) {
        if (sym.name.toLowerCase().includes(lower)) {
          results.push(sym);
        }
      }
    }
    return results;
  }
}
