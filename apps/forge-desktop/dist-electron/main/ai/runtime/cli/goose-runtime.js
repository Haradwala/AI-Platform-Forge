"use strict";
/**
 * goose-runtime.ts
 *
 * Goose CLI Runtime implementation.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.GooseCLIRuntime = void 0;
const cli_runtime_1 = require("./cli-runtime");
class GooseCLIRuntime extends cli_runtime_1.BaseCLIRuntime {
    id = 'goose-cli';
    name = 'Goose CLI Agent';
    defaultExecutable = 'goose';
    defaultArgs = ['run', '--text'];
    constructor(cliManager) {
        super(cliManager);
    }
    async listAvailableModels() {
        return ['goose-default', 'claude-3-5-sonnet', 'databricks-dbrx'];
    }
}
exports.GooseCLIRuntime = GooseCLIRuntime;
//# sourceMappingURL=goose-runtime.js.map