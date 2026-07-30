"use strict";
/**
 * aider-runtime.ts
 *
 * Aider CLI Runtime implementation.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.AiderCLIRuntime = void 0;
const cli_runtime_1 = require("./cli-runtime");
class AiderCLIRuntime extends cli_runtime_1.BaseCLIRuntime {
    id = 'aider-cli';
    name = 'Aider CLI';
    defaultExecutable = 'aider';
    defaultArgs = ['--message'];
    constructor(cliManager) {
        super(cliManager);
    }
    async listAvailableModels() {
        return ['aider-auto', 'claude-3-5-sonnet', 'gpt-4o'];
    }
}
exports.AiderCLIRuntime = AiderCLIRuntime;
//# sourceMappingURL=aider-runtime.js.map