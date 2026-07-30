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

export class DefaultEmbeddingProvider implements IEmbeddingProvider {
  readonly providerId = 'default_stub';
  readonly dimensions = 128;

  async generateEmbedding(text: string): Promise<number[]> {
    const vector = new Array(this.dimensions).fill(0);
    for (let i = 0; i < text.length; i++) {
      const charCode = text.charCodeAt(i);
      vector[i % this.dimensions] = (vector[i % this.dimensions] + charCode) % 100 / 100;
    }
    return vector;
  }

  async generateBatchEmbeddings(texts: string[]): Promise<number[][]> {
    return Promise.all(texts.map((t) => this.generateEmbedding(t)));
  }
}
