/**
 * session-context-manager.ts
 *
 * Session Context & Manager — manages session lifecycle (create, retrieve, persist).
 * Provides the ISessionServices abstraction for decoupled consumption by pipeline stages.
 */

import { ExecutionDomain, type IExecutionDomain } from '../memory/domains/execution-domain';
import { ConversationDomain, type IConversationDomain } from '../memory/domains/conversation-domain';
import { EntityStore, type IEntityStore } from '../memory/store/entity-store';
import { StructuredConversationStateBuilder, type IStructuredConversationState } from './structured-conversation-state';

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

export class SessionContext implements ISessionServices {
  readonly sessionId: string;
  readonly workspaceRoot: string;
  readonly execution: IExecutionDomain;
  readonly conversation: IConversationDomain;
  readonly entities: IEntityStore;
  selectionContext: SelectionContext | null = null;

  constructor(sessionId: string, workspaceRoot: string) {
    this.sessionId = sessionId;
    this.workspaceRoot = workspaceRoot;
    this.execution = new ExecutionDomain();
    this.conversation = new ConversationDomain();
    this.entities = new EntityStore();
  }

  setSelectionContext(context: SelectionContext | null): void {
    this.selectionContext = context;
  }

  getState(): IStructuredConversationState {
    return StructuredConversationStateBuilder.build(this.sessionId, this.entities, this.conversation, this.selectionContext);
  }
}

export interface ISessionContextManager {
  getActiveSession(): ISessionServices;
  getOrCreateSession(sessionId?: string, workspaceRoot?: string): ISessionServices;
  clearSession(sessionId?: string): void;
}

export class SessionContextManager implements ISessionContextManager {
  private activeSession: ISessionServices | null = null;
  private readonly sessions = new Map<string, ISessionServices>();

  getActiveSession(): ISessionServices {
    if (!this.activeSession) {
      this.activeSession = this.getOrCreateSession('default_session', process.cwd());
    }
    return this.activeSession;
  }

  getOrCreateSession(sessionId: string = 'default_session', workspaceRoot: string = process.cwd()): ISessionServices {
    if (this.sessions.has(sessionId)) {
      const existing = this.sessions.get(sessionId)!;
      this.activeSession = existing;
      return existing;
    }

    const session = new SessionContext(sessionId, workspaceRoot);
    this.sessions.set(sessionId, session);
    this.activeSession = session;
    return session;
  }

  clearSession(sessionId?: string): void {
    const targetId = sessionId || this.activeSession?.sessionId;
    if (targetId && this.sessions.has(targetId)) {
      const session = this.sessions.get(targetId)!;
      session.execution.clear();
      session.conversation.clear();
      this.sessions.delete(targetId);
    }
    if (this.activeSession?.sessionId === targetId) {
      this.activeSession = null;
    }
  }
}
