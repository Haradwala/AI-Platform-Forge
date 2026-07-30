"use strict";
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
exports.IncrementalIndexerService = void 0;
const fs = __importStar(require("fs"));
class IncrementalIndexerService {
    parser;
    symbolsIndex;
    graph;
    eventService;
    constructor(parser, symbolsIndex, graph, eventService) {
        this.parser = parser;
        this.symbolsIndex = symbolsIndex;
        this.graph = graph;
        this.eventService = eventService;
    }
    async indexFile(filePath) {
        try {
            this.symbolsIndex.removeSymbolsForFile(filePath);
            this.graph.removeFile(filePath);
            if (!fs.existsSync(filePath)) {
                this.eventService.emitFileUpdated(filePath, 'deleted');
                return;
            }
            const content = await fs.promises.readFile(filePath, 'utf8');
            const parsed = await this.parser.parse(filePath, content);
            this.symbolsIndex.addSymbols(parsed.symbols);
            this.graph.addImports(filePath, parsed.imports);
            this.graph.addReferences(filePath, parsed.references);
            this.eventService.emitFileUpdated(filePath, 'updated');
        }
        catch (err) {
            console.error(`[IncrementalIndexerService] Failed to index ${filePath}:`, err);
        }
    }
}
exports.IncrementalIndexerService = IncrementalIndexerService;
//# sourceMappingURL=incremental-indexer.js.map