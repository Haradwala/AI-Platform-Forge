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

export class ConversationDomain implements IConversationDomain {
  private readonly messages: ConversationMessage[] = [];
  private summary = '';

  addMessage(message: ConversationMessage): void {
    this.messages.push(message);
  }

  getMessages(): readonly ConversationMessage[] {
    return [...this.messages];
  }

  getRecentMessages(count: number): readonly ConversationMessage[] {
    return this.messages.slice(-Math.max(1, count));
  }

  getSummary(): string {
    return this.summary;
  }

  setSummary(summary: string): void {
    this.summary = summary;
  }

  clear(): void {
    this.messages.length = 0;
    this.summary = '';
  }
}
