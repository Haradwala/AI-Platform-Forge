import { IRuntimeService } from './runtime-service';
import { IRepositoryProvider, RepositoryQuery, RepositoryResult, RepositoryEventListener, IDisposable, ISymbol } from './repository-types';
import { WorkspaceDiscoveryService, IWorkspaceManifest } from './workspace-discovery';
import { RegexParser } from './regex-parser';
import { SymbolIndexService } from './symbol-index';
import { DependencyGraphService } from './dependency-graph';
import { IncrementalIndexerService } from './incremental-indexer';
import { RepositorySearchService } from './repository-search';
import { RepositoryDiagnosticsService } from './repository-diagnostics';
import { RepositoryEventService } from './repository-events';
import { IWorkspaceService, IDesktopEventBus } from '../container/service-interfaces';
import * as fs from 'fs';
import * as path from 'path';

export class RepositoryIntelligenceEngine implements IRuntimeService, IRepositoryProvider {
  readonly id = 'RepositoryIntelligenceEngine';
  readonly version = '2.0.0';
  readonly dependencies = [];
  health: 'healthy' | 'warning' | 'degraded' | 'failed' = 'healthy';
  status: 'stopped' | 'starting' | 'running' | 'suspended' | 'error' = 'stopped';

  private readonly discovery = new WorkspaceDiscoveryService();
  private readonly parser = new RegexParser();
  private readonly symbols = new SymbolIndexService();
  private readonly graph = new DependencyGraphService();
  private readonly diagnosticsService = new RepositoryDiagnosticsService();
  private readonly events: RepositoryEventService;
  private readonly indexer: IncrementalIndexerService;
  private readonly search: RepositorySearchService;

  private manifest: IWorkspaceManifest | null = null;
  private allWorkspaceFiles: string[] = [];
  private readonly listeners = new Set<RepositoryEventListener>();
  private readonly startTime = Date.now();

  constructor(
    private readonly workspaceService: IWorkspaceService,
    eventBus?: IDesktopEventBus
  ) {
    this.events = new RepositoryEventService(eventBus);
    this.indexer = new IncrementalIndexerService(this.parser, this.symbols, this.graph, this.events);
    this.search = new RepositorySearchService(this.symbols, this.graph);

    if (eventBus) {
      eventBus.on('workspace.loaded', () => {
        this.scanWorkspace().catch(() => {});
      });
      eventBus.on('workspace:file-created', (data: any) => {
        if (data?.path && !data.isDirectory) {
          this.onFileAdded(data.path).catch(() => {});
        }
      });
      eventBus.on('workspace:file-deleted', (data: any) => {
        if (data?.path) {
          this.onFileDeleted(data.path).catch(() => {});
        }
      });
      eventBus.on('workspace:file-changed', (data: any) => {
        if (data?.path) {
          this.onFileChanged(data.path).catch(() => {});
        }
      });
    }
  }

  uptime(): number {
    return Date.now() - this.startTime;
  }

  metrics(): Record<string, any> {
    return {
      filesIndexed: this.manifest?.filesCount || this.allWorkspaceFiles.length || 0,
      symbolsCount: this.symbols.getAll().length,
    };
  }

  onStart(): void {}
  onRunning(): void {
    this.scanWorkspace().catch(() => {
      this.health = 'degraded';
    });
  }
  onSuspend(): void {}
  onShutdown(): void {
    this.symbols.clear();
    this.graph.clear();
    this.listeners.clear();
    this.allWorkspaceFiles = [];
  }

  async scanWorkspace(): Promise<void> {
    const root = this.workspaceService?.getRootPath() || process.cwd();
    if (!root) return;

    this.events.emitIndexingStarted();

    this.manifest = await this.discovery.discover(root);
    const relativeFiles: string[] = [];

    /**
     * Directories excluded from source-intelligence indexing.
     *
     * IMPORTANT: This controls what gets indexed for code analysis, NOT
     * filesystem visibility. A query like "Where is .vscode/settings.json?"
     * still works via the deterministic file-query path (raw fs operations).
     * These dirs are excluded to prevent build artifacts and IDE metadata
     * from polluting workspace search and symbol index results.
     */
    const SOURCE_EXCLUDED_DIRS = new Set([
      'node_modules', '.git', 'dist', 'dist-electron', 'build', 'out',
      '.forge', '.next', '.turbo', 'coverage', 'target', 'tmp', 'temp',
    ]);

    const parseDir = async (dir: string) => {
      const files = await fs.promises.readdir(dir, { withFileTypes: true });
      for (const file of files) {
        const fullPath = path.join(dir, file.name);

        // Skip directories excluded from source-intelligence scope
        if (file.isDirectory()) {
          if (SOURCE_EXCLUDED_DIRS.has(file.name)) continue;
          await parseDir(fullPath);
        } else if (file.isFile()) {
          const relPath = path.relative(root, fullPath);

          // Exclude generated .d.ts files inside build output dirs.
          // Source .d.ts files (e.g. src/types/env.d.ts) are preserved.
          if (relPath.endsWith('.d.ts')) {
            const normalizedRel = relPath.replace(/\\/g, '/');
            const buildDirPattern = /^(dist|dist-electron|build|out|\.next)\//;
            if (buildDirPattern.test(normalizedRel)) {
              continue;
            }
          }

          relativeFiles.push(relPath);
          if (this.parser.supports(fullPath)) {
            await this.indexer.indexFile(fullPath);
          }
        }
      }
    };

    try {
      await parseDir(root);
      this.allWorkspaceFiles = relativeFiles;
      if (this.manifest) {
        this.manifest.filesCount = Math.max(this.manifest.filesCount || 0, relativeFiles.length);
      }
      this.status = 'running';
      this.health = 'healthy';

      this.diagnosticsService.writeDiagnostics(root, this.manifest, this.symbols, this.graph);
    } catch (err) {
      this.health = 'warning';
    } finally {
      this.events.emitIndexingCompleted();
    }
  }

