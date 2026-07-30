"use strict";
/**
 * adapter-loader.ts — Phase 20 CLI Adapter SDK & Registry
 *
 * Dynamically loads and instantiates CLI adapter classes from manifest definitions or directory paths.
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdapterLoader = void 0;
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const adapter_validator_1 = require("./adapter-validator");
const cli_errors_1 = require("../cli-errors");
class AdapterLoader {
    /**
     * Loads an adapter manifest and instantiates its CLIAdapter entry module.
     */
    static async loadFromDirectory(adapterDir) {
        const manifestPath = path.join(adapterDir, 'adapter.json');
        if (!fs.existsSync(manifestPath)) {
            throw new cli_errors_1.AdapterError(`Adapter manifest "adapter.json" not found in "${adapterDir}"`);
        }
        let manifest;
        try {
            const content = fs.readFileSync(manifestPath, 'utf-8');
            manifest = JSON.parse(content);
        }
        catch (err) {
            throw new cli_errors_1.AdapterError(`Failed to parse adapter manifest in "${manifestPath}": ${err}`);
        }
        const report = adapter_validator_1.AdapterValidator.validate(manifest, adapterDir);
        if (!report.valid) {
            throw new cli_errors_1.AdapterError(`Adapter manifest validation failed:\n${report.errors.join('\n')}`);
        }
        const entryPath = path.resolve(adapterDir, manifest.entry);
        try {
            // Dynamic import of adapter entry module
            const module = await Promise.resolve(`${entryPath}`).then(s => __importStar(require(s)));
            const AdapterClass = module.default || module.Adapter;
            if (!AdapterClass) {
                throw new cli_errors_1.AdapterError(`Adapter entry file "${entryPath}" does not export a default or named "Adapter" class.`);
            }
            const adapter = new AdapterClass(manifest);
            return { adapter, manifest };
        }
        catch (err) {
            throw new cli_errors_1.AdapterError(`Failed to load adapter module from "${entryPath}": ${err}`);
        }
    }
}
exports.AdapterLoader = AdapterLoader;
//# sourceMappingURL=adapter-loader.js.map