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
    readonly results: Array<{
        filePath: string;
        line?: number;
        text?: string;
    }>;
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
export declare class StructuredConversationStateBuilder {
    static build(sessionId: string, entities: IEntityStore, conversation: IConversationDomain, selectionContext?: SelectionContext | null): IStructuredConversationState;
}
