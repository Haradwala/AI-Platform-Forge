/**
 * configuration-loader.ts
 *
 * Handles persistence (reading/writing JSON configuration to disk).
 * Automatically creates default configuration file if missing.
 * Never throws during load; returns defaults on file missing or corrupt.
 */
import { type ForgeConfig } from './configuration-schema';
export interface IFileSystem {
    existsSync(filePath: string): boolean;
    readFileSync(filePath: string, encoding: string): string;
    writeFileSync(filePath: string, content: string, encoding: string): void;
    mkdirSync(dirPath: string, options?: {
        recursive?: boolean;
    }): void;
}
export declare class ConfigurationLoader {
    private readonly filePath;
    private readonly fs;
    constructor(customPath?: string, customFs?: IFileSystem);
    get path(): string;
    load(): ForgeConfig;
    save(config: ForgeConfig): void;
    private resolveDefaultPath;
}
