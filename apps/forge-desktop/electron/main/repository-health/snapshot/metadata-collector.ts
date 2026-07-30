import * as fs from 'fs/promises';
import * as path from 'path';
import * as crypto from 'crypto';
import { FileMetadata } from '../contracts/health-types';

export class MetadataCollector {
  async collect(rootPath: string, relativePaths: string[]): Promise<Map<string, FileMetadata>> {
    const map = new Map<string, FileMetadata>();

    for (const relPath of relativePaths) {
      const absPath = path.join(rootPath, relPath);
      try {
        const stats = await fs.stat(absPath);
        const content = await fs.readFile(absPath, 'utf-8');
        const lines = content.split(/\r?\n/).length;
        const hash = crypto.createHash('sha256').update(content).digest('hex');
        const ext = path.extname(relPath);
        const isTestFile = relPath.includes('.test.') || relPath.includes('.spec.') || relPath.startsWith('tests/');

        map.set(relPath, {
          relativePath: relPath,
          absolutePath: absPath,
          sizeBytes: stats.size,
          lineCount: lines,
          hash,
          extension: ext,
          isTestFile
        });
      } catch {
        // Skip unreadable files
      }
    }

    return map;
  }
}
