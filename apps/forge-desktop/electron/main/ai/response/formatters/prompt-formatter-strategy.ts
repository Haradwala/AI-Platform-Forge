/**
 * prompt-formatter-strategy.ts
 *
 * Strategy implementations converting KnowledgeFact domain objects into
 * structured, prioritized PromptSection objects.
 */

import type {
  KnowledgeFact,
  PromptSection,
  WorkspaceStatisticsFact,
  RepositoryFileListFact,
  WorkspaceSearchFact,
  FileContentFact,
  TerminalFact,
  GitDiffFact,
  ErrorTraceFact,
} from '../response-types';
import { ContextCompressor } from '../../context/context-compressor';

export interface IPromptFactFormatter<T extends KnowledgeFact = any> {
  readonly factKind: string;
  format(fact: T, goal?: string): PromptSection;
}

export class WorkspaceStatisticsFormatter implements IPromptFactFormatter<WorkspaceStatisticsFact> {
  readonly factKind = 'workspace_statistics';

  format(fact: WorkspaceStatisticsFact): PromptSection {
    const lines: string[] = [`- Workspace Statistics: ${fact.fileCount} total files in project.`];
    if (fact.languages && fact.languages.length > 0) {
      lines.push(`  Languages: ${fact.languages.join(', ')}`);
    }
    return {
      title: 'Workspace Statistics',
      category: 'grounding',
      priority: 10,
      content: lines.join('\n'),
    };
  }
}

export class FileListFormatter implements IPromptFactFormatter<RepositoryFileListFact> {
  readonly factKind = 'file_list';

  format(fact: RepositoryFileListFact): PromptSection {
    const lines: string[] = [
      `- Workspace File List (${fact.total} files):`,
      `  [${fact.files.slice(0, 100).join(', ')}]`,
    ];
    return {
      title: 'Workspace File List',
      category: 'grounding',
      priority: 20,
      content: lines.join('\n'),
    };
  }
}

export class WorkspaceSearchFormatter implements IPromptFactFormatter<WorkspaceSearchFact> {
  readonly factKind = 'workspace_search';

  format(fact: WorkspaceSearchFact): PromptSection {
    const lines: string[] = [`- Workspace Search (query: "${fact.query}"): Found ${fact.totalMatches} matches.`];
    for (const m of fact.matches.slice(0, 100)) {
      lines.push(`  * ${m.filePath}${m.line ? `:${m.line}` : ''} ${m.text}`);
    }
    return {
      title: 'Workspace Search Results',
      category: 'grounding',
      priority: 30,
      content: lines.join('\n'),
    };
  }
}

export class FileContentFormatter implements IPromptFactFormatter<FileContentFact> {
  readonly factKind = 'file_content';

  constructor(private readonly compressor: ContextCompressor = new ContextCompressor()) {}

  format(fact: FileContentFact, goal: string = ''): PromptSection {
    const compressed = this.compressor.compressFileContent(fact.content, goal, fact.path);
    const lines: string[] = [
      `- File Content (${fact.path}):`,
      `\`\`\`\n${compressed}\n\`\`\``,
    ];
    return {
      title: `File Content: ${fact.path}`,
      category: 'grounding',
      priority: 40,
      content: lines.join('\n'),
    };
  }
}

export class TerminalOutputFormatter implements IPromptFactFormatter<TerminalFact> {
  readonly factKind = 'terminal_output';

  format(fact: TerminalFact): PromptSection {
    const lines: string[] = [`- Command executed: "${fact.command}" (Exit Code: ${fact.exitCode ?? 0})`];
    if (fact.stdout) {
      lines.push(`  Output: ${fact.stdout.slice(0, 1000)}`);
    }
    return {
      title: `Terminal Output: ${fact.command}`,
      category: 'grounding',
      priority: 50,
      content: lines.join('\n'),
    };
  }
}

export class GitDiffFormatter implements IPromptFactFormatter<GitDiffFact> {
  readonly factKind = 'git_diff';

  format(fact: GitDiffFact): PromptSection {
    const lines: string[] = [`- Git Diff:\n\`\`\`diff\n${fact.diff.slice(0, 2000)}\n\`\`\``];
    return {
      title: 'Git Diff',
      category: 'grounding',
      priority: 60,
      content: lines.join('\n'),
    };
  }
}

export class ErrorTraceFormatter implements IPromptFactFormatter<ErrorTraceFact> {
  readonly factKind = 'error_trace';

  format(fact: ErrorTraceFact): PromptSection {
    return {
      title: 'Execution Error',
      category: 'grounding',
      priority: 70,
      content: `- Execution Error Trace: ${fact.error}`,
    };
  }
}
