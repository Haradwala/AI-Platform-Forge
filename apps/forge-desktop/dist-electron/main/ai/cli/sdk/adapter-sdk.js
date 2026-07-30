"use strict";
/**
 * adapter-sdk.ts — Phase 20 CLI Adapter SDK & Registry
 *
 * Official Forge CLI Adapter SDK for constructing, validating, and registering CLI adapters.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdapterSDK = void 0;
const cli_capabilities_1 = require("../cli-capabilities");
const adapter_validator_1 = require("./adapter-validator");
const cli_errors_1 = require("../cli-errors");
class AdapterSDK {
    /**
     * Helper utility to build a fully compliant CLIAdapter instance from a manifest and execution handlers.
     */
    static createAdapter(options) {
        const report = adapter_validator_1.AdapterValidator.validate(options.manifest);
        if (!report.valid) {
            throw new cli_errors_1.AdapterError(`Failed to create adapter "${options.manifest.id}":\n${report.errors.join('\n')}`);
        }
        const caps = (0, cli_capabilities_1.createCapabilities)(options.manifest.capabilities);
        return {
            id: options.manifest.id,
            name: options.manifest.name,
            version: options.manifest.version,
            detect: () => options.detectFn(),
            command: () => options.commandFn(),
            arguments: (prompt, opts) => options.argumentsFn(prompt, opts),
            environment: (opts) => (options.environmentFn ? options.environmentFn(opts) : {}),
            workingDirectory: (opts) => options.workingDirectoryFn ? options.workingDirectoryFn(opts) : process.cwd(),
            supportsStreaming: () => caps.streaming,
            supportsApproval: () => caps.approval,
            supportsTools: () => caps.tools,
            supportsImages: () => caps.images,
            supportsMCP: () => caps.mcp,
            supportsResume: () => caps.resume,
            getCapabilities: () => caps,
            parseOutput: (chunk) => [
                {
                    type: 'token',
                    payload: { text: chunk },
                    timestamp: Date.now(),
                },
            ],
            parseProgress: () => null,
            parseErrors: (chunk) => (chunk.includes('ERR') ? chunk : null),
            parseToolCalls: () => [],
        };
    }
}
exports.AdapterSDK = AdapterSDK;
//# sourceMappingURL=adapter-sdk.js.map