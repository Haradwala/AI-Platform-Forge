import { ConversationState } from './ai-session-service';

export interface IMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
}

export class ConversationManager {
  private readonly messages = new Map<string, IMessage[]>();
  private readonly states = new Map<string, ConversationState>();

  addMessage(sessionId: string, message: IMessage): void {
    if (!this.messages.has(sessionId)) {
      this.messages.set(sessionId, []);
    }
    this.messages.get(sessionId)!.push(message);
  }

  getMessages(sessionId: string): IMessage[] {
    return this.messages.get(sessionId) || [];
  }

  setState(sessionId: string, state: ConversationState): void {
    this.states.set(sessionId, state);
  }

  getState(sessionId: string): ConversationState {
    return this.states.get(sessionId) || 'Idle';
  }

  summarize(sessionId: string): string {
    const list = this.getMessages(sessionId);
    if (list.length === 0) return 'No conversation yet.';
    return `Conversation contains ${list.length} messages. Last User Request: ${list.filter((m) => m.role === 'user').pop()?.content || 'None'}`;
  }

  clear(sessionId: string): void {
    this.messages.delete(sessionId);
    this.states.delete(sessionId);
  }
}
