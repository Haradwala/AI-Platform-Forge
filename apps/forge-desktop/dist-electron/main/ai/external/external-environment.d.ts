/**
 * external-environment.ts — Phase 18 External Runtime Foundation
 *
 * Configures PATH, environment variables, working directory, sandbox isolation, and temporary files.
 */
export declare class ExternalEnvironment {
    private customEnv;
    private workingDir;
    private sandboxDir;
    constructor(initialCwd?: string, initialEnv?: Record<string, string>);
    private initSandboxDir;
    /**
     * Resolves the full PATH including system defaults and custom search directories.
     */
    getSystemPath(): string;
    /**
     * Constructs sanitized environment variables for process spawning.
     */
    getMergedEnvironment(): Record<string, string>;
    getWorkingDirectory(): string;
    setWorkingDirectory(dir: string): void;
    getSandboxDirectory(): string;
    dispose(): void;
}
