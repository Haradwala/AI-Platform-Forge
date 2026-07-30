"use strict";
/**
 * claude-runtime.ts
 *
 * Claude Code CLI Runtime implementation.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClaudeCodeRuntime = void 0;
const cli_runtime_1 = require("./cli-runtime");
class ClaudeCodeRuntime extends cli_runtime_1.BaseCLIRuntime {
    id = 'claude-code-cli';
    name = 'Claude Code CLI';
    defaultExecutable = 'claude';
    defaultArgs = ['-p'];
    constructor(cliManager) {
        super(cliManager);
    }
    async listAvailableModels() {
        return ['claude-3-5-sonnet-20241022', 'claude-3-opus-20240229', 'claude-3-haiku-20240307'];
    }
}
exports.ClaudeCodeRuntime = ClaudeCodeRuntime;
//# sourceMappingURL=claude-runtime.js.map