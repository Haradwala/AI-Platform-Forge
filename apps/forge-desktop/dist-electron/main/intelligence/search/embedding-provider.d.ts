/**
 * embedding-provider.ts — Abstract Vector Embedding Strategy Provider
 *
 * Decouples embedding generation from search logic to support local transformers,
 * OpenAI, Ollama, or stub vector embedding providers.
 */
export interface IEmbeddingProvider {
    readonly providerId: string;
    readonly dimensions: number;
    generateEmbedding(text: string): Promise<number[]>;
    generateBatchEmbeddings(texts: string[]): Promise<number[][]>;
}
export declare class DefaultEmbeddingProvider implements IEmbeddingProvider {
    readonly providerId = "default_stub";
    readonly dimensions = 128;
    generateEmbedding(text: string): Promise<number[]>;
    generateBatchEmbeddings(texts: string[]): Promise<number[][]>;
}
