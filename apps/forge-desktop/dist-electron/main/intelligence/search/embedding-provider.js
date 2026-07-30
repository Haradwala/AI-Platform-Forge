"use strict";
/**
 * embedding-provider.ts — Abstract Vector Embedding Strategy Provider
 *
 * Decouples embedding generation from search logic to support local transformers,
 * OpenAI, Ollama, or stub vector embedding providers.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.DefaultEmbeddingProvider = void 0;
class DefaultEmbeddingProvider {
    providerId = 'default_stub';
    dimensions = 128;
    async generateEmbedding(text) {
        const vector = new Array(this.dimensions).fill(0);
        for (let i = 0; i < text.length; i++) {
            const charCode = text.charCodeAt(i);
            vector[i % this.dimensions] = (vector[i % this.dimensions] + charCode) % 100 / 100;
        }
        return vector;
    }
    async generateBatchEmbeddings(texts) {
        return Promise.all(texts.map((t) => this.generateEmbedding(t)));
    }
}
exports.DefaultEmbeddingProvider = DefaultEmbeddingProvider;
//# sourceMappingURL=embedding-provider.js.map