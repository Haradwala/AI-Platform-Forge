/**
 * context-compressor.ts
 *
 * Sprint 85 Wave 2 Phase 2 — Intelligent Context Compression
 *
 * Reduces prompt size before LLM generation by extracting only relevant
 * sections (JSON keys, imports, function/class blocks, head/tail summaries).
 */

export class ContextCompressor {
  /**
   * Intelligently compresses file content based on user goal and file path.
   */
  compressFileContent(content: string, goal: string, filePath?: string): string {
    if (!content || !content.trim()) return content;

    const goalLower = (goal || '').toLowerCase();
    const isJson = (filePath && filePath.toLowerCase().endsWith('.json')) || content.trim().startsWith('{');

    // 1. JSON key extraction
    if (isJson) {
      const jsonKeys = [
        'version',
        'name',
        'scripts',
        'dependencies',
        'devDependencies',
        'peerDependencies',
        'main',
        'description',
        'license',
        'author',
        'private',
        'repository',
        'config',
      ];

      for (const key of jsonKeys) {
        if (goalLower.includes(key.toLowerCase())) {
          const extracted = this.extractJsonKey(content, key);
          if (extracted) return extracted;
        }
      }
    }

    // 2. Imports extraction
    if (goalLower.includes('import') || goalLower.includes('imports')) {
      const imports = this.extractImports(content);
      if (imports && imports.trim().length > 0) {
        return imports;
      }
    }

    // 3. Targeted function / class / symbol extraction
    const words = (goal || '').match(/[A-Za-z_$][A-Za-z0-9_$]{2,}/g) || [];
    const stopWords = new Set([
      'explain',
      'show',
      'what',
      'is',
      'the',
      'function',
      'class',
      'method',
      'code',
      'file',
      'from',
      'in',
      'version',
      'imports',
      'import',
      'package',
      'json',
      'typescript',
      'javascript',
      'tsx',
      'jsx',
      'second',
      'first',
      'one',
      'this',
      'that',
      'with',
      'for',
      'about',
      'how',
      'does',
      'work',
    ]);

    for (const word of words) {
      if (stopWords.has(word.toLowerCase())) continue;
      const funcBlock = this.extractFunction(content, word);
      if (funcBlock) {
        return funcBlock;
      }
    }

    // 4. Summarize large content fallback (> 4000 characters)
    if (content.length > 4000) {
      return this.summarizeLargeContent(content);
    }

    return content;
  }

  /**
   * Extracts a specific JSON key/value block.
   */
  extractJsonKey(content: string, key: string): string | null {
    if (!content) return null;

    try {
      const parsed = JSON.parse(content);
      if (parsed && typeof parsed === 'object') {
        const keyLower = key.toLowerCase();
        const matchedKey = Object.keys(parsed).find((k) => k.toLowerCase() === keyLower);

        if (matchedKey && parsed[matchedKey] !== undefined) {
          return JSON.stringify({ [matchedKey]: parsed[matchedKey] }, null, 2);
        }
      }
    } catch {
      // Fall through to regex extraction if JSON parsing fails
    }

    const keyRegex = new RegExp(`("${key}"|'${key}'|\\b${key}\\b)\\s*:\\s*([\\s\\S]*?)(?:,\\n|,\\r\\n|\\n\\s*"|\\n\\s*}|$)`, 'i');
    const match = content.match(keyRegex);
    if (match) {
      return `{\n  "${key}": ${match[2].trim()}\n}`;
    }

    return null;
  }

  /**
   * Extracts import statements from source code.
   */
  extractImports(content: string): string {
    if (!content) return '';
    const lines = content.split(/\r?\n/);
    const importLines: string[] = [];
    let inMultiLineImport = false;

    for (const line of lines) {
      const trimmed = line.trim();
      const isImportStart =
        trimmed.startsWith('import ') ||
        trimmed.startsWith('import type ') ||
        trimmed.startsWith('from ') ||
        (trimmed.startsWith('const ') && trimmed.includes('require(')) ||
        (trimmed.startsWith('let ') && trimmed.includes('require(')) ||
        (trimmed.startsWith('var ') && trimmed.includes('require('));

      if (isImportStart) {
        importLines.push(line);
        if (!line.includes(';') && (line.includes('{') || line.includes('import')) && !line.includes('}')) {
          inMultiLineImport = true;
        }
      } else if (inMultiLineImport) {
        importLines.push(line);
        if (line.includes('}') || line.includes(';')) {
          inMultiLineImport = false;
        }
      }
    }

    return importLines.join('\n');
  }

  /**
   * Extracts a function, method, class, or interface definition by symbol name.
   */
  extractFunction(content: string, name: string): string | null {
    if (!content || !name) return null;

    const escapedName = name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const patterns = [
      new RegExp(`(?:export\\s+)?(?:default\\s+)?(?:async\\s+)?function\\s+${escapedName}\\b`, 'g'),
      new RegExp(`(?:export\\s+)?(?:const|let|var)\\s+${escapedName}\\s*=`, 'g'),
      new RegExp(`(?:export\\s+)?class\\s+${escapedName}\\b`, 'g'),
      new RegExp(`(?:export\\s+)?interface\\s+${escapedName}\\b`, 'g'),
      new RegExp(`(?:export\\s+)?type\\s+${escapedName}\\b`, 'g'),
      new RegExp(`(?:async\\s+)?${escapedName}\\s*\\([^)]*\\)\\s*[:{]`, 'g'),
    ];

    let matchIdx = -1;
    for (const pattern of patterns) {
      const match = pattern.exec(content);
      if (match) {
        matchIdx = match.index;
        break;
      }
    }

    if (matchIdx === -1) return null;

    // Find start of declaration line
    let lineStart = content.lastIndexOf('\n', matchIdx);
    lineStart = lineStart === -1 ? 0 : lineStart + 1;

    // Scan forward to capture block braces
    const openBraceIdx = content.indexOf('{', matchIdx);
    if (openBraceIdx !== -1 && openBraceIdx - matchIdx < 200) {
      let braceCount = 0;
      let endIdx = -1;

      for (let i = openBraceIdx; i < content.length; i++) {
        if (content[i] === '{') braceCount++;
        else if (content[i] === '}') {
          braceCount--;
          if (braceCount === 0) {
            endIdx = i + 1;
            break;
          }
        }
      }

      if (endIdx !== -1) {
        return content.substring(lineStart, endIdx).trim();
      }
    }

    // Fallback if no brace block is found: take lineStart up to next blank line or 30 lines
    const linesAfter = content.substring(lineStart).split(/\r?\n/);
    const blockLines: string[] = [];
    for (const l of linesAfter) {
      blockLines.push(l);
      if (blockLines.length >= 30) break;
    }

    return blockLines.join('\n').trim();
  }

  /**
   * Summarizes large content by keeping the first 40 lines and last 20 lines.
   */
  summarizeLargeContent(content: string): string {
    if (!content) return '';
    if (content.length <= 4000) return content;

    const lines = content.split(/\r?\n/);
    if (lines.length <= 60) return content;

    const head = lines.slice(0, 40).join('\n');
    const tail = lines.slice(-20).join('\n');
    const truncatedCount = lines.length - 60;

    return `${head}\n\n... [${truncatedCount} lines truncated for context efficiency] ...\n\n${tail}`;
  }
}
