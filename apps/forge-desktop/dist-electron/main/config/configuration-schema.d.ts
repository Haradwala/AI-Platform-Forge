/**
 * configuration-schema.ts
 *
 * Schema definitions and default configuration builder for Forge.
 */
export interface ProviderConfig {
    apiKey?: string;
    baseUrl?: string;
    [key: string]: unknown;
}
export interface ForgeConfig {
    activeRuntime: string;
    defaultModels: Record<string, string>;
    providers: {
        ollama: {
            baseUrl: string;
        };
        openai: {
            apiKey: string;
            baseUrl?: string;
        };
        gemini: {
            apiKey: string;
            baseUrl?: string;
        };
        anthropic: {
            apiKey: string;
            baseUrl?: string;
        };
        groq: {
            apiKey: string;
            baseUrl?: string;
        };
        openrouter: {
            apiKey: string;
            baseUrl?: string;
        };
        [key: string]: ProviderConfig;
    };
}
/**
 * Returns a clean default ForgeConfig.
 * Seeds initial API keys and base URLs from process.env if present.
 */
export declare function createDefaultConfig(): ForgeConfig;
