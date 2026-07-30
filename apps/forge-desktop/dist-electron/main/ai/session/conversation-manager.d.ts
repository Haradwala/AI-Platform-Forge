import { ConversationState } from './ai-session-service';
export interface IMessage {
    role: 'user' | 'assistant' | 'system';
    content: string;
    timestamp: string;
}
export declare class ConversationManager {
    private readonly messages;
    private readonly states;
    addMessage(sessionId: string, message: IMessage): void;
    getMessages(sessionId: string): IMessage[];
    setState(sessionId: string, state: ConversationState): void;
    getState(sessionId: string): ConversationState;
    summarize(sessionId: string): string;
    clear(sessionId: string): void;
}
