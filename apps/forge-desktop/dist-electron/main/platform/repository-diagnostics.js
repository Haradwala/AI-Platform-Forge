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
exports.RepositoryDiagnosticsService = void 0;
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
class RepositoryDiagnosticsService {
    writeDiagnostics(rootPath, manifest, symbols, graph) {
        const repoDir = path.join(rootPath, '.forge', 'repository');
        try {
            if (!fs.existsSync(repoDir)) {
                fs.mkdirSync(repoDir, { recursive: true });
            }
            fs.writeFileSync(path.join(repoDir, 'manifest.json'), JSON.stringify(manifest, null, 2));
            fs.writeFileSync(path.join(repoDir, 'languages.json'), JSON.stringify(manifest.languages, null, 2));
            fs.writeFileSync(path.join(repoDir, 'projects.json'), JSON.stringify(manifest.projects, null, 2));
            const symData = symbols.getAll().map((s) => ({
                id: s.id,
                name: s.name,
                kind: s.kind,
                file: s.file,
                line: s.line,
                parent: s.parent,
            }));
            fs.writeFileSync(path.join(repoDir, 'symbols.json'), JSON.stringify(symData, null, 2));
            const graphData = {};
            for (const sym of symbols.getAll()) {
                graphData[sym.file] = graph.getImports(sym.file);
            }
            fs.writeFileSync(path.join(repoDir, 'graph.json'), JSON.stringify(graphData, null, 2));
            fs.writeFileSync(path.join(repoDir, 'dependencies.json'), JSON.stringify(graphData, null, 2));
            const stats = {
                filesCount: manifest.filesCount,
                symbolsCount: symbols.getAll().length,
                circularDependenciesCount: graph.findCircularDependencies().length,
            };
            fs.writeFileSync(path.join(repoDir, 'statistics.json'), JSON.stringify(stats, null, 2));
            const health = {
                status: 'healthy',
                timestamp: new Date().toISOString(),
            };
            fs.writeFileSync(path.join(repoDir, 'health.json'), JSON.stringify(health, null, 2));
        }
        catch (err) {
            console.error('[RepositoryDiagnosticsService] Failed to export diagnostics:', err);
        }
    }
}
exports.RepositoryDiagnosticsService = RepositoryDiagnosticsService;
//# sourceMappingURL=repository-diagnostics.js.map