  async query(request: RepositoryQuery): Promise<RepositoryResult> {
    try {
      const root = this.workspaceService?.getRootPath() || process.cwd();
      if (root && !this.manifest) {
        await this.scanWorkspace();
      }

      switch (request.type) {
        case 'findSymbol': {
          const syms = this.search.findSymbol(request.query);
          return { success: true, data: syms };
        }
        case 'findReferences': {
          const refs = this.search.findReferences(request.symbolName);
          return { success: true, data: refs };
        }
        case 'findImplementations': {
          const impls = this.search.findImplementations(request.interfaceName);
          return { success: true, data: impls };
        }
        case 'findCallers': {
          const callers = this.search.findCallers(request.functionName);
          return { success: true, data: callers };
        }
        case 'findDependencyPath': {
          const path = this.graph.findDependencyPath(request.from, request.to);
          return { success: true, data: path };
        }
        case 'findCircularDependencies': {
          const cycles = this.graph.findCircularDependencies();
          return { success: true, data: cycles };
        }
        case 'findFile': {
          const files = this.search.findFile(request.query, this.allWorkspaceFiles);
          return { success: true, data: files };
        }
        case 'workspaceStatistics': {
          return {
            success: true,
            data: {
              filesCount: this.manifest?.filesCount || this.allWorkspaceFiles.length || 0,
              symbolsCount: this.symbols.getAll().length,
              circularDependenciesCount: this.graph.findCircularDependencies().length,
              languages: this.manifest?.languages || [],
              projects: this.manifest?.projects || [],
            },
          };
        }
        case 'findFilesByLanguage': {
          const lang = request.language.toLowerCase();
          const matches = this.allWorkspaceFiles.filter((f) => {
            const ext = path.extname(f).toLowerCase();
            if (lang === 'typescript') return ext === '.ts' || ext === '.tsx';
            if (lang === 'javascript') return ext === '.js' || ext === '.jsx';
            if (lang === 'python') return ext === '.py';
            return ext.includes(lang);
          });
          return { success: true, data: matches };
        }
        default:
          return { success: false, data: null, error: `Unsupported query type: ${(request as any).type}` };
      }
    } catch (err: any) {
      return { success: false, data: null, error: err.message };
    }
  }

  subscribe(listener: RepositoryEventListener): IDisposable {
    this.listeners.add(listener);
    return {
      dispose: () => {
        this.listeners.delete(listener);
      },
    };
  }

  async onFileAdded(filePath: string): Promise<void> {
    const root = this.workspaceService.getRootPath();
    if (root) {
      const relPath = path.relative(root, filePath);
      if (!this.allWorkspaceFiles.includes(relPath)) {
        this.allWorkspaceFiles.push(relPath);
      }
      if (this.manifest) {
        this.manifest.filesCount = this.allWorkspaceFiles.length;
      }
    }
    if (this.parser.supports(filePath)) {
      await this.indexer.indexFile(filePath);
    }
  }

  async onFileDeleted(filePath: string): Promise<void> {
    const root = this.workspaceService.getRootPath();
    if (root) {
      const relPath = path.relative(root, filePath);
      this.allWorkspaceFiles = this.allWorkspaceFiles.filter((f) => f !== relPath && f !== filePath);
      if (this.manifest) {
        this.manifest.filesCount = this.allWorkspaceFiles.length;
      }
    }
  }

  async onFileChanged(filePath: string): Promise<void> {
    if (this.parser.supports(filePath)) {
      await this.indexer.indexFile(filePath);

      const root = this.workspaceService.getRootPath();
      if (root && this.manifest) {
        this.diagnosticsService.writeDiagnostics(root, this.manifest, this.symbols, this.graph);
      }

      for (const listener of this.listeners) {
        listener({ type: 'file-updated', payload: { filePath } });
      }
    }
  }
}
export type { IRepositoryProvider };
