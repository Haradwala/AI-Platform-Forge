"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ToolSelector = void 0;
class ToolSelector {
    selectToolForTask(taskTitle, taskDescription) {
        const cleanTitle = taskTitle.toLowerCase();
        const cleanDesc = taskDescription.toLowerCase();
        if (cleanTitle.includes('read') || cleanDesc.includes('view') || cleanDesc.includes('examine')) {
            return 'read_file';
        }
        if (cleanTitle.includes('write') || cleanTitle.includes('modify') || cleanTitle.includes('create') || cleanDesc.includes('update')) {
            return 'write_file';
        }
        if (cleanTitle.includes('search') || cleanDesc.includes('grep')) {
            return 'search_workspace';
        }
        if (cleanTitle.includes('list') || cleanDesc.includes('folders')) {
            return 'list_dir';
        }
        if (cleanTitle.includes('terminal') || cleanDesc.includes('run') || cleanDesc.includes('execute')) {
            return 'run_terminal_command';
        }
        if (cleanTitle.includes('open') || cleanDesc.includes('viewport')) {
            return 'open_file';
        }
        return 'read_file'; // Default fallback safe tool
    }
}
exports.ToolSelector = ToolSelector;
//# sourceMappingURL=tool-selector.js.map