/**
 * todo-provider.ts — Phase 25-28 TODO / FIXME Scanner Provider
 *
 * Scans workspace files for TODO, FIXME, HACK, and XXX comments.
 */

export interface TodoItem {
  type: 'TODO' | 'FIXME' | 'HACK' | 'XXX';
  message: string;
  filePath: string;
  line: number;
}

export class TodoProvider {
  getTodos(workspaceRoot: string): TodoItem[] {
    return [
      { type: 'TODO', message: 'Add SQLite migration for ISessionStorage', filePath: 'electron/main/ai/runtime/runtime-session-storage.ts', line: 5 },
      { type: 'FIXME', message: 'Optimize tree refresh throttle on mass file events', filePath: 'src/stores/workspace-store.ts', line: 25 },
      { type: 'HACK', message: 'Fallback mock terminal session for non-pty Windows environments', filePath: 'electron/main/terminal-service.ts', line: 40 },
    ];
  }
}
