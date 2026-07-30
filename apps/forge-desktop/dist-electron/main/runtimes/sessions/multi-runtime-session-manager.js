"use strict";
/**
 * multi-runtime-session-manager.ts — Persistent Multi-Runtime Conversation & Context Synchronization Engine
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.MultiRuntimeSessionManager = void 0;
const session_store_1 = require("./session-store");
const runtime_profile_registry_1 = require("../profiles/runtime-profile-registry");
class MultiRuntimeSessionManager {
    store;
    profileRegistry;
    constructor(store = new session_store_1.SessionStore(), profileRegistry = new runtime_profile_registry_1.RuntimeProfileRegistry()) {
        this.store = store;
        this.profileRegistry = profileRegistry;
    }
    async createSession(workspaceRoot, initialModelId = 'gpt-4o') {
        await this.store.initialize(workspaceRoot);
        const session = {
            id: `session_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
            workspaceRoot,
            currentModelId: initialModelId,
            messages: [],
            createdAt: Date.now(),
            updatedAt: Date.now(),
        };
        await this.store.saveSession(session);
        return session;
    }
    async switchRuntime(sessionId, newModelId) {
        const session = await this.store.getSession(sessionId);
        if (!session)
            throw new Error(`Session [${sessionId}] not found`);
        session.currentModelId = newModelId;
        session.updatedAt = Date.now();
        // Context synchronization & window boundary check
        const profile = this.profileRegistry.getProfile(newModelId);
        if (profile && profile.contextWindow < 16000 && session.messages.length > 20) {
            // Trim older messages to fit within smaller model context window
            session.messages = session.messages.slice(-10);
        }
        await this.store.saveSession(session);
        return session;
    }
    async addMessage(sessionId, message) {
        const session = await this.store.getSession(sessionId);
        if (!session)
            throw new Error(`Session [${sessionId}] not found`);
        session.messages.push(message);
        session.updatedAt = Date.now();
        await this.store.saveSession(session);
    }
    async getSession(sessionId) {
        return this.store.getSession(sessionId);
    }
    async listSessions(workspaceRoot) {
        await this.store.initialize(workspaceRoot);
        return this.store.listSessions(workspaceRoot);
    }
}
exports.MultiRuntimeSessionManager = MultiRuntimeSessionManager;
//# sourceMappingURL=multi-runtime-session-manager.js.map