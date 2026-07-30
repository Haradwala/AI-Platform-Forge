/**
 * configuration-loader.ts
 *
 * Handles persistence (reading/writing JSON configuration to disk).
 * Automatically creates default configuration file if missing.
 * Never throws during load; returns defaults on file missing or corrupt.
 */

import * as fs from 'fs';
import * as path from 'path';
import { createDefaultConfig, type ForgeConfig } from './configuration-schema';

export interface IFileSystem {
  existsSync(filePath: string): boolean;
  readFileSync(filePath: string, encoding: string): string;
  writeFileSync(filePath: string, content: string, encoding: string): void;
  mkdirSync(dirPath: string, options?: { recursive?: boolean }): void;
}

const defaultFs: IFileSystem = {
  existsSync: (filePath: string) => fs.existsSync(filePath),
  readFileSync: (filePath: string, encoding: string) => fs.readFileSync(filePath, encoding as BufferEncoding),
  writeFileSync: (filePath: string, content: string, encoding: string) => fs.writeFileSync(filePath, content, encoding as BufferEncoding),
  mkdirSync: (dirPath: string, options?: { recursive?: boolean }) => {
    fs.mkdirSync(dirPath, options);
  },
};

export class ConfigurationLoader {
  private readonly filePath: string;
  private readonly fs: IFileSystem;

  constructor(customPath?: string, customFs?: IFileSystem) {
    this.fs = customFs || defaultFs;
    this.filePath = customPath || this.resolveDefaultPath();
  }

  get path(): string {
    return this.filePath;
  }

  load(): ForgeConfig {
    try {
      if (!this.fs.existsSync(this.filePath)) {
        const defaultConfig = createDefaultConfig();
        this.save(defaultConfig);
        return defaultConfig;
      }

      const content = this.fs.readFileSync(this.filePath, 'utf-8');
      const parsed = JSON.parse(content);
      return parsed;
    } catch {
      // On corrupt file or read error, fallback to defaults without throwing
      return createDefaultConfig();
    }
  }

  save(config: ForgeConfig): void {
    try {
      const dir = path.dirname(this.filePath);
      if (!this.fs.existsSync(dir)) {
        this.fs.mkdirSync(dir, { recursive: true });
      }
      this.fs.writeFileSync(this.filePath, JSON.stringify(config, null, 2), 'utf-8');
    } catch (err) {
      // Swallowed to prevent startup/save crashes
    }
  }

  private resolveDefaultPath(): string {
    // Uses process.cwd() / .forge / config.json or fallback path
    return path.join(process.cwd(), '.forge', 'config.json');
  }
}
