"use strict";
/**
 * repository-scanner.ts
 *
 * Scans workspace files, tracking files, folders, and package configurations.
 * Ignores node_modules, dist, build, .git, and common build artifacts.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.RepositoryScanner = void 0;
class RepositoryScanner {
    files = new Map();
    packages = new Map();
    clear() {
        this.files.clear();
        this.packages.clear();
    }
    isIgnored(filePath) {
        const normalized = filePath.replace(/\\/g, '/');
        const parts = normalized.split('/');
        const ignoredDirs = new Set(['node_modules', 'dist', 'build', '.git', '.next', '.turbo', 'coverage', '.ds_store']);
        for (const part of parts) {
            if (ignoredDirs.has(part.toLowerCase()))
                return true;
        }
        return false;
    }
    async scanWorkspace(files, signal) {
        for (const f of files) {
            if (signal?.aborted) {
                throw new Error('Repository scan cancelled by AbortSignal.');
            }
            if (this.isIgnored(f.path))
                continue;
            this.addFile(f.path, f.content || '', f.size || 0, f.mtime || Date.now());
        }
        return {
            files: Array.from(this.files.values()),
            packages: Array.from(this.packages.values()),
        };
    }
    addFile(filePath, content = '', size = 0, mtime = Date.now()) {
        if (this.isIgnored(filePath))
            return;
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
            }
            catch (err) {
                // Ignore invalid package.json
            }
        }
    }
    removeFile(filePath) {
        const normalized = filePath.replace(/\\/g, '/');
        this.files.delete(normalized);
        this.packages.delete(normalized);
    }
    getFiles() {
        return Array.from(this.files.values());
    }
    getPackages() {
        return Array.from(this.packages.values());
    }
}
exports.RepositoryScanner = RepositoryScanner;
//# sourceMappingURL=repository-scanner.js.map