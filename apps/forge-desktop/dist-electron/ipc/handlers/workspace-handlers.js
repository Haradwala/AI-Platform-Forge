"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.backgroundAnalyzer = exports.quickFixGenerator = exports.diagnosticsAggregator = exports.editorActionExecutor = exports.semanticRetriever = exports.dependencyGraphEngine = exports.referenceEngine = exports.workspaceSymbolIndexer = void 0;
exports.registerWorkspaceHandlers = registerWorkspaceHandlers;
const electron_1 = require("electron");
const symbol_indexer_1 = require("../../main/ai/workspace/symbol-indexer");
const reference_engine_1 = require("../../main/ai/workspace/reference-engine");
const dependency_graph_engine_1 = require("../../main/ai/workspace/dependency-graph-engine");
const semantic_retriever_1 = require("../../main/ai/context/semantic-retriever");
const editor_action_executor_1 = require("../../main/ai/workspace/editor-action-executor");
const diagnostics_aggregator_1 = require("../../main/ai/diagnostics/diagnostics-aggregator");
const ai_quickfix_generator_1 = require("../../main/ai/diagnostics/ai-quickfix-generator");
const background_analyzer_1 = require("../../main/ai/diagnostics/background-analyzer");
// Module-level singletons — one per process, shared across all workspaces
const _symbolIndexer = new symbol_indexer_1.WorkspaceSymbolIndexer();
exports.workspaceSymbolIndexer = _symbolIndexer;
const _referenceEngine = new reference_engine_1.ReferenceEngine(_symbolIndexer);
exports.referenceEngine = _referenceEngine;
const _dependencyGraphEngine = new dependency_graph_engine_1.DependencyGraphEngine(_symbolIndexer);
exports.dependencyGraphEngine = _dependencyGraphEngine;
const _semanticRetriever = new semantic_retriever_1.SemanticContextRetriever(_symbolIndexer, _dependencyGraphEngine);
exports.semanticRetriever = _semanticRetriever;
const _editorActionExecutor = new editor_action_executor_1.EditorActionExecutor(undefined, _referenceEngine);
exports.editorActionExecutor = _editorActionExecutor;
const _diagnosticsAggregator = new diagnostics_aggregator_1.DiagnosticsAggregator();
exports.diagnosticsAggregator = _diagnosticsAggregator;
const _quickFixGenerator = new ai_quickfix_generator_1.AiQuickFixGenerator();
exports.quickFixGenerator = _quickFixGenerator;
const _backgroundAnalyzer = new background_analyzer_1.BackgroundAnalyzer(_symbolIndexer, _diagnosticsAggregator);
exports.backgroundAnalyzer = _backgroundAnalyzer;
/**
 * Workspace IPC handlers — binds workspace IPC channels to WorkspaceApplicationService and WorkspaceService.
 */
