"use strict";
/**
 * cli-errors.ts — Phase 19 Generic CLI Runtime
 *
 * Custom error hierarchy for CLI runtime operations, discovery, launching, adapters, and stream parsing.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.ParsingError = exports.AdapterError = exports.LaunchError = exports.DiscoveryError = exports.CLIError = void 0;
class CLIError extends Error {
    code;
    constructor(message, code) {
        super(message);
        this.code = code;
        this.name = 'CLIError';
    }
}
exports.CLIError = CLIError;
class DiscoveryError extends CLIError {
    executablePath;
    constructor(message, executablePath) {
        super(message, 'DISCOVERY_ERROR');
        this.executablePath = executablePath;
        this.name = 'DiscoveryError';
    }
}
exports.DiscoveryError = DiscoveryError;
class LaunchError extends CLIError {
    command;
    constructor(message, command) {
        super(message, 'LAUNCH_ERROR');
        this.command = command;
        this.name = 'LaunchError';
    }
}
exports.LaunchError = LaunchError;
class AdapterError extends CLIError {
    adapterId;
    constructor(message, adapterId) {
        super(message, 'ADAPTER_ERROR');
        this.adapterId = adapterId;
        this.name = 'AdapterError';
    }
}
exports.AdapterError = AdapterError;
class ParsingError extends CLIError {
    rawChunk;
    constructor(message, rawChunk) {
        super(message, 'PARSING_ERROR');
        this.rawChunk = rawChunk;
        this.name = 'ParsingError';
    }
}
exports.ParsingError = ParsingError;
//# sourceMappingURL=cli-errors.js.map