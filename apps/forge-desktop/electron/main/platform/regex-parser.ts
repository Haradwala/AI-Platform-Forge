import * as path from 'path';
import { ILanguageParser, IUnifiedCodeModel, ISymbol } from './repository-types';

export class RegexParser implements ILanguageParser {
  readonly id = 'RegexParser';
  readonly language = 'Generic';

  supports(filePath: string): boolean {
    const ext = path.extname(filePath).toLowerCase();
    return ['.ts', '.tsx', '.js', '.jsx', '.py', '.go', '.rs', '.java', '.cs', '.cpp', '.h'].includes(ext);
  }

  parse(filePath: string, content: string): IUnifiedCodeModel {
    const ext = path.extname(filePath).toLowerCase();
    const symbols: ISymbol[] = [];
    const imports: string[] = [];
    const exports: string[] = [];
    const references: string[] = [];
    const diagnostics: string[] = [];

    const lines = content.split('\n');

    // Helper to add symbol
    const addSymbol = (
      name: string,
      kind: ISymbol['kind'],
      lineIdx: number,
      parent?: string
    ) => {
      const id = `${filePath}:${lineIdx}:${name}`;
      symbols.push({
        id,
        name,
        kind,
        file: filePath,
        line: lineIdx + 1,
        column: 1,
        children: [],
        parent,
        language: this.detectLanguageByExt(ext),
      });
    };

    lines.forEach((lineText, idx) => {
      const cleanLine = lineText.trim();
      if (cleanLine.startsWith('//') || cleanLine.startsWith('#') || cleanLine.startsWith('/*')) {
        return;
      }

      // TypeScript / JavaScript
      if (['.ts', '.tsx', '.js', '.jsx'].includes(ext)) {
        // Imports
        const importMatch = cleanLine.match(/import\s+.*\s+from\s+['"]([^'"]+)['"]/);
        if (importMatch) {
          imports.push(importMatch[1]);
        }

        // Exports
        if (cleanLine.startsWith('export ')) {
          const exportNameMatch = cleanLine.match(/export\s+(?:default\s+)?(?:class|function|interface|const|let|var)\s+([A-Za-z0-9_$]+)/);
          if (exportNameMatch) {
            exports.push(exportNameMatch[1]);
          }
        }

        // Classes
        const classMatch = cleanLine.match(/class\s+([A-Za-z0-9_$]+)/);
        if (classMatch) {
          addSymbol(classMatch[1], 'class', idx);
        }

        // Interfaces
        const interfaceMatch = cleanLine.match(/interface\s+([A-Za-z0-9_$]+)/);
        if (interfaceMatch) {
          addSymbol(interfaceMatch[1], 'interface', idx);
        }

        // Functions
        const funcMatch = cleanLine.match(/function\s+([A-Za-z0-9_$]+)/);
        if (funcMatch) {
          addSymbol(funcMatch[1], 'function', idx);
        }
      }

      // Python
      if (ext === '.py') {
        // Imports
        const importMatch = cleanLine.match(/^import\s+([A-Za-z0-9_., ]+)/) || cleanLine.match(/^from\s+([A-Za-z0-9_.]+)\s+import/);
        if (importMatch) {
          imports.push(importMatch[1].trim());
        }

        // Classes
        const classMatch = cleanLine.match(/class\s+([A-Za-z0-9_]+)/);
        if (classMatch) {
          addSymbol(classMatch[1], 'class', idx);
        }

        // Functions
        const funcMatch = cleanLine.match(/def\s+([A-Za-z0-9_]+)/);
        if (funcMatch) {
          addSymbol(funcMatch[1], 'function', idx);
        }
      }

      // Go
      if (ext === '.go') {
        // Imports
        const importMatch = cleanLine.match(/import\s+['"]([^'"]+)['"]/);
        if (importMatch) {
          imports.push(importMatch[1]);
        }

        // Structs
        const structMatch = cleanLine.match(/type\s+([A-Za-z0-9_]+)\s+struct/);
        if (structMatch) {
          addSymbol(structMatch[1], 'struct', idx);
        }

        // Interfaces
        const interfaceMatch = cleanLine.match(/type\s+([A-Za-z0-9_]+)\s+interface/);
        if (interfaceMatch) {
          addSymbol(interfaceMatch[1], 'interface', idx);
        }

        // Functions
        const funcMatch = cleanLine.match(/func\s+([A-Za-z0-9_]+)/) || cleanLine.match(/func\s*\([^)]*\)\s*([A-Za-z0-9_]+)/);
        if (funcMatch) {
          addSymbol(funcMatch[1], 'function', idx);
        }
      }

      // Rust
      if (ext === '.rs') {
        // Imports
        const useMatch = cleanLine.match(/use\s+([^;]+);/);
        if (useMatch) {
          imports.push(useMatch[1].trim());
        }

        // Structs
        const structMatch = cleanLine.match(/struct\s+([A-Za-z0-9_]+)/);
        if (structMatch) {
          addSymbol(structMatch[1], 'struct', idx);
        }

        // Traits
        const traitMatch = cleanLine.match(/trait\s+([A-Za-z0-9_]+)/);
        if (traitMatch) {
          addSymbol(traitMatch[1], 'trait', idx);
        }

        // Functions
        const funcMatch = cleanLine.match(/fn\s+([A-Za-z0-9_]+)/);
        if (funcMatch) {
          addSymbol(funcMatch[1], 'function', idx);
        }
      }

      // Java, C#, C++
      if (['.java', '.cs', '.cpp', '.h'].includes(ext)) {
        // Classes
        const classMatch = cleanLine.match(/class\s+([A-Za-z0-9_]+)/);
        if (classMatch) {
          addSymbol(classMatch[1], 'class', idx);
        }

        // Interfaces
        const interfaceMatch = cleanLine.match(/interface\s+([A-Za-z0-9_]+)/);
        if (interfaceMatch) {
          addSymbol(interfaceMatch[1], 'interface', idx);
        }

        // Methods
        const methodMatch = cleanLine.match(/(?:public|private|protected|internal|static|\s)+[A-Za-z0-9_<>@]+\s+([A-Za-z0-9_]+)\s*\([^)]*\)/);
        if (methodMatch && !['if', 'for', 'while', 'switch', 'catch', 'return'].includes(methodMatch[1])) {
          addSymbol(methodMatch[1], 'method', idx);
        }
      }
    });

    // Populate references using word tokens
    const words = content.match(/[A-Za-z0-9_$]+/g) || [];
    words.forEach((w) => {
      if (symbols.some((s) => s.name === w)) {
        if (!references.includes(w)) {
          references.push(w);
        }
      }
    });

    return {
      symbols,
      imports,
      exports,
      references,
      diagnostics,
      metadata: { ext },
    };
  }

  private detectLanguageByExt(ext: string): string {
    const mapping: Record<string, string> = {
      '.ts': 'TypeScript',
      '.tsx': 'TypeScript',
      '.js': 'JavaScript',
      '.jsx': 'JavaScript',
      '.py': 'Python',
      '.go': 'Go',
      '.rs': 'Rust',
      '.java': 'Java',
      '.cs': 'C#',
      '.cpp': 'C++',
      '.h': 'C++',
    };
    return mapping[ext] || 'Unknown';
  }
}
