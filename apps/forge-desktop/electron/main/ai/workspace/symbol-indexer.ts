/**
 * symbol-indexer.ts
 *
 * Sprint 86 Phase 1 — Workspace Symbol Index
 *
 * Builds and maintains a persistent in-memory index of all TypeScript/JavaScript
 * symbols across a workspace. Supports fast semantic queries:
 *
 *   findSymbol('ResponseGenerationEngine')        → symbol definitions
 *   findReferences('ResponseGenerationEngine')    → all usage sites
 *   findImports('@forge/shared')                  → all imports of a module
 *   listExports('response-generation-engine.ts')  → all exports from a file
 *
 * Uses regex-based extraction with TypeScript-safe patterns. No AST dependency.
 */

import * as fs from 'fs';
import * as path from 'path';

// ─── Public Types ──────────────────────────────────────────────────────────────

export type SymbolKind = 'function' | 'class' | 'interface' | 'type' | 'const' | 'enum' | 'import';

export interface WorkspaceSymbol {
  readonly name: string;
  readonly kind: SymbolKind;
  readonly filePath: string;
  readonly line: number;
  readonly column: number;
  readonly exported: boolean;
}

export interface ImportReference {
  readonly moduleName: string;
  readonly importedName?: string;
  readonly filePath: string;
  readonly line: number;
}

export interface ExportReference {
  readonly name: string;
  readonly filePath: string;
  readonly line: number;
}

// ─── Ignored Directories ──────────────────────────────────────────────────────

const IGNORED_DIRS = new Set([
  'node_modules',
  'dist',
  'build',
  '.git',
  '.turbo',
  '.next',
  'coverage',
  'dist-electron',
  '.cache',
  'out',
]);

const SUPPORTED_EXTENSIONS = new Set(['.ts', '.tsx', '.js', '.jsx']);

// ─── Regex Patterns ───────────────────────────────────────────────────────────

