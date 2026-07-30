"use strict";
/**
 * language-parser-registry.ts — Plugin Registry for Multilingual AST Parsers
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.LanguageParserRegistry = void 0;
const regex_fallback_parser_1 = require("./parsers/regex-fallback-parser");
const typescript_parser_1 = require("./parsers/typescript-parser");
class LanguageParserRegistry {
    parsers = new Map();
    fallbackParser = new regex_fallback_parser_1.RegexFallbackParser();
    constructor() {
        this.registerDefaults();
    }
    registerDefaults() {
        this.registerParser(new typescript_parser_1.TypeScriptParser());
    }
    registerParser(parser) {
        for (const ext of parser.supportedExtensions) {
            const normalizedExt = ext.startsWith('.') ? ext.toLowerCase() : `.${ext.toLowerCase()}`;
            this.parsers.set(normalizedExt, parser);
        }
    }
    getParserForFile(filePath) {
        const dotIdx = filePath.lastIndexOf('.');
        if (dotIdx !== -1) {
            const ext = filePath.substring(dotIdx).toLowerCase();
            if (this.parsers.has(ext)) {
                return this.parsers.get(ext);
            }
        }
        return this.fallbackParser;
    }
    async parseFile(filePath, content, fileId) {
        const parser = this.getParserForFile(filePath);
        return parser.parseFile(filePath, content, fileId);
    }
}
exports.LanguageParserRegistry = LanguageParserRegistry;
//# sourceMappingURL=language-parser-registry.js.map