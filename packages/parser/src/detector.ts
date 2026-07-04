import * as path from 'path';

export interface ILanguageResolver {
  readonly priority: number;
  resolve(filePath: string, content?: string): string | undefined;
}

export class ShebangResolver implements ILanguageResolver {
  readonly priority = 100;

  resolve(filePath: string, content?: string): string | undefined {
    if (!content) return undefined;
    const firstLine = content.split('\n')[0].trim();
    if (!firstLine.startsWith('#!')) return undefined;

    if (firstLine.includes('python')) return 'python';
    if (firstLine.includes('node')) return 'javascript';
    if (firstLine.includes('sh') || firstLine.includes('bash')) return 'shell';
    return undefined;
  }
}

export class ConfigFileNameResolver implements ILanguageResolver {
  readonly priority = 80;

  private static readonly CONFIG_MAP: Record<string, string> = {
    'package.json': 'typescript',
    'tsconfig.json': 'typescript',
    'Cargo.toml': 'rust',
    'pom.xml': 'java',
    'go.mod': 'go',
    'requirements.txt': 'python',
    'pyproject.toml': 'python',
  };

  resolve(filePath: string): string | undefined {
    const filename = path.basename(filePath);
    return ConfigFileNameResolver.CONFIG_MAP[filename];
  }
}

export class ExtensionResolver implements ILanguageResolver {
  readonly priority = 50;

  private static readonly EXTENSION_MAP: Record<string, string> = {
    '.ts': 'typescript',
    '.tsx': 'typescript',
    '.js': 'javascript',
    '.jsx': 'javascript',
    '.py': 'python',
    '.rs': 'rust',
    '.go': 'go',
    '.java': 'java',
    '.md': 'markdown',
    '.json': 'json',
    '.yaml': 'yaml',
    '.yml': 'yaml',
  };

  resolve(filePath: string): string | undefined {
    const ext = path.extname(filePath);
    return ExtensionResolver.EXTENSION_MAP[ext];
  }
}

export class LanguageDetector {
  private resolvers: ILanguageResolver[] = [];

  constructor() {
    this.registerResolver(new ShebangResolver());
    this.registerResolver(new ConfigFileNameResolver());
    this.registerResolver(new ExtensionResolver());
  }

  registerResolver(resolver: ILanguageResolver): void {
    this.resolvers.push(resolver);
    this.resolvers.sort((a, b) => b.priority - a.priority);
  }

  detect(filePath: string, content?: string): string {
    for (const resolver of this.resolvers) {
      const languageId = resolver.resolve(filePath, content);
      if (languageId) {
        return languageId;
      }
    }
    return 'unknown';
  }
}