// export [async] function name(
const RE_FUNCTION = /^(?:export\s+(?:default\s+)?)?(?:export\s+)?(async\s+)?function\s+([A-Za-z_$][A-Za-z0-9_$]*)\s*[(<]/gm;

// export class name
const RE_CLASS = /^(?:export\s+(?:abstract\s+)?)?(?:export\s+)?(abstract\s+)?class\s+([A-Za-z_$][A-Za-z0-9_$]*)\s*[{<(]/gm;

// export interface name
const RE_INTERFACE = /^(?:export\s+)?interface\s+([A-Za-z_$][A-Za-z0-9_$]*)\s*[{<]/gm;

// export type name =
const RE_TYPE = /^(?:export\s+)?type\s+([A-Za-z_$][A-Za-z0-9_$]*)\s*[<=]/gm;

// export enum name
const RE_ENUM = /^(?:export\s+)?(?:const\s+)?enum\s+([A-Za-z_$][A-Za-z0-9_$]*)\s*\{/gm;

// export const/let/var name
const RE_EXPORT_CONST = /^export\s+(?:const|let|var)\s+([A-Za-z_$][A-Za-z0-9_$]*)\s*[=:]/gm;

// import { name, name } from 'module'  or  import name from 'module'  or  import * as name from 'module'
const RE_IMPORT = /^import\s+(?:type\s+)?(?:(?:\{([^}]*)\}|(\*\s+as\s+[A-Za-z_$][A-Za-z0-9_$]*)|([A-Za-z_$][A-Za-z0-9_$]*)(?:\s*,\s*\{([^}]*)\})?))\s+from\s+['"]([^'"]+)['"]/gm;
const RE_IMPORT_SIDE_EFFECT = /^import\s+['"]([^'"]+)['"]/gm;

// export { name, name }  or  export * from 'module'  or  re-exports
const RE_NAMED_EXPORT = /^export\s+\{([^}]+)\}/gm;
const RE_REEXPORT = /^export\s+(?:\*|\{[^}]*\})\s+from\s+['"]([^'"]+)['"]/gm;

// ─── Helper: determine line/col from index ────────────────────────────────────

function getLineCol(content: string, index: number): { line: number; column: number } {
  const before = content.slice(0, index);
  const lines = before.split('\n');
  const line = lines.length;
  const column = (lines[lines.length - 1] ?? '').length + 1;
  return { line, column };
}

// ─── Per-file extraction ──────────────────────────────────────────────────────

interface FileIndex {
  symbols: WorkspaceSymbol[];
  imports: ImportReference[];
  exports: ExportReference[];
}

function indexFile(filePath: string, content: string): FileIndex {
  const symbols: WorkspaceSymbol[] = [];
  const imports: ImportReference[] = [];
  const exports: ExportReference[] = [];

  // ── Functions ──
  let m: RegExpExecArray | null;
  const fnRe = new RegExp(RE_FUNCTION.source, 'gm');
  while ((m = fnRe.exec(content)) !== null) {
    const name = m[2];
    if (!name) continue;
    const { line, column } = getLineCol(content, m.index);
    const exported = m[0].includes('export');
    symbols.push({ name, kind: 'function', filePath, line, column, exported });
  }

  // ── Classes ──
  const classRe = new RegExp(RE_CLASS.source, 'gm');
  while ((m = classRe.exec(content)) !== null) {
    const name = m[2];
    if (!name) continue;
    const { line, column } = getLineCol(content, m.index);
    const exported = m[0].includes('export');
    symbols.push({ name, kind: 'class', filePath, line, column, exported });
  }

  // ── Interfaces ──
  const ifaceRe = new RegExp(RE_INTERFACE.source, 'gm');
  while ((m = ifaceRe.exec(content)) !== null) {
    const name = m[1];
    if (!name) continue;
    const { line, column } = getLineCol(content, m.index);
    const exported = m[0].includes('export');
    symbols.push({ name, kind: 'interface', filePath, line, column, exported });
  }

  // ── Type aliases ──
  const typeRe = new RegExp(RE_TYPE.source, 'gm');
  while ((m = typeRe.exec(content)) !== null) {
    const name = m[1];
    if (!name) continue;
    const { line, column } = getLineCol(content, m.index);
    const exported = m[0].includes('export');
    symbols.push({ name, kind: 'type', filePath, line, column, exported });
  }

  // ── Enums ──
  const enumRe = new RegExp(RE_ENUM.source, 'gm');
  while ((m = enumRe.exec(content)) !== null) {
    const name = m[1];
    if (!name) continue;
    const { line, column } = getLineCol(content, m.index);
    const exported = m[0].includes('export');
    symbols.push({ name, kind: 'enum', filePath, line, column, exported });
  }

  // ── Exported consts ──
  const constRe = new RegExp(RE_EXPORT_CONST.source, 'gm');
  while ((m = constRe.exec(content)) !== null) {
    const name = m[1];
    if (!name) continue;
    const { line, column } = getLineCol(content, m.index);
    symbols.push({ name, kind: 'const', filePath, line, column, exported: true });
  }

  // ── Imports ──
  const impRe = new RegExp(RE_IMPORT.source, 'gm');
  while ((m = impRe.exec(content)) !== null) {
    const named = m[1];
    const star = m[2];
    const defaultImp = m[3];
    const named2 = m[4];
    const moduleName = m[5];
    if (!moduleName) continue;

    const { line } = getLineCol(content, m.index);

    if (named || named2) {
      const combined = [(named || ''), (named2 || '')].join(',');
      for (const raw of combined.split(',')) {
        const trimmed = raw.trim().replace(/\s+as\s+\S+/, '').trim();
        if (trimmed) {
          imports.push({ moduleName, importedName: trimmed, filePath, line });
          symbols.push({ name: trimmed, kind: 'import', filePath, line, column: 1, exported: false });
        }
      }
    }
    if (star) {
      const alias = star.replace('* as ', '').trim();
      imports.push({ moduleName, importedName: alias, filePath, line });
    }
    if (defaultImp) {
      imports.push({ moduleName, importedName: defaultImp, filePath, line });
    }
    if (!named && !named2 && !star && !defaultImp) {
      imports.push({ moduleName, filePath, line });
    }
  }

  // Side-effect imports (import 'module')
  const sideRe = new RegExp(RE_IMPORT_SIDE_EFFECT.source, 'gm');
  while ((m = sideRe.exec(content)) !== null) {
    const moduleName = m[1];
    if (!moduleName) continue;
    const { line } = getLineCol(content, m.index);
    imports.push({ moduleName, filePath, line });
  }

  // ── Named exports: export { X, Y } ──
  const namedExportRe = new RegExp(RE_NAMED_EXPORT.source, 'gm');
  while ((m = namedExportRe.exec(content)) !== null) {
    const names = m[1];
    if (!names) continue;
    const { line } = getLineCol(content, m.index);
    for (const raw of names.split(',')) {
      const name = raw.trim().replace(/\s+as\s+\S+/, '').trim();
      if (name) exports.push({ name, filePath, line });
    }
  }

  // Collect all exported symbol names into exports too
  for (const sym of symbols) {
    if (sym.exported && sym.kind !== 'import') {
      if (!exports.some((e) => e.name === sym.name && e.filePath === filePath)) {
        exports.push({ name: sym.name, filePath, line: sym.line });
      }
    }
  }

  return { symbols, imports, exports };
}

// ─── File scanner ─────────────────────────────────────────────────────────────

function collectFiles(dir: string, results: string[] = []): string[] {
  let entries: string[];
  try {
    entries = fs.readdirSync(dir);
  } catch {
    return results;
  }

  for (const entry of entries) {
    const full = path.join(dir, entry);
    let stat: fs.Stats;
    try {
      stat = fs.statSync(full);
    } catch {
      continue;
    }

    if (stat.isDirectory()) {
      if (!IGNORED_DIRS.has(entry)) {
        collectFiles(full, results);
      }
    } else {
      const ext = path.extname(entry).toLowerCase();
      if (SUPPORTED_EXTENSIONS.has(ext)) {
        results.push(full);
      }
    }
  }

  return results;
}

// ─── WorkspaceSymbolIndexer ───────────────────────────────────────────────────

export class WorkspaceSymbolIndexer {
  // Symbol index: name → list of symbols
  private symbolIndex = new Map<string, WorkspaceSymbol[]>();

  // Import index: moduleName → list of references
  private importIndex = new Map<string, ImportReference[]>();

  // Export index: filePath → list of exports
  private exportIndex = new Map<string, ExportReference[]>();

  // Per-file cache for incremental updates
  private fileCache = new Map<string, FileIndex>();

  /** Rebuild the entire index from the given workspace root. */
  async rebuildIndex(workspaceRoot: string): Promise<void> {
    const startMs = Date.now();

    this.symbolIndex.clear();
    this.importIndex.clear();
    this.exportIndex.clear();
    this.fileCache.clear();

    const files = collectFiles(workspaceRoot);
    let fileCount = 0;
    let symbolCount = 0;

    for (const filePath of files) {
      try {
        const content = fs.readFileSync(filePath, 'utf8');
        const fileIdx = indexFile(filePath, content);
        this._mergeFileIndex(filePath, fileIdx);
        symbolCount += fileIdx.symbols.length;
        fileCount++;
      } catch {
        // Skip files that can't be read
      }
    }

    const durationMs = Date.now() - startMs;
    console.log(`[SymbolIndexer] Indexed ${fileCount} files, ${symbolCount} symbols in ${durationMs}ms`);
  }

  /** Incrementally update the index for a single file. */
  async updateFile(filePath: string): Promise<void> {
    // Remove stale data for this file
    this._removeFileIndex(filePath);

    try {
      const content = fs.readFileSync(filePath, 'utf8');
      const fileIdx = indexFile(filePath, content);
      this._mergeFileIndex(filePath, fileIdx);
    } catch {
      // File may have been deleted — removal above handles it
    }
  }

  // ── Public Queries ──────────────────────────────────────────────────────────

  /**
   * Find all symbol definitions matching the given name (exact match).
   */
  findSymbol(name: string): WorkspaceSymbol[] {
    return this.symbolIndex.get(name) ?? [];
  }

  /**
   * Find all usage sites of a symbol (includes definitions and import references).
   */
  findReferences(name: string): WorkspaceSymbol[] {
    const results: WorkspaceSymbol[] = [];
    // Include symbol definitions
    results.push(...(this.symbolIndex.get(name) ?? []));
    // Include import references that match the name
    for (const refs of this.importIndex.values()) {
      for (const ref of refs) {
        if (ref.importedName === name) {
          results.push({
            name: ref.importedName!,
            kind: 'import',
            filePath: ref.filePath,
            line: ref.line,
            column: 1,
            exported: false,
          });
        }
      }
    }
    // Deduplicate by (filePath, line)
    const seen = new Set<string>();
    return results.filter((r) => {
      const key = `${r.filePath}:${r.line}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }

  /**
   * Find all import statements that import from the given module name.
   * Matches exact module name or suffix (e.g., '@forge/shared' matches '@forge/shared').
   */
  findImports(moduleName: string): ImportReference[] {
    const results: ImportReference[] = [];
    for (const [key, refs] of this.importIndex.entries()) {
      if (key === moduleName || key.endsWith(`/${moduleName}`) || key.includes(moduleName)) {
        results.push(...refs);
      }
    }
    return results;
  }

  /**
   * List all exported symbols from a given file path (basename or full path).
   */
  listExports(filePath: string): ExportReference[] {
    // Try exact match first
    const exact = this.exportIndex.get(filePath);
    if (exact) return exact;

    // Try by basename match
    const basename = path.basename(filePath);
    for (const [key, exports] of this.exportIndex.entries()) {
      if (path.basename(key) === basename || key.endsWith(filePath.replace(/\\/g, '/'))) {
        return exports;
      }
    }
    return [];
  }

  /** Return a snapshot of index stats. */
  getStats(): { fileCount: number; symbolCount: number; importCount: number } {
    let symbolCount = 0;
    for (const list of this.symbolIndex.values()) {
      symbolCount += list.length;
    }
    let importCount = 0;
    for (const list of this.importIndex.values()) {
      importCount += list.length;
    }
    return { fileCount: this.fileCache.size, symbolCount, importCount };
  }

  // ── Private Helpers ─────────────────────────────────────────────────────────

  private _mergeFileIndex(filePath: string, fileIdx: FileIndex): void {
    this.fileCache.set(filePath, fileIdx);

    for (const sym of fileIdx.symbols) {
      const existing = this.symbolIndex.get(sym.name) ?? [];
      existing.push(sym);
      this.symbolIndex.set(sym.name, existing);
    }

    for (const imp of fileIdx.imports) {
      const existing = this.importIndex.get(imp.moduleName) ?? [];
      existing.push(imp);
      this.importIndex.set(imp.moduleName, existing);
    }

    this.exportIndex.set(filePath, fileIdx.exports);
  }

  private _removeFileIndex(filePath: string): void {
    const cached = this.fileCache.get(filePath);
    if (!cached) return;

    // Remove symbols
    for (const sym of cached.symbols) {
      const existing = this.symbolIndex.get(sym.name);
      if (existing) {
        const filtered = existing.filter((s) => s.filePath !== filePath);
        if (filtered.length === 0) {
          this.symbolIndex.delete(sym.name);
        } else {
          this.symbolIndex.set(sym.name, filtered);
        }
      }
    }

    // Remove imports
    for (const imp of cached.imports) {
      const existing = this.importIndex.get(imp.moduleName);
      if (existing) {
        const filtered = existing.filter((i) => i.filePath !== filePath);
        if (filtered.length === 0) {
          this.importIndex.delete(imp.moduleName);
        } else {
          this.importIndex.set(imp.moduleName, filtered);
        }
      }
    }

    this.exportIndex.delete(filePath);
    this.fileCache.delete(filePath);
  }
}
