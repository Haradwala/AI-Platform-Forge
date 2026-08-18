import * as path from 'path';

export interface FileTargetQuery {
  rawPrompt: string;
  intent: 'open' | 'find' | 'count' | 'list';
  basename?: string;
  relativePath?: string;
  extension?: string;
  language?: string;
  isAllFiles?: boolean;
}

export interface FolderTargetQuery {
  rawPrompt: string;
  isFolderQuery: boolean;
  intent: 'find' | 'count' | 'list';
  inDirectory?: string;
  folderName?: string;
  isAllFolders?: boolean;
}

export class FolderQueryNormalizer {
  /**
   * Normalizes natural language folder queries into a structured FolderTargetQuery.
   * Supports: "find all folders", "list folders", "folders in <dir>", "how many folders", "find folders named <name>".
   */
  static normalize(prompt: string): FolderTargetQuery {
    const rawPrompt = (prompt || '').trim();
    const cleanPrompt = rawPrompt.toLowerCase();

    // Must explicitly mention folder(s) or directory / directories
    const isFolderQuery = /\b(folder|folders|directory|directories)\b/i.test(cleanPrompt);
    if (!isFolderQuery) {
      return { rawPrompt, isFolderQuery: false, intent: 'find' };
    }

    // 1. Determine Intent
    let intent: 'find' | 'count' | 'list' = 'find';
    if (/\b(how many|count|total number of)\b/i.test(cleanPrompt)) {
      intent = 'count';
    } else if (/\b(list|show|display|enumerate)\b/i.test(cleanPrompt)) {
      intent = 'list';
    } else {
      intent = 'find';
    }

    // 2. Extract "named <folderName>" or "called <folderName>"
    let folderName: string | undefined;
    const nameMatch = rawPrompt.match(/\b(?:named|called|with name|name)\s+([a-zA-Z0-9_\-]+)/i);
    if (nameMatch && nameMatch[1]) {
      folderName = nameMatch[1];
    }

    // 3. Extract "in <directory>" or "under <directory>"
    let inDirectory: string | undefined;
    const inMatch = rawPrompt.match(/\b(?:in|under|inside|within)\s+([a-zA-Z0-9_\-\.\/]+)/i);
    if (inMatch && inMatch[1]) {
      const candidate = inMatch[1].trim().replace(/\\/g, '/');
      const lower = candidate.toLowerCase();
      if (
        !lower.includes('project') &&
        !lower.includes('workspace') &&
        !lower.includes('folder') &&
        !lower.includes('directory') &&
        !lower.includes('this')
      ) {
        inDirectory = candidate;
      }
    }

    const isAllFolders = !folderName;

    return {
      rawPrompt,
      isFolderQuery: true,
      intent,
      inDirectory,
      folderName,
      isAllFolders,
    };
  }
}

import { QueryNormalizationEngine, QueryIntent } from './query-normalization-engine';

export class FileQueryNormalizer {
  /**
   * Normalizes natural language prompts into a structured FileTargetQuery.
   * Delegates to QueryNormalizationEngine for canonical intent/domain/target resolution.
   */
  static normalize(prompt: string): FileTargetQuery {
    const rawPrompt = (prompt || '').trim();
    if (!rawPrompt) {
      return { rawPrompt, intent: 'find' };
    }

    const norm = QueryNormalizationEngine.normalize(rawPrompt);
    const cleanPrompt = rawPrompt.toLowerCase();

    // Map QueryIntent to FileTargetQuery intent
    let intent: 'open' | 'find' | 'count' | 'list' = 'find';
    if (norm.intent === 'count') intent = 'count';
    else if (norm.intent === 'list') intent = 'list';
    else if (norm.intent === 'open') intent = 'open';
    else intent = 'find';

    // 1. Check for "all files" query
    if (
      (norm.domain === 'workspace' || !norm.target) &&
      /\b(how many files|count files|total files|files in this project|files present in this project|files in workspace|workspace files)\b/i.test(cleanPrompt) &&
      !cleanPrompt.includes('.json') &&
      !cleanPrompt.includes('.ts') &&
      !cleanPrompt.includes('.tsx') &&
      !cleanPrompt.includes('.js') &&
      !cleanPrompt.includes('.md') &&
      !cleanPrompt.includes('package.json') &&
      !cleanPrompt.includes('typescript') &&
      !cleanPrompt.includes('javascript')
    ) {
      return { rawPrompt, intent, isAllFiles: true };
    }

    // 2. Language target mapping
    if (norm.targetType === 'language') {
      if (norm.target === 'typescript') {
        return { rawPrompt, intent, language: 'typescript', extension: '.ts,.tsx' };
      }
      if (norm.target === 'javascript') {
        return { rawPrompt, intent, language: 'javascript', extension: '.js,.jsx' };
      }
      return { rawPrompt, intent, language: norm.target };
    }

    // 3. Extension target mapping
    if (norm.targetType === 'extension' && norm.target) {
      return { rawPrompt, intent, extension: norm.target };
    }

    // 4. Filename / Path target mapping
    if (norm.targetType === 'path' && norm.target) {
      const normalizedPath = norm.target.replace(/\\/g, '/');
      const basename = path.basename(normalizedPath);
      return { rawPrompt, intent, relativePath: normalizedPath, basename };
    }

    if (norm.targetType === 'filename' && norm.target) {
      const normalizedTarget = norm.target.replace(/\\/g, '/');
      if (normalizedTarget.includes('/')) {
        const basename = path.basename(normalizedTarget);
        return { rawPrompt, intent, relativePath: normalizedTarget, basename };
      }
      return { rawPrompt, intent, basename: normalizedTarget };
    }

    // 5. Check if language mentioned without explicit extension
    if (/\b(typescript|type-script)\b/i.test(cleanPrompt) || (/\b(ts|tsx)\b/i.test(cleanPrompt) && !cleanPrompt.includes('.'))) {
      return { rawPrompt, intent, language: 'typescript', extension: '.ts,.tsx' };
    }
    if (/\b(javascript|js|jsx)\b/i.test(cleanPrompt) && !cleanPrompt.includes('.')) {
      return { rawPrompt, intent, language: 'javascript', extension: '.js,.jsx' };
    }

    if (norm.target && norm.targetValidated && (norm.target.includes('.') || norm.target.includes('/'))) {
      const normalizedTarget = norm.target.replace(/\\/g, '/');
      if (normalizedTarget.includes('/')) {
        const basename = path.basename(normalizedTarget);
        return { rawPrompt, intent, relativePath: normalizedTarget, basename };
      }
      return { rawPrompt, intent, basename: normalizedTarget };
    }

    return { rawPrompt, intent };
  }
}
