"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GoalTaskPlanner = void 0;
const execution_goal_1 = require("../contracts/execution-goal");
const file_query_normalizer_1 = require("../response/file-query-normalizer");
class GoalTaskPlanner {
    classifyIntent(goalDescription, context) {
        const text = (goalDescription || '').trim();
        const clean = text.toLowerCase();
        // 0. Highest Priority: Structured Resolution Metadata (e.g. from ReferenceResolutionEngine)
        if (context?.resolution?.type === 'document' && context.resolution.path) {
            const targetPath = context.resolution.path;
            const isOpenAction = clean.includes('open');
            const isOpenReadAction = isOpenAction || clean.includes('read') || clean.includes('summarize') || clean.includes('show') || clean.includes('view') || clean.includes('inspect') || clean.includes('explain') || clean.includes('describe') || clean.includes('analyze') || clean.includes('what does') || clean.includes('tell me about');
            if (isOpenReadAction) {
                return { type: 'read_file', goal: execution_goal_1.ExecutionGoal.FILE_CONTENT, filePath: targetPath, open: isOpenAction };
            }
        }
        // Read explicit structured conversation state as single source of truth
        const state = context?.state;
        const hasWorkspaceStatsContext = state?.activeEntities?.workspaceStats ||
            context?.entities?.getLatest?.('WORKSPACE_STATS') ||
            context?.previousExecutionResults?.some((r) => r.kind === 'WORKSPACE_STATS' || r.goal === 'WORKSPACE_STATISTICS') ||
            clean.includes('previously recorded count') ||
            clean.includes('previously found files');
        // 1. Terminal Execution Intent (e.g. "run tests", "npm test", "exec build", "what changed")
        if (clean.includes('run test') ||
            clean.includes('run tests') ||
            clean.includes('exec test') ||
            clean.includes('npm test') ||
            clean.includes('pnpm test') ||
            clean.includes('yarn test') ||
            clean.includes('bun test') ||
            clean.includes('cargo test') ||
            clean.includes('pytest') ||
            clean.includes('go test') ||
            clean.includes('run the test script') ||
            clean.includes('git diff') ||
            clean.includes('git status') ||
            clean.includes('git log') ||
            clean.includes('what changed') ||
            clean.startsWith('run ')) {
            return { type: 'terminal_command', goal: execution_goal_1.ExecutionGoal.RUN_TERMINAL, rawCommand: text };
        }
        // 2. High Priority: Resolved Conversational Document References ("Open the first one", "Summarize it")
        const refMatch = text.match(/\(Referring to document:\s*([^\)]+)\)/i) || text.match(/\(Referring to previously found files:\s*([^\)]+)\)/i);
        const isOpenAction = clean.includes('open');
        const isOpenReadAction = isOpenAction || clean.includes('read') || clean.includes('summarize') || clean.includes('show') || clean.includes('view') || clean.includes('inspect') || clean.includes('explain') || clean.includes('describe') || clean.includes('analyze') || clean.includes('what does') || clean.includes('tell me about');
        if (refMatch && isOpenReadAction) {
            const targetPath = refMatch[1].trim();
            if (targetPath && !targetPath.includes('[')) {
                return { type: 'read_file', goal: execution_goal_1.ExecutionGoal.FILE_CONTENT, filePath: targetPath, open: isOpenAction };
            }
        }
        // 3. Workspace Statistics & Filtered Quantity Queries
        if ((clean.includes('how many') || clean.includes('count')) &&
            !clean.includes('typescript') &&
            !clean.includes('javascript') &&
            !clean.includes('.ts') &&
            !clean.includes('.tsx') &&
            !clean.includes('.json')) {
            return { type: 'workspace_statistics', goal: execution_goal_1.ExecutionGoal.WORKSPACE_STATISTICS };
        }
        // 4. Directory Listing / Folders
        if (clean.includes('list folders') ||
            clean.includes('list project folders') ||
            clean.includes('list directory') ||
            clean.includes('show folders') ||
            clean === 'ls') {
            return { type: 'list_dir', goal: execution_goal_1.ExecutionGoal.FILE_LIST, folderPath: '' };
        }
        // 5. Workspace File Listing & Pagination (e.g., "list the first 20", "list next 20", "list them")
        const listMatch = clean.match(/(?:list|show|name|give|display|get|fetch|print)\s+(?:the\s+)?(first|next|top)?\s*(\d+)?/i) ||
            clean.match(/(?:list|show|name|give|display|get|fetch|print)\s+(?:the\s+)?files/i) ||
            clean.match(/^list\b/i) ||
            clean.match(/^show\b/i) ||
            clean.match(/^name\b/i);
        const limitNum = text.match(/\b(\d+)\b/);
        const limit = limitNum ? parseInt(limitNum[1], 10) : undefined;
        const isNext = clean.includes('next');
        const offset = isNext && limit ? limit : 0;
        const isOpenRequested = clean.includes('open');
        const hasLangFilter = clean.includes('typescript') ||
            clean.includes('javascript') ||
            clean.includes('.ts') ||
            clean.includes('.tsx') ||
            clean.includes('.json') ||
            clean.includes('.md') ||
            clean.includes('.js');
        if (hasLangFilter && (listMatch || clean.includes('how many') || clean.includes('count') || clean.includes('name') || clean.includes('open'))) {
            const fileType = (clean.includes('typescript') || clean.includes('.ts')) ? '.ts,.tsx' : undefined;
            return { type: 'file_search', goal: execution_goal_1.ExecutionGoal.SEARCH, fileType, limit, offset, open: isOpenRequested };
        }
        if (listMatch ||
            clean.includes('list files') ||
            clean.includes('list all files') ||
            clean.includes('list the files') ||
            clean.includes('show all files') ||
            clean.includes('show every file') ||
            clean.includes('give me their names') ||
            clean.includes('what files exist') ||
            clean.startsWith('list the first') ||
            clean.startsWith('list first') ||
            clean.startsWith('list next') ||
            clean.startsWith('show first') ||
            clean.startsWith('show next') ||
            clean === 'list workspace files' ||
            clean === 'show workspace files' ||
            (hasWorkspaceStatsContext && (clean.includes('them') || clean.includes('those') || clean.includes('first') || clean.includes('list') || clean.includes('name')))) {
            return { type: 'list_workspace_files', goal: execution_goal_1.ExecutionGoal.FILE_LIST, limit, offset, open: isOpenRequested };
        }
        const normalizedQuery = file_query_normalizer_1.FileQueryNormalizer.normalize(text);
        if (isOpenAction && (normalizedQuery.relativePath || normalizedQuery.basename)) {
            const targetPath = normalizedQuery.relativePath || normalizedQuery.basename;
            return { type: 'read_file', goal: execution_goal_1.ExecutionGoal.FILE_CONTENT, filePath: targetPath, open: isOpenAction };
        }
        const openMatch = text.match(/(?:open|read|show)\s+([a-zA-Z0-9_\-\.\/]+(?:\.[a-zA-Z0-9]+)?)/i);
        const stopWords = ['the', 'a', 'an', 'this', 'that', 'first', 'second', 'one', 'it', 'git', 'them', 'those', 'file', 'files', 'implementation', 'code'];
        if (openMatch && openMatch[1] && !openMatch[1].includes(' ') && !stopWords.includes(openMatch[1].toLowerCase())) {
            return { type: 'read_file', goal: execution_goal_1.ExecutionGoal.FILE_CONTENT, filePath: openMatch[1], open: isOpenAction };
        }
        // 4. File Search (e.g. List all TypeScript files, find .ts files)
        const isSearchListing = clean.includes('list') || clean.includes('find') || clean.includes('search') || clean.includes('show all') || clean.includes('get') || clean.includes('name') || clean.includes('give') || clean.includes('display') || clean.includes('fetch');
        const isEditAction = clean.includes('update') || clean.includes('modify') || clean.includes('edit') || clean.includes('change') || clean.includes('fix') || clean.includes('add');
        if (isSearchListing &&
            !isEditAction &&
            hasLangFilter) {
            const fileType = clean.includes('typescript') || clean.includes('.ts') ? '.ts,.tsx' : undefined;
            return { type: 'file_search', goal: execution_goal_1.ExecutionGoal.SEARCH, fileType, limit, offset, open: isOpenRequested };
        }
        // 5. Text Search (e.g. Search TODO, find text X)
        const todoMatch = text.match(/search\s+(?:for\s+)?(todo[s]?)/i) || clean.includes('todo');
        if (todoMatch) {
            return { type: 'text_search', goal: execution_goal_1.ExecutionGoal.SEARCH, text: 'TODO' };
        }
        const searchMatch = text.match(/(?:search|find|grep)\s+(?:for\s+)?['"]?([^'"]+)['"]?/i);
        if (searchMatch) {
            const searchTerm = searchMatch[1].trim();
            if (searchTerm && !searchTerm.includes(' ')) {
                return { type: 'text_search', goal: execution_goal_1.ExecutionGoal.SEARCH, text: searchTerm };
            }
        }
        // 6. Symbol Lookup
        const symbolMatch = text.match(/(?:symbol|class|function|interface)\s+([a-zA-Z0-9_$]+)/i);
        if (symbolMatch) {
            return { type: 'symbol_lookup', goal: execution_goal_1.ExecutionGoal.SEARCH, symbol: symbolMatch[1] };
        }
        return { type: 'general_task', goal: execution_goal_1.ExecutionGoal.UNKNOWN };
    }
    buildTaskGraph(goal) {
        const nodes = [];
        const edges = [];
        const intent = this.classifyIntent(goal.description);
        switch (intent.type) {
            case 'terminal_command': {
                const resolvedCommand = this.resolveTerminalCommand(intent.rawCommand);
                nodes.push({
                    id: 'task_terminal_cmd',
                    title: `Run terminal command: ${resolvedCommand}`,
                    description: `Execute project command "${resolvedCommand}" in terminal`,
                    dependencies: [],
                    priority: 'high',
                    risk: 'medium',
                    toolId: 'run_terminal_command',
                    input: { command: resolvedCommand },
                    status: 'pending',
                });
                break;
            }
            case 'workspace_statistics': {
                nodes.push({
                    id: 'task_workspace_stats',
                    title: 'Gather workspace statistics',
                    description: 'Count total files and summarize workspace languages and projects',
                    dependencies: [],
                    priority: 'high',
                    risk: 'low',
                    toolId: 'search_workspace',
                    status: 'pending',
                });
                break;
            }
            case 'list_dir': {
                nodes.push({
                    id: 'task_list_dir',
                    title: 'List project folders and directory contents',
                    description: 'Examine workspace directory structure',
                    dependencies: [],
                    priority: 'high',
                    risk: 'low',
                    toolId: 'list_dir',
                    status: 'pending',
                });
                break;
            }
            case 'read_file': {
                nodes.push({
                    id: 'task_read_file',
                    title: `Read file: ${intent.filePath}`,
                    description: `Retrieve content for ${intent.filePath}`,
                    dependencies: [],
                    priority: 'high',
                    risk: 'low',
                    toolId: 'read_file',
                    status: 'pending',
                });
                nodes.push({
                    id: 'task_open_file',
                    title: `Open file tab: ${intent.filePath}`,
                    description: `Display ${intent.filePath} in Monaco editor viewport`,
                    dependencies: ['task_read_file'],
                    priority: 'low',
                    risk: 'low',
                    toolId: 'open_file',
                    status: 'pending',
                });
                edges.push({ from: 'task_read_file', to: 'task_open_file' });
                break;
            }
            case 'file_search': {
                nodes.push({
                    id: 'task_file_search',
                    title: 'Find matching workspace files',
                    description: `Search workspace files matching pattern: ${intent.fileType || goal.description}`,
                    dependencies: [],
                    priority: 'high',
                    risk: 'low',
                    toolId: 'search_workspace',
                    status: 'pending',
                });
                break;
            }
            case 'text_search': {
                nodes.push({
                    id: 'task_text_search',
                    title: `Search text: "${intent.text}" across workspace`,
                    description: `Locate text occurrences of "${intent.text}"`,
                    dependencies: [],
                    priority: 'high',
                    risk: 'low',
                    toolId: 'search_workspace',
                    status: 'pending',
                });
                break;
            }
            case 'symbol_lookup': {
                nodes.push({
                    id: 'task_symbol_lookup',
                    title: `Lookup symbol: "${intent.symbol}"`,
                    description: `Locate definition and references for symbol "${intent.symbol}"`,
                    dependencies: [],
                    priority: 'high',
                    risk: 'low',
                    toolId: 'search_workspace',
                    status: 'pending',
                });
                break;
            }
            default: {
                const analyzeNode = {
                    id: 'task_analyze',
                    title: 'Analyze goal references',
                    description: `Understand details of scope: ${goal.scope}`,
                    dependencies: [],
                    priority: 'high',
                    risk: 'low',
                    toolId: 'read_file',
                    status: 'pending',
                };
                nodes.push(analyzeNode);
                goal.targetFiles.forEach((file, index) => {
                    const editId = `task_edit_${index}`;
                    const editNode = {
                        id: editId,
                        title: `Modify file: ${file}`,
                        description: `Apply goal modifications to ${file}`,
                        dependencies: ['task_analyze'],
                        priority: 'normal',
                        risk: 'medium',
                        toolId: 'write_file',
                        status: 'pending',
                    };
                    nodes.push(editNode);
                    edges.push({ from: 'task_analyze', to: editId });
                    const openId = `task_open_${index}`;
                    const openNode = {
                        id: openId,
                        title: `Open file tab: ${file}`,
                        description: `Expose modified file: ${file} on Monaco editor viewport`,
                        dependencies: [editId],
                        priority: 'low',
                        risk: 'low',
                        toolId: 'open_file',
                        status: 'pending',
                    };
                    nodes.push(openNode);
                    edges.push({ from: editId, to: openId });
                });
                break;
            }
        }
        return { nodes, edges };
    }
    /**
     * Dynamic Project-Agnostic Terminal Command Resolver.
     * Inspects user prompt and project context to resolve exact test/build command lines
     * without hardcoding (e.g. pnpm test, npm test, cargo test, pytest, go test).
     */
    resolveTerminalCommand(rawCommand) {
        if (!rawCommand)
            return 'pnpm test';
        const clean = rawCommand.toLowerCase();
        if (clean.includes('git diff'))
            return 'git diff';
        if (clean.includes('git status'))
            return 'git status';
        if (clean.includes('git log'))
            return 'git log';
        if (clean.includes('cargo test'))
            return 'cargo test';
        if (clean.includes('pytest'))
            return 'pytest';
        if (clean.includes('go test'))
            return 'go test';
        if (clean.includes('bun test'))
            return 'bun test';
        if (clean.includes('yarn test'))
            return 'yarn test';
        if (clean.includes('npm test'))
            return 'npm test';
        if (clean.includes('pnpm test'))
            return 'pnpm test';
        // Default to pnpm test for node workspace
        return 'pnpm test';
    }
}
exports.GoalTaskPlanner = GoalTaskPlanner;
//# sourceMappingURL=task-planner.js.map