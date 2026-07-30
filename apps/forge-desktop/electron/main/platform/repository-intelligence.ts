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
  private readonly listeners = new Set<RepositoryEventListener>();
  private readonly startTime = Date.now();

  constructor(
    private readonly workspaceService: IWorkspaceService,
    eventBus?: IDesktopEventBus
  ) {
    this.events = new RepositoryEventService(eventBus);
    this.indexer = new IncrementalIndexerService(this.parser, this.symbols, this.graph, this.events);
    this.search = new RepositorySearchService(this.symbols, this.graph);
  }

  uptime(): number {
    return Date.now() - this.startTime;
  }

  metrics(): Record<string, any> {
    return {
      filesIndexed: this.manifest?.filesCount || 0,
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
  }

  async scanWorkspace(): Promise<void> {
    const root = this.workspaceService.getRootPath();
    if (!root) return;

    this.events.emitIndexingStarted();

    this.manifest = await this.discovery.discover(root);

    const parseDir = async (dir: string) => {
      const files = await fs.promises.readdir(dir, { withFileTypes: true });
      for (const file of files) {
        const fullPath = path.join(dir, file.name);
        if (file.name === 'node_modules' || file.name === '.git' || file.name === 'dist' || file.name === 'build' || file.name === '.forge') {
          continue;
        }

        if (file.isDirectory()) {
          await parseDir(fullPath);
        } else if (file.isFile() && this.parser.supports(fullPath)) {
          await this.indexer.indexFile(fullPath);
        }
      }
    };

    try {
      await parseDir(root);
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
          const files = this.search.findFile(request.query);
          return { success: true, data: files };
        }
        case 'workspaceStatistics': {
          return {
            success: true,
            data: {
              filesCount: this.manifest?.filesCount || 0,
              symbolsCount: this.symbols.getAll().length,
              circularDependenciesCount: this.graph.findCircularDependencies().length,
              languages: this.manifest?.languages || [],
              projects: this.manifest?.projects || [],
            },
          };
        }
        case 'findFilesByLanguage': {
          const matches = this.symbols.getAll()
            .filter((s) => s.language.toLowerCase() === request.language.toLowerCase())
            .map((s) => s.file);
          return { success: true, data: Array.from(new Set(matches)) };
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
