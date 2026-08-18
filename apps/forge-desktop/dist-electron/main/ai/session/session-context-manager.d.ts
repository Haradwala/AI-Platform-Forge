/**
 * session-context-manager.ts
 *
 * Session Context & Manager — manages session lifecycle (create, retrieve, persist).
 * Provides the ISessionServices abstraction for decoupled consumption by pipeline stages.
 */
import { type IExecutionDomain } from '../memory/domains/execution-domain';
import { type IConversationDomain } from '../memory/domains/conversation-domain';
import { type IEntityStore } from '../memory/store/entity-store';
import { type IStructuredConversationState } from './structured-conversation-state';
export interface SelectionContext {
    activeCollection: 'search_results' | 'file_list';
    items: string[];
    selectedIndex: number;
    selectedItem: string;
}
export interface ISessionServices {
    readonly sessionId: string;
    readonly workspaceRoot: string;
    readonly execution: IExecutionDomain;
    readonly conversation: IConversationDomain;
    readonly entities: IEntityStore;
    selectionContext: SelectionContext | null;
    setSelectionContext(context: SelectionContext | null): void;
    getState(): IStructuredConversationState;
}
export declare class SessionContext implements ISessionServices {
    readonly sessionId: string;
    readonly workspaceRoot: string;
    readonly execution: IExecutionDomain;
    readonly conversation: IConversationDomain;
    readonly entities: IEntityStore;
    selectionContext: SelectionContext | null;
    constructor(sessionId: string, workspaceRoot: string);
    setSelectionContext(context: SelectionContext | null): void;
    getState(): IStructuredConversationState;
}
export interface ISessionContextManager {
    getActiveSession(): ISessionServices;
    getOrCreateSession(sessionId?: string, workspaceRoot?: string): ISessionServices;
    clearSession(sessionId?: string): void;
}
export declare class SessionContextManager implements ISessionContextManager {
    private activeSession;
    private readonly sessions;
    getActiveSession(): ISessionServices;
    getOrCreateSession(sessionId?: string, workspaceRoot?: string): ISessionServices;
    clearSession(sessionId?: string): void;
}
