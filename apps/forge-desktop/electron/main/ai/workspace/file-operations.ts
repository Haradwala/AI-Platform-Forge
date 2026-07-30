/**
 * file-operations.ts
 *
 * Safe atomic file system operations supporting AbortSignal cancellation.
 * Implements atomic writes via temporary files and atomic renames.
 */

import * as fs from 'fs';
import * as path from 'path';

export class FileOperations {
  async readFile(filePath: string, signal?: AbortSignal): Promise<string> {
    if (signal?.aborted) throw new Error('Operation cancelled by AbortSignal.');
    if (!fs.existsSync(filePath)) {
      throw new Error(`File does not exist: ${filePath}`);
    }
    return fs.readFileSync(filePath, 'utf8');
  }

  async writeFile(filePath: string, content: string, signal?: AbortSignal): Promise<void> {
    if (signal?.aborted) throw new Error('Operation cancelled by AbortSignal.');

    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    const tmpPath = `${filePath}.tmp.${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;

    try {
      fs.writeFileSync(tmpPath, content, 'utf8');
      if (signal?.aborted) {
        if (fs.existsSync(tmpPath)) fs.unlinkSync(tmpPath);
        throw new Error('Operation cancelled by AbortSignal.');
      }
      fs.renameSync(tmpPath, filePath);
    } catch (err) {
      if (fs.existsSync(tmpPath)) {
        try { fs.unlinkSync(tmpPath); } catch (_) {}
      }
      throw err;
    }
  }

  async createFile(filePath: string, content = '', signal?: AbortSignal): Promise<void> {
    if (signal?.aborted) throw new Error('Operation cancelled by AbortSignal.');
    if (fs.existsSync(filePath)) {
      throw new Error(`File already exists: ${filePath}`);
    }
    await this.writeFile(filePath, content, signal);
  }

  async deleteFile(filePath: string, signal?: AbortSignal): Promise<void> {
    if (signal?.aborted) throw new Error('Operation cancelled by AbortSignal.');
    if (!fs.existsSync(filePath)) return;

    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      fs.rmSync(filePath, { recursive: true, force: true });
    } else {
      fs.unlinkSync(filePath);
    }
  }

  async rename(oldPath: string, newPath: string, signal?: AbortSignal): Promise<void> {
    if (signal?.aborted) throw new Error('Operation cancelled by AbortSignal.');
    if (!fs.existsSync(oldPath)) {
      throw new Error(`Path does not exist: ${oldPath}`);
    }

    const targetDir = path.dirname(newPath);
    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }

    fs.renameSync(oldPath, newPath);
  }

  async mkdir(dirPath: string, signal?: AbortSignal): Promise<void> {
    if (signal?.aborted) throw new Error('Operation cancelled by AbortSignal.');
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }
  }

  async exists(filePath: string, signal?: AbortSignal): Promise<boolean> {
    if (signal?.aborted) throw new Error('Operation cancelled by AbortSignal.');
    return fs.existsSync(filePath);
  }

  async list(dirPath: string, signal?: AbortSignal): Promise<string[]> {
    if (signal?.aborted) throw new Error('Operation cancelled by AbortSignal.');
    if (!fs.existsSync(dirPath)) return [];
    return fs.readdirSync(dirPath);
  }
}
