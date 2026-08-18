/**
 * structured-conversation-state.ts
 *
 * Explicit Structured Conversation State — Single source of truth for planning
 * and follow-up actions across multi-turn sessions.
 */

import { ExecutionResultKind } from '../contracts/execution-result-kind';
import type { ExtractedEntity } from '../memory/extraction/execution-entity-extractor';
import type { IEntityStore } from '../memory/store/entity-store';
import type { IConversationDomain } from '../memory/domains/conversation-domain';

import type { SelectionContext } from './session-context-manager';

export interface ActiveDocumentState {
  readonly filePath: string;
  readonly contentSnippet?: string;
}

export interface LastSearchResultState {
  readonly query: string;
  readonly results: Array<{ filePath: string; line?: number; text?: string }>;
}

export interface LastTerminalOutputState {
  readonly command: string;
  readonly stdout: string;
}

export interface IStructuredConversationState {
  readonly sessionId: string;
  readonly turnCount: number;
  readonly activeDocument: ActiveDocumentState | null;
  readonly lastSearchResult: LastSearchResultState | null;
  readonly lastTerminalOutput: LastTerminalOutputState | null;
  readonly selectionContext: SelectionContext | null;
  readonly activeEntities: {
    readonly workspaceStats?: ExtractedEntity;
    readonly fileList?: ExtractedEntity;
    readonly fileContent?: ExtractedEntity;
    readonly searchResults?: ExtractedEntity;
    readonly terminalOutput?: ExtractedEntity;
    readonly errorTrace?: ExtractedEntity;
  };
  readonly lastActionKind: ExecutionResultKind | null;
}

export class StructuredConversationStateBuilder {
  static build(
    sessionId: string,
    entities: IEntityStore,
    conversation: IConversationDomain,
    selectionContext: SelectionContext | null = null
  ): IStructuredConversationState {
    const messages = conversation.getMessages();
    const turnCount = messages.length;

    const workspaceStats = entities.getLatest(ExecutionResultKind.WORKSPACE_STATS);
    const fileList = entities.getLatest(ExecutionResultKind.FILE_LIST);
    const fileContent = entities.getLatest(ExecutionResultKind.FILE_CONTENT);
    const searchResults = entities.getLatest(ExecutionResultKind.SEARCH_RESULTS);
    const terminalOutput = entities.getLatest(ExecutionResultKind.TERMINAL_OUTPUT);
    const errorTrace = entities.getLatest(ExecutionResultKind.ERROR_TRACE);

    let activeDocument: ActiveDocumentState | null = null;
    if (fileContent) {
      const path = (fileContent as any).key && (fileContent as any).key !== 'file'
        ? (fileContent as any).key
        : (fileContent.value as any)?.filePath;
      if (path && typeof path === 'string' && !path.includes('\n') && !path.startsWith('{')) {
        activeDocument = { filePath: path };
      }
    }

    let lastSearchResult: LastSearchResultState | null = null;
    if (searchResults) {
      const items = Array.isArray(searchResults.value) ? searchResults.value : [];
      lastSearchResult = {
        query: searchResults.key || '',
        results: items.map((it: any) => (typeof it === 'string' ? { filePath: it } : { filePath: it.filePath || it.file || '', line: it.line, text: it.text })),
      };
    }

    let lastTerminalOutput: LastTerminalOutputState | null = null;
    if (terminalOutput) {
      lastTerminalOutput = {
        command: terminalOutput.key || 'terminal',
        stdout: typeof terminalOutput.value === 'string' ? terminalOutput.value : JSON.stringify(terminalOutput.value),
      };
    }

    const allEntities = entities.getAll();
    const lastEntity = allEntities.length > 0 ? allEntities[allEntities.length - 1] : null;
    const lastActionKind = lastEntity ? lastEntity.kind : null;

    return {
      sessionId,
      turnCount,
      activeDocument,
      lastSearchResult,
      lastTerminalOutput,
      selectionContext,
      activeEntities: {
        workspaceStats,
        fileList,
        fileContent,
        searchResults,
        terminalOutput,
        errorTrace,
      },
      lastActionKind,
    };
  }
}
