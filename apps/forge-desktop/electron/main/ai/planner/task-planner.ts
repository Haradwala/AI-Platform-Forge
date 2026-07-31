import { ITaskNode } from '../context/context-package';
import { IGoal } from './goal-extractor';

export interface ITaskGraph {
  readonly nodes: ITaskNode[];
  readonly edges: Array<{ from: string; to: string }>;
}

export type RepositoryIntent =
  | { type: 'workspace_statistics' }
  | { type: 'file_search'; fileType?: string; targetFile?: string }
  | { type: 'text_search'; text: string }
  | { type: 'symbol_lookup'; symbol: string }
  | { type: 'read_file'; filePath: string }
  | { type: 'list_dir'; folderPath?: string }
  | { type: 'general_task' };

export class GoalTaskPlanner {
  classifyIntent(goalDescription: string): RepositoryIntent {
    const text = (goalDescription || '').trim();
    const clean = text.toLowerCase();

    // 1. Workspace Statistics
    if (
      clean.includes('how many files') ||
      clean.includes('file count') ||
      clean.includes('count files') ||
      clean.includes('workspace statistics') ||
      clean.includes('workspace stats')
    ) {
      return { type: 'workspace_statistics' };
    }

    // 2. Directory Listing / Folders
    if (
      clean.includes('list folders') ||
      clean.includes('list project folders') ||
      clean.includes('list directory') ||
      clean.includes('show folders') ||
      clean === 'ls'
    ) {
      return { type: 'list_dir', folderPath: '' };
    }

    // 3. Open/Read specific file
    const openMatch = text.match(/(?:open|read|show)\s+([a-zA-Z0-9_\-\.\/]+\.[a-zA-Z0-9]+)/i);
    if (openMatch) {
      return { type: 'read_file', filePath: openMatch[1] };
    }

    // 4. File Search (e.g. List all TypeScript files, find .ts files)
    const isSearchListing = clean.includes('list') || clean.includes('find') || clean.includes('search') || clean.includes('show all') || clean.includes('get');
    const isEditAction = clean.includes('update') || clean.includes('modify') || clean.includes('edit') || clean.includes('change') || clean.includes('fix') || clean.includes('add');

    if (
      isSearchListing &&
      !isEditAction &&
      (clean.includes('typescript') ||
        clean.includes('javascript') ||
        clean.includes('.ts') ||
        clean.includes('.tsx') ||
        clean.includes('file'))
    ) {
      const fileType = clean.includes('typescript') || clean.includes('.ts') ? '.ts,.tsx' : undefined;
      return { type: 'file_search', fileType };
    }

    // 5. Text Search (e.g. Search TODO, find text X)
    const todoMatch = text.match(/search\s+(?:for\s+)?(todo[s]?)/i) || clean.includes('todo');
    if (todoMatch) {
      return { type: 'text_search', text: 'TODO' };
    }

    const searchMatch = text.match(/(?:search|find|grep)\s+(?:for\s+)?['"]?([^'"]+)['"]?/i);
    if (searchMatch) {
      const searchTerm = searchMatch[1].trim();
      if (searchTerm && !searchTerm.includes(' ')) {
        return { type: 'text_search', text: searchTerm };
      }
    }

    // 6. Symbol Lookup
    const symbolMatch = text.match(/(?:symbol|class|function|interface)\s+([a-zA-Z0-9_$]+)/i);
    if (symbolMatch) {
      return { type: 'symbol_lookup', symbol: symbolMatch[1] };
    }

    return { type: 'general_task' };
  }

  buildTaskGraph(goal: IGoal): ITaskGraph {
    const nodes: ITaskNode[] = [];
    const edges: Array<{ from: string; to: string }> = [];
    const intent = this.classifyIntent(goal.description);

    switch (intent.type) {
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
        const analyzeNode: ITaskNode = {
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
          const editNode: ITaskNode = {
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
          const openNode: ITaskNode = {
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
}
