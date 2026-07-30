import * as fs from 'fs';
import * as path from 'path';

export interface IProjectMetadata {
  name: string;
  path: string;
  type: string;
  packageManager: string;
  frameworks: string[];
}

export interface IWorkspaceManifest {
  name: string;
  rootPath: string;
  projects: IProjectMetadata[];
  languages: string[];
  filesCount: number;
}

export class WorkspaceDiscoveryService {
  async discover(rootPath: string): Promise<IWorkspaceManifest> {
    const projects: IProjectMetadata[] = [];
    const languages = new Set<string>();
    let filesCount = 0;

    const scan = async (dir: string) => {
      const entries = await fs.promises.readdir(dir, { withFileTypes: true });
      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        
        if (entry.name === 'node_modules' || entry.name === '.git' || entry.name === 'dist' || entry.name === 'build' || entry.name === '.forge') {
          continue;
        }

        if (entry.isDirectory()) {
          // Detect project types
          const files = await fs.promises.readdir(fullPath);
          const hasPackageJson = files.includes('package.json');
          const hasCargoToml = files.includes('Cargo.toml');
          const hasGoMod = files.includes('go.mod');
          
          if (hasPackageJson || hasCargoToml || hasGoMod) {
            const projectType = hasPackageJson ? 'NodeJS' : hasCargoToml ? 'Rust' : 'Go';
            const packageManager = hasPackageJson ? (files.includes('pnpm-lock.yaml') ? 'pnpm' : 'npm') : hasCargoToml ? 'cargo' : 'go-modules';
            
            // Framework detection
            const frameworks: string[] = [];
            if (hasPackageJson) {
              try {
                const pkg = JSON.parse(await fs.promises.readFile(path.join(fullPath, 'package.json'), 'utf8'));
                const deps = { ...pkg.dependencies, ...pkg.devDependencies };
                if (deps.react) frameworks.push('react');
                if (deps.next) frameworks.push('nextjs');
                if (deps.vite) frameworks.push('vite');
              } catch {
                // Ignore parsing errors
              }
            }

            projects.push({
              name: entry.name,
              path: fullPath,
              type: projectType,
              packageManager,
              frameworks,
            });
          }

          await scan(fullPath);
        } else if (entry.isFile()) {
          filesCount++;
          const ext = path.extname(entry.name).toLowerCase();
          const lang = this.detectLanguage(ext);
          if (lang) {
            languages.add(lang);
          }
        }
      }
    };

    try {
      await scan(rootPath);
    } catch (err) {
      console.error('[WorkspaceDiscoveryService] Scan error:', err);
    }

    return {
      name: path.basename(rootPath),
      rootPath,
      projects,
      languages: Array.from(languages),
      filesCount,
    };
  }

  private detectLanguage(ext: string): string | null {
    const mapping: Record<string, string> = {
      '.ts': 'TypeScript',
      '.tsx': 'TypeScript',
      '.js': 'JavaScript',
      '.jsx': 'JavaScript',
      '.py': 'Python',
      '.go': 'Go',
      '.rs': 'Rust',
      '.java': 'Java',
      '.cs': 'C#',
      '.cpp': 'C++',
      '.h': 'C++',
    };
    return mapping[ext] || null;
  }
}
