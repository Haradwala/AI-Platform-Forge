"use strict";
/**
 * configuration-loader.ts
 *
 * Handles persistence (reading/writing JSON configuration to disk).
 * Automatically creates default configuration file if missing.
 * Never throws during load; returns defaults on file missing or corrupt.
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
exports.ConfigurationLoader = void 0;
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const configuration_schema_1 = require("./configuration-schema");
const defaultFs = {
    existsSync: (filePath) => fs.existsSync(filePath),
    readFileSync: (filePath, encoding) => fs.readFileSync(filePath, encoding),
    writeFileSync: (filePath, content, encoding) => fs.writeFileSync(filePath, content, encoding),
    mkdirSync: (dirPath, options) => {
        fs.mkdirSync(dirPath, options);
    },
};
class ConfigurationLoader {
    filePath;
    fs;
    constructor(customPath, customFs) {
        this.fs = customFs || defaultFs;
        this.filePath = customPath || this.resolveDefaultPath();
    }
    get path() {
        return this.filePath;
    }
    load() {
        try {
            if (!this.fs.existsSync(this.filePath)) {
                const defaultConfig = (0, configuration_schema_1.createDefaultConfig)();
                this.save(defaultConfig);
                return defaultConfig;
            }
            const content = this.fs.readFileSync(this.filePath, 'utf-8');
            const parsed = JSON.parse(content);
            return parsed;
        }
        catch {
            // On corrupt file or read error, fallback to defaults without throwing
            return (0, configuration_schema_1.createDefaultConfig)();
        }
    }
    save(config) {
        try {
            const dir = path.dirname(this.filePath);
            if (!this.fs.existsSync(dir)) {
                this.fs.mkdirSync(dir, { recursive: true });
            }
            this.fs.writeFileSync(this.filePath, JSON.stringify(config, null, 2), 'utf-8');
        }
        catch (err) {
            // Swallowed to prevent startup/save crashes
        }
    }
    resolveDefaultPath() {
        // Uses process.cwd() / .forge / config.json or fallback path
        return path.join(process.cwd(), '.forge', 'config.json');
    }
}
exports.ConfigurationLoader = ConfigurationLoader;
//# sourceMappingURL=configuration-loader.js.map