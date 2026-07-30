"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AIStateCollector = exports.LayoutCollector = exports.RuntimeCollector = exports.TerminalCollector = exports.DiagnosticsCollector = exports.GitCollector = exports.EditorCollector = exports.RepositoryCollector = exports.WorkspaceCollector = void 0;
class WorkspaceCollector {
    workspaceService;
    id = 'WorkspaceCollector';
    constructor(workspaceService) {
        this.workspaceService = workspaceService;
    }
    async collect() {
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
exports.WorkspaceCollector = WorkspaceCollector;
class RepositoryCollector {
    repositoryProvider;
    id = 'RepositoryCollector';
    constructor(repositoryProvider) {
        this.repositoryProvider = repositoryProvider;
    }
    async collect() {
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
exports.RepositoryCollector = RepositoryCollector;
class EditorCollector {
    id = 'EditorCollector';
    collect() {
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
exports.EditorCollector = EditorCollector;
class GitCollector {
    id = 'GitCollector';
    collect() {
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
exports.GitCollector = GitCollector;
class DiagnosticsCollector {
    id = 'DiagnosticsCollector';
    collect() {
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
exports.DiagnosticsCollector = DiagnosticsCollector;
class TerminalCollector {
    id = 'TerminalCollector';
    collect() {
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
exports.TerminalCollector = TerminalCollector;
class RuntimeCollector {
    id = 'RuntimeCollector';
    collect() {
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
exports.RuntimeCollector = RuntimeCollector;
class LayoutCollector {
    id = 'LayoutCollector';
    collect() {
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
exports.LayoutCollector = LayoutCollector;
class AIStateCollector {
    id = 'AIStateCollector';
    collect() {
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
exports.AIStateCollector = AIStateCollector;
//# sourceMappingURL=context-collectors.js.map