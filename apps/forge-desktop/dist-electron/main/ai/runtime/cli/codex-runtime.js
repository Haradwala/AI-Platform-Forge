"use strict";
/**
 * codex-runtime.ts
 *
 * Codex CLI Runtime implementation.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.CodexCLIRuntime = void 0;
const cli_runtime_1 = require("./cli-runtime");
class CodexCLIRuntime extends cli_runtime_1.BaseCLIRuntime {
    id = 'codex-cli';
    name = 'Codex CLI';
    defaultExecutable = 'codex';
    defaultArgs = ['--query'];
    constructor(cliManager) {
        super(cliManager);
    }
    async listAvailableModels() {
        return ['gpt-4o', 'gpt-4o-mini', 'o1-preview', 'o3-mini'];
    }
}
exports.CodexCLIRuntime = CodexCLIRuntime;
//# sourceMappingURL=codex-runtime.js.map