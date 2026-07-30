"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConversationManager = void 0;
class ConversationManager {
    messages = new Map();
    states = new Map();
    addMessage(sessionId, message) {
        if (!this.messages.has(sessionId)) {
            this.messages.set(sessionId, []);
        }
        this.messages.get(sessionId).push(message);
    }
    getMessages(sessionId) {
        return this.messages.get(sessionId) || [];
    }
    setState(sessionId, state) {
        this.states.set(sessionId, state);
    }
    getState(sessionId) {
        return this.states.get(sessionId) || 'Idle';
    }
    summarize(sessionId) {
        const list = this.getMessages(sessionId);
        if (list.length === 0)
            return 'No conversation yet.';
        return `Conversation contains ${list.length} messages. Last User Request: ${list.filter((m) => m.role === 'user').pop()?.content || 'None'}`;
    }
    clear(sessionId) {
        this.messages.delete(sessionId);
        this.states.delete(sessionId);
    }
}
exports.ConversationManager = ConversationManager;
//# sourceMappingURL=conversation-manager.js.map