import { IContextItem } from './context-package';
import { IWorkspaceService, IRepositoryProvider } from '../../container/service-interfaces';

export interface IContextCollector {
  readonly id: string;
  collect(): Promise<IContextItem[]> | IContextItem[];
}

export class WorkspaceCollector implements IContextCollector {
  readonly id = 'WorkspaceCollector';
  constructor(private readonly workspaceService: IWorkspaceService) {}

  async collect(): Promise<IContextItem[]> {
    const root = this.workspaceService.getRootPath();
    return [
      {
        id: 'workspace:root',
        source: 'workspace',
        content: `Workspace Root: ${root || 'None'}`,
        score: 50,
      },
    ];
  }
}

export class RepositoryCollector implements IContextCollector {
  readonly id = 'RepositoryCollector';
  constructor(private readonly repositoryProvider: IRepositoryProvider) {}

  async collect(): Promise<IContextItem[]> {
    const res = await this.repositoryProvider.query({ type: 'workspaceStatistics' });
    const stats = res.success ? JSON.stringify(res.data) : 'No stats';
    return [
      {
        id: 'repository:stats',
        source: 'repository',
        content: `Repository Index Stats: ${stats}`,
        score: 60,
      },
    ];
  }
}

export class EditorCollector implements IContextCollector {
  readonly id = 'EditorCollector';
  collect(): IContextItem[] {
    return [
      {
        id: 'editor:active-file',
        source: 'editor',
        content: 'Active File: index.ts\nCursor Line: 10\nSelection: None',
        score: 100,
      },
    ];
  }
}

export class GitCollector implements IContextCollector {
  readonly id = 'GitCollector';
  collect(): IContextItem[] {
    return [
      {
        id: 'git:diff',
        source: 'git',
        content: 'Modified: index.ts\n+ console.log("hello");\n- console.log("world");',
        score: 75,
      },
    ];
  }
}

export class DiagnosticsCollector implements IContextCollector {
  readonly id = 'DiagnosticsCollector';
  collect(): IContextItem[] {
    return [
      {
        id: 'diagnostics:errors',
        source: 'diagnostics',
        content: 'No compiler errors or linter warnings.',
        score: 90,
      },
    ];
  }
}

export class TerminalCollector implements IContextCollector {
  readonly id = 'TerminalCollector';
  collect(): IContextItem[] {
    return [
      {
        id: 'terminal:recent',
        source: 'terminal',
        content: 'Last Command: pnpm test\nStatus: Success',
        score: 80,
      },
    ];
  }
}

export class RuntimeCollector implements IContextCollector {
  readonly id = 'RuntimeCollector';
  collect(): IContextItem[] {
    return [
      {
        id: 'runtime:limits',
        source: 'runtime',
        content: 'CPU Usage: 10%\nRAM: 128MB\nThrottling: False',
        score: 40,
      },
    ];
  }
}

export class LayoutCollector implements IContextCollector {
  readonly id = 'LayoutCollector';
  collect(): IContextItem[] {
    return [
      {
        id: 'layout:active',
        source: 'layout',
        content: 'Active Panel: terminal\nFocus Target: editor',
        score: 30,
      },
    ];
  }
}

export class AIStateCollector implements IContextCollector {
  readonly id = 'AIStateCollector';
  collect(): IContextItem[] {
    return [
      {
        id: 'aistate:session',
        source: 'aistate',
        content: 'Provider: ollama\nModel: llama3\nStreaming: False',
        score: 20,
      },
    ];
  }
}
