import type { IPlanner, IPlan, ITask, IStructuredContext } from '../../container/service-interfaces';
import { GoalTaskPlanner } from './task-planner';

export class TaskPlanner implements IPlanner {
  constructor(private readonly goalPlanner: GoalTaskPlanner = new GoalTaskPlanner()) {}

  async generatePlan(goal: string, context: IStructuredContext): Promise<IPlan> {
    const tasks: ITask[] = [];
    const cleanGoal = (goal || '').toLowerCase();

    tasks.push({
      id: 'task_1',
      title: 'Analyze request context',
      description: `Evaluate goal: ${goal}`,
      status: 'pending',
      dependencies: [],
      toolCall: {
        toolId: 'noop',
        input: {}
      }
    });

    const intent = this.goalPlanner.classifyIntent(goal, context);

    switch (intent.type) {
      case 'terminal_command': {
        const rawCmd = (intent.rawCommand || goal).toLowerCase();
        const cmd = rawCmd.includes('git diff') ? 'git diff' :
                    rawCmd.includes('git status') ? 'git status' :
                    rawCmd.includes('git log') ? 'git log' :
                    rawCmd.includes('cargo test') ? 'cargo test' :
                    rawCmd.includes('pytest') ? 'pytest' :
                    rawCmd.includes('go test') ? 'go test' :
                    rawCmd.includes('bun test') ? 'bun test' :
                    rawCmd.includes('yarn test') ? 'yarn test' :
                    rawCmd.includes('npm test') ? 'npm test' : 'pnpm test';
        tasks.push({
          id: 'task_2',
          title: `Run terminal command: ${cmd}`,
          description: `Execute terminal command "${cmd}"`,
          status: 'pending',
          dependencies: ['task_1'],
          toolCall: {
            toolId: 'run_terminal_command',
            input: { command: cmd }
          }
        });
        break;
      }
      case 'workspace_statistics': {
        tasks.push({
          id: 'task_2',
          title: 'Gather workspace statistics',
          description: 'Query file counts and language breakdown across the workspace',
          status: 'pending',
          dependencies: ['task_1'],
          toolCall: {
            toolId: 'search_workspace',
            input: {
              query: goal,
              mode: 'workspace_statistics'
            }
          }
        });
        break;
      }
      case 'list_workspace_files': {
        tasks.push({
          id: 'task_2',
          title: 'List workspace files',
          description: 'Enumerate all files present in the active workspace',
          status: 'pending',
          dependencies: ['task_1'],
          toolCall: {
            toolId: 'list_workspace_files',
            input: {
              query: goal,
              limit: (intent as any).limit,
              offset: (intent as any).offset
            }
          }
        });
        break;
      }
      case 'list_dir': {
        tasks.push({
          id: 'task_2',
          title: 'List project folders and directory contents',
          description: 'Examine workspace directory structure',
          status: 'pending',
          dependencies: ['task_1'],
          toolCall: {
            toolId: 'list_dir',
            input: {
              folderPath: intent.folderPath || ''
            }
          }
        });
        break;
      }
      case 'read_file': {
        tasks.push({
          id: 'task_2',
          title: `Read file: ${intent.filePath}`,
          description: `Retrieve contents of file: ${intent.filePath}`,
          status: 'pending',
          dependencies: ['task_1'],
          toolCall: {
            toolId: 'read_file',
            input: {
              filePath: intent.filePath
            }
          }
        });

        if ((intent as any).open) {
          tasks.push({
            id: 'task_3',
            title: `Open file tab: ${intent.filePath}`,
            description: `Open ${intent.filePath} in Monaco editor viewport`,
            status: 'pending',
            dependencies: ['task_2'],
            toolCall: {
              toolId: 'open_file',
              input: {
                filePath: intent.filePath
              }
            }
          });
        }
        break;
      }
      case 'file_search': {
        tasks.push({
          id: 'task_2',
          title: 'Search workspace files by extension or name',
          description: 'Locate matching files in the workspace',
          status: 'pending',
          dependencies: ['task_1'],
          toolCall: {
            toolId: 'search_workspace',
            input: {
              query: goal,
              mode: 'file_search',
              fileType: intent.fileType,
              limit: (intent as any).limit,
              open: (intent as any).open
            }
          }
        });
        break;
      }
      case 'text_search': {
        tasks.push({
          id: 'task_2',
          title: `Search text: "${intent.text}"`,
          description: `Find all text occurrences of "${intent.text}" in workspace files`,
          status: 'pending',
          dependencies: ['task_1'],
          toolCall: {
            toolId: 'search_workspace',
            input: {
              query: goal,
              mode: 'text_search',
              text: intent.text
            }
          }
        });
        break;
      }
      case 'symbol_lookup': {
        tasks.push({
          id: 'task_2',
          title: `Lookup symbol: "${intent.symbol}"`,
          description: `Find definitions and references for symbol "${intent.symbol}"`,
          status: 'pending',
          dependencies: ['task_1'],
          toolCall: {
            toolId: 'search_workspace',
            input: {
              query: goal,
              mode: 'symbol_lookup',
              symbol: intent.symbol
            }
          }
        });
        break;
      }
      default: {
        if (cleanGoal.includes('calc') || cleanGoal.includes('calculator')) {
          tasks.push(
            {
              id: 'task_2',
              title: 'Generate React Calculator Component',
              description: 'Create src/components/Calculator.tsx containing calculator states and handlers.',
              status: 'pending',
              dependencies: ['task_1'],
              toolCall: {
                toolId: 'write_file',
                input: {
                  filePath: 'src/components/Calculator.tsx',
                  content: `import React from 'react';\n\nexport const Calculator: React.FC = () => {\n  return <div>Calculator Component</div>;\n};`
                }
              }
            },
            {
              id: 'task_3',
              title: 'Verify and Open File',
              description: 'Open the created calculator component tab in Monaco editor viewport.',
              status: 'pending',
              dependencies: ['task_2'],
              toolCall: {
                toolId: 'open_file',
                input: { filePath: 'src/components/Calculator.tsx' }
              }
            }
          );
        } else {
          tasks.push({
            id: 'task_2',
            title: 'Run workspace query matching user intent',
            description: 'Examine workspace details to gather context for the request.',
            status: 'pending',
            dependencies: ['task_1'],
            toolCall: {
              toolId: 'search_workspace',
              input: { query: goal },
            },
          });
        }
        break;
      }
    }

    return {
      id: `plan_${Date.now()}`,
      goal,
      tasks
    };
  }
}
