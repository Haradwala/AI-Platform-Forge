export enum MessageRole {
  System = 'system',
  User = 'user',
  Assistant = 'assistant',
  Tool = 'tool'
}

export interface IChatMessage {
  readonly role: MessageRole;
  readonly content: string;
}

export interface IChatRequest {
  readonly modelId: string;
  readonly messages: IChatMessage[];
  readonly temperature?: number;
  readonly jsonSchema?: Record<string, any>;
}

export interface IChatResponse {
  readonly id: string;
  readonly role: MessageRole;
  readonly content: string;
  readonly promptTokens: number;
  readonly completionTokens: number;
  readonly cost: number;
  readonly durationMs: number;
}

export interface IEmbeddingResponse {
  readonly embeddings: number[][];
  readonly tokensCount: number;
}
