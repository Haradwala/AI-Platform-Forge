import * as fs from 'fs/promises';
import * as path from 'path';
import { ASTNodeInfo } from '../contracts/health-types';

export class ASTBuilder {
  async buildASTNodes(rootPath: string, relativePaths: string[]): Promise<Map<string, ASTNodeInfo>> {
    const map = new Map<string, ASTNodeInfo>();

    for (const relPath of relativePaths) {
      const absPath = path.join(rootPath, relPath);
      try {
        const content = await fs.readFile(absPath, 'utf-8');
        const info = this.parseContent(content);
        map.set(relPath, info);
      } catch {
        map.set(relPath, {
          exportedClasses: [],
          exportedInterfaces: [],
          exportedFunctions: [],
          importedModules: [],
          diTokenDeclarations: [],
          ipcChannelRegistrations: [],
          eventBusTopicSubscriptions: [],
          methodCount: 0,
          cyclomaticComplexity: 1,
          maxNestingDepth: 1
        });
      }
    }

    return map;
  }

  private parseContent(content: string): ASTNodeInfo {
    const exportedClasses: string[] = [];
    const exportedInterfaces: string[] = [];
    const exportedFunctions: string[] = [];
    const importedModules: string[] = [];
    const diTokenDeclarations: string[] = [];
    const ipcChannelRegistrations: string[] = [];
    const eventBusTopicSubscriptions: string[] = [];

    // Classes
    const classRegex = /export\s+(?:abstract\s+)?class\s+([A-Za-z0-9_]+)/g;
    let match: RegExpExecArray | null;
    while ((match = classRegex.exec(content)) !== null) {
      exportedClasses.push(match[1]);
    }

    // Interfaces
    const interfaceRegex = /export\s+interface\s+([A-Za-z0-9_]+)/g;
    while ((match = interfaceRegex.exec(content)) !== null) {
      exportedInterfaces.push(match[1]);
    }

    // Functions
    const funcRegex = /export\s+(?:async\s+)?function\s+([A-Za-z0-9_]+)/g;
    while ((match = funcRegex.exec(content)) !== null) {
      exportedFunctions.push(match[1]);
    }

    // Imports
    const importRegex = /import\s+.*?from\s+['"]([^'"]+)['"]/g;
    while ((match = importRegex.exec(content)) !== null) {
      importedModules.push(match[1]);
    }

    // DI Tokens
    const tokenRegex = /Symbol\(['"]([A-Za-z0-9_.]+)['"]\)/g;
    while ((match = tokenRegex.exec(content)) !== null) {
      diTokenDeclarations.push(match[1]);
    }

    // IPC Routes
    const ipcRegex = /['"](workspace:[^'"]+|intelligence:[^'"]+|runtimes:[^'"]+|automation:[^'"]+|repository:[^'"]+|timeline:[^'"]+)['"]/g;
    while ((match = ipcRegex.exec(content)) !== null) {
      ipcChannelRegistrations.push(match[1]);
    }

    // Event topics
    const eventRegex = /['"](agent\.[^'"]+|runtime\.[^'"]+|intelligence\.[^'"]+|automation\.[^'"]+|repository\.[^'"]+)['"]/g;
    while ((match = eventRegex.exec(content)) !== null) {
      eventBusTopicSubscriptions.push(match[1]);
    }

    // Method count heuristic
    const methodMatches = content.match(/(?:public|private|protected|async)\s+[A-Za-z0-9_]+\s*\(/g) || [];
    const methodCount = methodMatches.length;

    // Complexity heuristic (if, for, while, switch, &&, ||)
    const complexityMatches = content.match(/\b(if|for|while|switch|catch)\b|\&\&|\|\|/g) || [];
    const cyclomaticComplexity = 1 + complexityMatches.length;

    // Nesting depth heuristic
    let currentDepth = 0;
    let maxNestingDepth = 0;
    for (let i = 0; i < content.length; i++) {
      if (content[i] === '{') {
        currentDepth++;
        if (currentDepth > maxNestingDepth) maxNestingDepth = currentDepth;
      } else if (content[i] === '}') {
        if (currentDepth > 0) currentDepth--;
      }
    }

    return {
      exportedClasses,
      exportedInterfaces,
      exportedFunctions,
      importedModules,
      diTokenDeclarations,
      ipcChannelRegistrations,
      eventBusTopicSubscriptions,
      methodCount,
      cyclomaticComplexity,
      maxNestingDepth
    };
  }
}
