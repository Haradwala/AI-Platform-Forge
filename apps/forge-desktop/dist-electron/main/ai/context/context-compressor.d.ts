/**
 * context-compressor.ts
 *
 * Sprint 85 Wave 2 Phase 2 — Intelligent Context Compression
 *
 * Reduces prompt size before LLM generation by extracting only relevant
 * sections (JSON keys, imports, function/class blocks, head/tail summaries).
 */
export declare class ContextCompressor {
    /**
     * Intelligently compresses file content based on user goal and file path.
     */
    compressFileContent(content: string, goal: string, filePath?: string): string;
    /**
     * Extracts a specific JSON key/value block.
     */
    extractJsonKey(content: string, key: string): string | null;
    /**
     * Extracts import statements from source code.
     */
    extractImports(content: string): string;
    /**
     * Extracts a function, method, class, or interface definition by symbol name.
     */
    extractFunction(content: string, name: string): string | null;
    /**
     * Summarizes large content by keeping the first 40 lines and last 20 lines.
     */
    summarizeLargeContent(content: string): string;
}