function registerWorkspaceHandlers(router, workspaceService, workspaceAppService) {
    /**
     * workspace:pick-folder — opens a native OS folder-picker dialog.
     * Returns the selected absolute path string, or null if the user cancelled.
     */
    router.handle('workspace:pick-folder', async (ctx) => {
        const win = electron_1.BrowserWindow.fromWebContents(ctx.sender);
        const result = await electron_1.dialog.showOpenDialog(win ?? electron_1.BrowserWindow.getFocusedWindow() ?? undefined, {
            title: 'Open Folder',
            properties: ['openDirectory', 'createDirectory'],
        });
        if (result.canceled || result.filePaths.length === 0)
            return null;
        return result.filePaths[0];
    });
    router.handle('workspace:open-folder', async (ctx) => {
        const path = ctx.args[0];
        if (!path)
            throw new Error('Path is required for workspace:open-folder');
        return workspaceService.open(path);
    });
    router.handle('workspace:close', async () => {
        return workspaceService.close();
    });
    router.handle('workspace:get-tree', async () => {
        return workspaceService.getTree();
    });
    router.handle('workspace:read-file', async (ctx) => {
        const path = ctx.args[0];
        if (!path)
            throw new Error('Path is required for workspace:read-file');
        const root = workspaceService.getRootPath() || '';
        if (workspaceAppService) {
            return workspaceAppService.readFile(root, path);
        }
        return workspaceService.readFile(path);
    });
    router.handle('workspace:write-file', async (ctx) => {
        const path = ctx.args[0];
        const content = ctx.args[1];
        if (!path)
            throw new Error('Path is required for workspace:write-file');
        const root = workspaceService.getRootPath() || '';
        if (workspaceAppService) {
            const res = await workspaceAppService.writeFile(root, path, content ?? '');
            if (res.status === 'FAILED')
                throw new Error(res.error || 'Failed to write file');
            return true;
        }
        return workspaceService.writeFile(path, content ?? '');
    });
    router.handle('workspace:create-file', async (ctx) => {
        const path = ctx.args[0];
        if (!path)
            throw new Error('Path is required for workspace:create-file');
        const root = workspaceService.getRootPath() || '';
        if (workspaceAppService) {
            const res = await workspaceAppService.createFile(root, path);
            if (res.status === 'FAILED')
                throw new Error(res.error || 'Failed to create file');
            return true;
        }
        return workspaceService.createFile(path);
    });
    router.handle('workspace:create-folder', async (ctx) => {
        const path = ctx.args[0];
        if (!path)
            throw new Error('Path is required for workspace:create-folder');
        const root = workspaceService.getRootPath() || '';
        if (workspaceAppService) {
            const res = await workspaceAppService.createFolder(root, path);
            if (res.status === 'FAILED')
                throw new Error(res.error || 'Failed to create folder');
            return true;
        }
        return workspaceService.createFolder(path);
    });
    router.handle('workspace:rename-entry', async (ctx) => {
        const oldPath = ctx.args[0];
        const newPath = ctx.args[1];
        if (!oldPath || !newPath)
            throw new Error('oldPath and newPath are required for workspace:rename-entry');
        const root = workspaceService.getRootPath() || '';
        if (workspaceAppService) {
            const res = await workspaceAppService.renameEntry(root, oldPath, newPath);
            if (res.status === 'FAILED')
                throw new Error(res.error || 'Failed to rename entry');
            return true;
        }
        return workspaceService.renameEntry(oldPath, newPath);
    });
    router.handle('workspace:delete-entry', async (ctx) => {
        const path = ctx.args[0];
        if (!path)
            throw new Error('Path is required for workspace:delete-entry');
        const root = workspaceService.getRootPath() || '';
        if (workspaceAppService) {
            const res = await workspaceAppService.deleteEntry(root, path);
            if (res.status === 'FAILED')
                throw new Error(res.error || 'Failed to delete entry');
            return true;
        }
        return workspaceService.deleteEntry(path);
    });
    router.handle('workspace:get-recent', async () => {
        return workspaceService.getRecentWorkspaces();
    });
    // ── Sprint 86 Phase 1: Workspace Symbol Index IPC Handlers ──────────────────
    /**
     * forge.workspace.findSymbol — find symbol definitions by name.
     * Args: [name: string]
     */
    router.handle('forge.workspace.findSymbol', async (ctx) => {
        const name = ctx.args[0];
        if (!name)
            throw new Error('name is required for forge.workspace.findSymbol');
        return _symbolIndexer.findSymbol(name);
    });
    /**
     * forge.workspace.findReferences — find all usage sites (definitions + imports) by name.
     * Args: [name: string]
     */
    router.handle('forge.workspace.findReferences', async (ctx) => {
        const name = ctx.args[0];
        if (!name)
            throw new Error('name is required for forge.workspace.findReferences');
        return _symbolIndexer.findReferences(name);
    });
    /**
     * forge.workspace.findImports — find all files that import from a given module.
     * Args: [moduleName: string]
     */
    router.handle('forge.workspace.findImports', async (ctx) => {
        const moduleName = ctx.args[0];
        if (!moduleName)
            throw new Error('moduleName is required for forge.workspace.findImports');
        return _symbolIndexer.findImports(moduleName);
    });
    /**
     * forge.workspace.listExports — list all exports from a file.
     * Args: [filePath: string]
     */
    router.handle('forge.workspace.listExports', async (ctx) => {
        const filePath = ctx.args[0];
        if (!filePath)
            throw new Error('filePath is required for forge.workspace.listExports');
        return _symbolIndexer.listExports(filePath);
    });
    /**
     * forge.workspace.rebuildSymbolIndex — rebuild the full index.
     * Args: [workspaceRoot?: string] — defaults to current workspace root
     */
    router.handle('forge.workspace.rebuildSymbolIndex', async (ctx) => {
        const root = ctx.args[0] || workspaceService.getRootPath() || '';
        if (!root)
            throw new Error('No workspace root available for forge.workspace.rebuildSymbolIndex');
        await _symbolIndexer.rebuildIndex(root);
        _referenceEngine.invalidateFile();
        _dependencyGraphEngine.invalidate();
        return _symbolIndexer.getStats();
    });
    /**
     * forge.workspace.symbolIndexStats — get current index statistics.
     */
    router.handle('forge.workspace.symbolIndexStats', async () => {
        return _symbolIndexer.getStats();
    });
    /**
     * forge.workspace.updateFileIndex — incrementally update one file in the index.
     * Args: [filePath: string]
     */
    router.handle('forge.workspace.updateFileIndex', async (ctx) => {
        const filePath = ctx.args[0];
        if (!filePath)
            throw new Error('filePath is required for forge.workspace.updateFileIndex');
        await _symbolIndexer.updateFile(filePath);
        _referenceEngine.invalidateFile(filePath);
        _dependencyGraphEngine.invalidate();
        _backgroundAnalyzer.scheduleAnalysis(filePath);
        return { updated: true, filePath };
    });
    // ── Sprint 86 Phase 2: Reference Engine IPC Handlers ───────────────────────
    /**
     * forge.workspace.findUsages — find all usage and definition sites of a symbol.
     * Args: [symbolName: string]
     */
    router.handle('forge.workspace.findUsages', async (ctx) => {
        const symbolName = ctx.args[0];
        if (!symbolName)
            throw new Error('symbolName is required for forge.workspace.findUsages');
        return _referenceEngine.findUsages(symbolName);
    });
    /**
     * forge.workspace.openReference — opens a file at target reference location.
     * Args: [{ filePath: string, line: number, column?: number }]
     */
    router.handle('forge.workspace.openReference', async (ctx) => {
        const target = ctx.args[0];
        if (!target || !target.filePath) {
            throw new Error('target object with filePath is required for forge.workspace.openReference');
        }
        const root = workspaceService.getRootPath() || '';
        let content = '';
        if (workspaceAppService) {
            content = await workspaceAppService.readFile(root, target.filePath);
        }
        else {
            content = await workspaceService.readFile(target.filePath);
        }
        return {
            success: true,
            filePath: target.filePath,
            line: target.line,
            column: target.column ?? 1,
            content,
        };
    });
    // ── Sprint 86 Phase 3: Dependency & Import Graph IPC Handlers ─────────────
    /**
     * forge.workspace.getDependencyGraph — get complete or neighborhood graph.
     * Args: [{ center?: string, radius?: number }]
     */
    router.handle('forge.workspace.getDependencyGraph', async (ctx) => {
        const options = ctx.args[0] || {};
        if (options.center) {
            return _dependencyGraphEngine.getSubgraph(options.center, options.radius ?? 2);
        }
        return _dependencyGraphEngine.toGraph();
    });
    /**
     * forge.workspace.getFileDependencies — get direct dependencies of a file.
     * Args: [filePath: string]
     */
    router.handle('forge.workspace.getFileDependencies', async (ctx) => {
        const filePath = ctx.args[0];
        if (!filePath)
            throw new Error('filePath is required for forge.workspace.getFileDependencies');
        return _dependencyGraphEngine.getFileDependencies(filePath);
    });
    /**
     * forge.workspace.getFileDependents — get direct dependents of a file.
     * Args: [filePath: string]
     */
    router.handle('forge.workspace.getFileDependents', async (ctx) => {
        const filePath = ctx.args[0];
        if (!filePath)
            throw new Error('filePath is required for forge.workspace.getFileDependents');
        return _dependencyGraphEngine.getFileDependents(filePath);
    });
    /**
     * forge.workspace.detectCycles — detect strongly connected cyclic dependencies.
     */
    router.handle('forge.workspace.detectCycles', async () => {
        return _dependencyGraphEngine.detectCycles();
    });
    // ── Sprint 86 Phase 4: Semantic Context Retrieval IPC Handler ─────────────
    /**
     * forge.workspace.semanticSearch — retrieve context chunks scored for a prompt.
     * Args: [request: RetrievalRequest]
     */
    router.handle('forge.workspace.semanticSearch', async (ctx) => {
        const request = ctx.args[0];
        if (!request || !request.query) {
            throw new Error('RetrievalRequest with query is required for forge.workspace.semanticSearch');
        }
        return _semanticRetriever.retrieve(request);
    });
    // ── Sprint 86 Phase 5: AI Editor Actions IPC Handlers ──────────────────────
    /**
     * forge.editor.renameSymbol — generate rename workspace edit action.
     * Args: [{ symbol: string, newName: string }]
     */
    router.handle('forge.editor.renameSymbol', async (ctx) => {
        const { symbol, newName } = ctx.args[0] || {};
        if (!symbol || !newName)
            throw new Error('symbol and newName are required for forge.editor.renameSymbol');
        return _editorActionExecutor.generateRenameAction(symbol, newName);
    });
    /**
     * forge.editor.previewAction — preview diffs for an action.
     * Args: [action: EditorAction]
     */
    router.handle('forge.editor.previewAction', async (ctx) => {
        const action = ctx.args[0];
        if (!action || !action.edit)
            throw new Error('EditorAction is required for forge.editor.previewAction');
        const conflicts = await _editorActionExecutor.detectConflicts(action.edit);
        return { diffs: action.diffs, conflicts };
    });
    /**
     * forge.editor.applyWorkspaceEdit — apply an approved workspace edit action.
     * Args: [{ actionId: string }]
     */
    router.handle('forge.editor.applyWorkspaceEdit', async (ctx) => {
        const { actionId } = ctx.args[0] || {};
        if (!actionId)
            throw new Error('actionId is required for forge.editor.applyWorkspaceEdit');
        _editorActionExecutor.approve(actionId);
        return _editorActionExecutor.apply(actionId);
    });
    /**
     * forge.editor.rollbackAction — rollback applied action.
     * Args: [{ actionId: string }]
     */
    router.handle('forge.editor.rollbackAction', async (ctx) => {
        const { actionId } = ctx.args[0] || {};
        if (!actionId)
            throw new Error('actionId is required for forge.editor.rollbackAction');
        const lifecycle = _editorActionExecutor.getLifecycle(actionId);
        if (!lifecycle)
            throw new Error(`Action "${actionId}" not found for rollback`);
        return lifecycle;
    });
    // ── Sprint 86 Phase 6: Diagnostics & Quick Fix Panel IPC Handlers ─────────
    /**
     * forge.diagnostics.getAll — get all workspace diagnostics.
     * Args: [{ severity?: string[] }]
     */
    router.handle('forge.diagnostics.getAll', async (ctx) => {
        const filter = ctx.args[0]?.severity;
        return _diagnosticsAggregator.getAll(filter);
    });
    /**
     * forge.diagnostics.getForFile — get diagnostics for a specific file.
     * Args: [filePath: string]
     */
    router.handle('forge.diagnostics.getForFile', async (ctx) => {
        const filePath = ctx.args[0];
        if (!filePath)
            throw new Error('filePath is required for forge.diagnostics.getForFile');
        return _diagnosticsAggregator.getForFile(filePath);
    });
    /**
     * forge.diagnostics.setFileDiagnostics — update diagnostics for a file.
     * Args: [filePath: string, items: DiagnosticItem[]]
     */
    router.handle('forge.diagnostics.setFileDiagnostics', async (ctx) => {
        const filePath = ctx.args[0];
        const items = ctx.args[1] || [];
        _diagnosticsAggregator.setFileDiagnostics(filePath, items);
        return { success: true, count: items.length };
    });
    /**
     * forge.diagnostics.generateFix — generate AI quick fix suggestions for a diagnostic.
     * Args: [diagnostic: DiagnosticItem]
     */
    router.handle('forge.diagnostics.generateFix', async (ctx) => {
        const diagnostic = ctx.args[0];
        if (!diagnostic)
            throw new Error('DiagnosticItem is required for forge.diagnostics.generateFix');
        return _quickFixGenerator.generateFix(diagnostic);
    });
    /**
     * forge.diagnostics.applyQuickFix — apply a quick fix suggestion.
     * Args: [{ fixId: string, actionId?: string }]
     */
    router.handle('forge.diagnostics.applyQuickFix', async (ctx) => {
        const { actionId } = ctx.args[0] || {};
        if (actionId) {
            _editorActionExecutor.approve(actionId);
            return _editorActionExecutor.apply(actionId);
        }
        return { success: true };
    });
}
//# sourceMappingURL=workspace-handlers.js.map