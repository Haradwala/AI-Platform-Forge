"use strict";
/**
 * conversation-domain.ts
 *
 * Conversation Domain Store — stores structured conversation messages,
 * turn histories, and condensed summaries.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConversationDomain = void 0;
class ConversationDomain {
    messages = [];
    summary = '';
    addMessage(message) {
        this.messages.push(message);
    }
    getMessages() {
        return [...this.messages];
    }
    getRecentMessages(count) {
        return this.messages.slice(-Math.max(1, count));
    }
    getSummary() {
        return this.summary;
    }
    setSummary(summary) {
        this.summary = summary;
    }
    clear() {
        this.messages.length = 0;
        this.summary = '';
    }
}
exports.ConversationDomain = ConversationDomain;
//# sourceMappingURL=conversation-domain.js.map