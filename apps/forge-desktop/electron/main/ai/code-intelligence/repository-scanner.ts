/**
 * repository-scanner.ts
 *
 * Scans workspace files, tracking files, folders, and package configurations.
 * Ignores node_modules, dist, build, .git, and common build artifacts.
 */

export interface ScannedFile {
  path: string;
  folder: string;
  extension: string;
  size: number;
  mtime: number;
}

export interface ScannedPackage {
  name: string;
  version: string;
  dependencies: Record<string, string>;
  devDependencies: Record<string, string>;
  path: string;
}

export class RepositoryScanner {
  private readonly files = new Map<string, ScannedFile>();
  private readonly packages = new Map<string, ScannedPackage>();

  clear(): void {
    this.files.clear();
    this.packages.clear();
  }

  isIgnored(filePath: string): boolean {
    const normalized = filePath.replace(/\\/g, '/');
    const parts = normalized.split('/');
    const ignoredDirs = new Set(['node_modules', 'dist', 'build', '.git', '.next', '.turbo', 'coverage', '.ds_store']);

    for (const part of parts) {
      if (ignoredDirs.has(part.toLowerCase())) return true;
    }
    return false;
  }

  async scanWorkspace(
    files: Array<{ path: string; content?: string; size?: number; mtime?: number }>,
    signal?: AbortSignal
  ): Promise<{ files: ScannedFile[]; packages: ScannedPackage[] }> {
    for (const f of files) {
      if (signal?.aborted) {
        throw new Error('Repository scan cancelled by AbortSignal.');
      }

      if (this.isIgnored(f.path)) continue;

      this.addFile(f.path, f.content || '', f.size || 0, f.mtime || Date.now());
    }

    return {
      files: Array.from(this.files.values()),
      packages: Array.from(this.packages.values()),
    };
  }

  addFile(filePath: string, content = '', size = 0, mtime = Date.now()): void {
    if (this.isIgnored(filePath)) return;

    const normalized = filePath.replace(/\\/g, '/');
    const folder = normalized.includes('/')
      ? normalized.substring(0, normalized.lastIndexOf('/'))
      : '';
    const extension = normalized.includes('.')
      ? normalized.substring(normalized.lastIndexOf('.') + 1)
      : '';

    this.files.set(normalized, {
      path: normalized,
      folder,
      extension,
      size: size || content.length,
      mtime,
    });

    if (normalized.endsWith('package.json') && content) {
      try {
        const parsed = JSON.parse(content);
        this.packages.set(normalized, {
          name: parsed.name || 'unnamed',
          version: parsed.version || '0.0.0',
          dependencies: parsed.dependencies || {},
          devDependencies: parsed.devDependencies || {},
          path: normalized,
        });
      } catch (err) {
        // Ignore invalid package.json
      }
    }
  }

  removeFile(filePath: string): void {
    const normalized = filePath.replace(/\\/g, '/');
    this.files.delete(normalized);
    this.packages.delete(normalized);
  }

  getFiles(): ScannedFile[] {
    return Array.from(this.files.values());
  }

  getPackages(): ScannedPackage[] {
    return Array.from(this.packages.values());
  }
}
