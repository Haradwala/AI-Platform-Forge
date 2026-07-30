"use strict";
/**
 * gemini-runtime.ts
 *
 * Gemini CLI Runtime implementation.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.GeminiCLIRuntime = void 0;
const cli_runtime_1 = require("./cli-runtime");
class GeminiCLIRuntime extends cli_runtime_1.BaseCLIRuntime {
    id = 'gemini-cli';
    name = 'Gemini CLI';
    defaultExecutable = 'gemini';
    defaultArgs = ['--prompt'];
    constructor(cliManager) {
        super(cliManager);
    }
    async listAvailableModels() {
        return ['gemini-1.5-pro', 'gemini-1.5-flash', 'gemini-2.0-flash-exp'];
    }
}
exports.GeminiCLIRuntime = GeminiCLIRuntime;
//# sourceMappingURL=gemini-runtime.js.map