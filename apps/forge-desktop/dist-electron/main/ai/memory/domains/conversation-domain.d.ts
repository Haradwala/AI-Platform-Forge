/**
 * conversation-domain.ts
 *
 * Conversation Domain Store — stores structured conversation messages,
 * turn histories, and condensed summaries.
 */
export interface ConversationMessage {
    readonly messageId: string;
    readonly turnId: string;
    readonly role: 'user' | 'assistant' | 'system' | 'tool';
    readonly content: string;
    readonly timestamp: string;
    readonly resolvedBindings?: readonly Record<string, unknown>[];
}
export interface IConversationDomain {
    addMessage(message: ConversationMessage): void;
    getMessages(): readonly ConversationMessage[];
    getRecentMessages(count: number): readonly ConversationMessage[];
    getSummary(): string;
    setSummary(summary: string): void;
    clear(): void;
}
export declare class ConversationDomain implements IConversationDomain {
    private readonly messages;
    private summary;
    addMessage(message: ConversationMessage): void;
    getMessages(): readonly ConversationMessage[];
    getRecentMessages(count: number): readonly ConversationMessage[];
    getSummary(): string;
    setSummary(summary: string): void;
    clear(): void;
}
