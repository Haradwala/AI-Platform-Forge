"use strict";
/**
 * session-context-manager.ts
 *
 * Session Context & Manager — manages session lifecycle (create, retrieve, persist).
 * Provides the ISessionServices abstraction for decoupled consumption by pipeline stages.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.SessionContextManager = exports.SessionContext = void 0;
const execution_domain_1 = require("../memory/domains/execution-domain");
const conversation_domain_1 = require("../memory/domains/conversation-domain");
const entity_store_1 = require("../memory/store/entity-store");
const structured_conversation_state_1 = require("./structured-conversation-state");
class SessionContext {
    sessionId;
    workspaceRoot;
    execution;
    conversation;
    entities;
    selectionContext = null;
    constructor(sessionId, workspaceRoot) {
        this.sessionId = sessionId;
        this.workspaceRoot = workspaceRoot;
        this.execution = new execution_domain_1.ExecutionDomain();
        this.conversation = new conversation_domain_1.ConversationDomain();
        this.entities = new entity_store_1.EntityStore();
    }
    setSelectionContext(context) {
        this.selectionContext = context;
    }
    getState() {
        return structured_conversation_state_1.StructuredConversationStateBuilder.build(this.sessionId, this.entities, this.conversation, this.selectionContext);
    }
}
exports.SessionContext = SessionContext;
class SessionContextManager {
    activeSession = null;
    sessions = new Map();
    getActiveSession() {
        if (!this.activeSession) {
            this.activeSession = this.getOrCreateSession('default_session', process.cwd());
        }
        return this.activeSession;
    }
    getOrCreateSession(sessionId = 'default_session', workspaceRoot = process.cwd()) {
        if (this.sessions.has(sessionId)) {
            const existing = this.sessions.get(sessionId);
            this.activeSession = existing;
            return existing;
        }
        const session = new SessionContext(sessionId, workspaceRoot);
        this.sessions.set(sessionId, session);
        this.activeSession = session;
        return session;
    }
    clearSession(sessionId) {
        const targetId = sessionId || this.activeSession?.sessionId;
        if (targetId && this.sessions.has(targetId)) {
            const session = this.sessions.get(targetId);
            session.execution.clear();
            session.conversation.clear();
            this.sessions.delete(targetId);
        }
        if (this.activeSession?.sessionId === targetId) {
            this.activeSession = null;
        }
    }
}
exports.SessionContextManager = SessionContextManager;
//# sourceMappingURL=session-context-manager.js.map