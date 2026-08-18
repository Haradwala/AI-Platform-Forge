import type { ITool, IWorkspaceService, ITerminalService, IDesktopEventBus, IRepositoryProvider, IWorkspaceApplicationService, ITerminalApplicationService } from '../../container/service-interfaces';
import type { ExecutionResult } from '../contracts/execution-envelope';
import type { IFileContentResult, IWorkspaceFileListResult, ITerminalCommandResult } from '../contracts/workspace-contracts';
export declare class ReadFileTool implements ITool<{
    filePath: string;
}, ExecutionResult<IFileContentResult>> {
    private readonly workspaceService;
    readonly id = "read_file";
    readonly description = "Reads the content of a file from the workspace.";
    readonly inputSchema: {
        type: string;
        properties: {
            filePath: {
                type: string;
                description: string;
            };
        };
        required: string[];
    };
    readonly outputSchema: {
        type: string;
        properties: {
            content: {
                type: string;
            };
        };
    };
    constructor(workspaceService: IWorkspaceService);
    execute(input: {
        filePath: string;
    }): Promise<ExecutionResult<IFileContentResult>>;
    private resolvePath;
}
export declare class WriteFileTool implements ITool<{
    filePath: string;
    content: string;
}, {
    success: boolean;
}> {
    private readonly workspaceService;
    private readonly workspaceAppService?;
    readonly id = "write_file";
    readonly description = "Writes text content to a file in the workspace.";
    readonly inputSchema: {
        type: string;
        properties: {
            filePath: {
                type: string;
                description: string;
            };
            content: {
                type: string;
                description: string;
            };
        };
        required: string[];
    };
    readonly outputSchema: {
        type: string;
        properties: {
            success: {
                type: string;
            };
        };
    };
    constructor(workspaceService: IWorkspaceService, workspaceAppService?: IWorkspaceApplicationService | undefined);
    execute(input: {
        filePath: string;
        content: string;
    }): Promise<{
        success: boolean;
    }>;
    private resolvePath;
}
export declare class ListDirectoryTool implements ITool<{
    folderPath?: string;
}, {
    items: string[];
}> {
    private readonly workspaceService;
    private readonly repositoryProvider;
    readonly id = "list_dir";
    readonly description = "Lists files and folders inside a workspace directory.";
    readonly inputSchema: {
        type: string;
        properties: {
            folderPath: {
                type: string;
                description: string;
            };
        };
    };
    readonly outputSchema: {
        type: string;
        properties: {
            items: {
                type: string;
                items: {
                    type: string;
                };
            };
        };
    };
    constructor(workspaceService: IWorkspaceService, repositoryProvider: IRepositoryProvider);
    execute(input: {
        folderPath?: string;
    }): Promise<{
        items: string[];
    }>;
}
export declare class ListWorkspaceFilesTool implements ITool<{
    query?: string;
    limit?: number;
}, ExecutionResult<IWorkspaceFileListResult>> {
    private readonly workspaceService;
    private readonly repositoryProvider;
    readonly id = "list_workspace_files";
    readonly description = "Lists all file paths present in the active workspace without text filtering.";
    readonly inputSchema: {
        type: string;
        properties: {
            query: {
                type: string;
                description: string;
            };
            limit: {
                type: string;
                description: string;
            };
        };
    };
    readonly outputSchema: {
        type: string;
        properties: {
            files: {
                type: string;
                items: {
                    type: string;
                };
            };
            total: {
                type: string;
            };
        };
    };
    constructor(workspaceService: IWorkspaceService, repositoryProvider: IRepositoryProvider);
    execute(input: {
        query?: string;
        limit?: number;
        offset?: number;
    }): Promise<ExecutionResult<IWorkspaceFileListResult>>;
}
export declare class SearchWorkspaceTool implements ITool<{
    query?: string;
    mode?: string;
    fileType?: string;
    text?: string;
    symbol?: string;
}, ExecutionResult<any>> {
    private readonly workspaceService;
    private readonly repositoryProvider;
    readonly id = "search_workspace";
    readonly description = "Searches the active workspace files recursively based on query intent.";
    readonly inputSchema: {
        type: string;
        properties: {
            query: {
                type: string;
                description: string;
            };
            mode: {
                type: string;
                description: string;
            };
            fileType: {
                type: string;
                description: string;
            };
            text: {
                type: string;
                description: string;
            };
            symbol: {
                type: string;
                description: string;
            };
        };
    };
    readonly outputSchema: {
        type: string;
        properties: {
            results: {
                type: string;
                items: {
                    type: string;
                    properties: {
                        filePath: {
                            type: string;
                        };
                        line: {
                            type: string;
                        };
                        text: {
                            type: string;
                        };
                    };
                };
            };
        };
    };
    constructor(workspaceService: IWorkspaceService, repositoryProvider: IRepositoryProvider);
    execute(input: {
        query?: string;
        mode?: string;
        fileType?: string;
        text?: string;
        symbol?: string;
        limit?: number;
        offset?: number;
    }): Promise<ExecutionResult<any>>;
}
export declare class RunTerminalCommandTool implements ITool<{
    command: string;
}, ExecutionResult<ITerminalCommandResult>> {
    private readonly terminalService;
    private readonly terminalAppService?;
    private readonly workspaceService?;
    readonly id = "run_terminal_command";
    readonly description = "Executes a command inside the active shell terminal panel.";
    readonly inputSchema: {
        type: string;
        properties: {
            command: {
                type: string;
                description: string;
            };
        };
        required: string[];
    };
    readonly outputSchema: {
        type: string;
        properties: {
            pid: {
                type: string;
            };
        };
    };
    constructor(terminalService: ITerminalService, terminalAppService?: ITerminalApplicationService | undefined, workspaceService?: IWorkspaceService | undefined);
    execute(input: {
        command: string;
    }): Promise<ExecutionResult<ITerminalCommandResult>>;
}
export declare class OpenFileTool implements ITool<{
    filePath: string;
}, {
    success: boolean;
}> {
    private readonly eventBus;
    private readonly workspaceService;
    readonly id = "open_file";
    readonly description = "Opens a file tab in the Monaco editor.";
    readonly inputSchema: {
        type: string;
        properties: {
            filePath: {
                type: string;
                description: string;
            };
        };
        required: string[];
    };
    readonly outputSchema: {
        type: string;
        properties: {
            success: {
                type: string;
            };
        };
    };
    constructor(eventBus: IDesktopEventBus, workspaceService: IWorkspaceService);
    execute(input: {
        filePath: string;
    }): Promise<{
        success: boolean;
        error?: string;
    }>;
}
export declare class ToggleTerminalTool implements ITool<{}, {
    success: boolean;
}> {
    private readonly eventBus;
    readonly id = "toggle_terminal";
    readonly description = "Toggles the visibility of the bottom terminal panel.";
    readonly inputSchema: {
        type: string;
        properties: {};
    };
    readonly outputSchema: {
        type: string;
        properties: {
            success: {
                type: string;
            };
        };
    };
    constructor(eventBus: IDesktopEventBus);
    execute(): Promise<{
        success: boolean;
    }>;
}
/**
 * NoOpTool — explicitly planned no-operation for reasoning/reflection steps.
 *
 * This tool is ONLY valid when the planner INTENTIONALLY selects it for a
 * step that produces an LLM response without touching the filesystem. Examples:
 *
 *   - "Think about the architecture"
 *   - "Reflect on the current plan"
 *   - "Summarize findings before writing code"
 *
 * This tool must NEVER be used as a fallback for tasks with missing toolCalls.
 * The ExecutionGraphEngine now throws a PlanningError for those cases so the
 * UI can surface the planner defect rather than silently succeeding.
 */
export declare class NoOpTool implements ITool<Record<string, never>, {
    success: true;
}> {
    readonly id = "noop";
    readonly description: string;
    readonly inputSchema: {
        type: string;
        properties: {};
    };
    readonly outputSchema: {
        type: string;
        properties: {
            success: {
                type: string;
            };
        };
    };
    execute(): Promise<{
        success: true;
    }>;
}
