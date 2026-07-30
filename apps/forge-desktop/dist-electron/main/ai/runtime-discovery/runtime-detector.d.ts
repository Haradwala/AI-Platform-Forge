/**
 * runtime-detector.ts — Phase 23 Runtime Detector Engine
 */
import { RuntimeConfig } from './runtime-config';
import type { KnownRuntimeId, RuntimeCategory, RuntimeCapabilities } from './runtime-types';
export interface DetectionResult {
    id: KnownRuntimeId;
    name: string;
    category: RuntimeCategory;
    installed: boolean;
    version: string | null;
    executablePath: string | null;
    envVars: Record<string, string>;
    rawEnvVars: Record<string, string>;
    capabilities: RuntimeCapabilities;
    installUrl: string;
    missingDependencies?: string[];
}
export declare class RuntimeDetector {
    private validator;
    /**
     * Scans system PATH and common installation directories across Windows, macOS, and Linux.
     */
    detectAll(config?: RuntimeConfig): Promise<DetectionResult[]>;
    private detectOllama;
    private detectClaudeCode;
    private detectGeminiCli;
    private detectCodexCli;
    private detectAider;
    private detectOpenCode;
    private detectGoose;
    private detectOpenRouter;
    private detectOpenAI;
    private findExecutable;
}
