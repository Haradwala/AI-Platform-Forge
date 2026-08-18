import type { IWorkspaceService, IIpcRouter, IWorkspaceApplicationService } from '../../main/container/service-interfaces';
import { WorkspaceSymbolIndexer } from '../../main/ai/workspace/symbol-indexer';
import { ReferenceEngine } from '../../main/ai/workspace/reference-engine';
import { DependencyGraphEngine } from '../../main/ai/workspace/dependency-graph-engine';
import { SemanticContextRetriever } from '../../main/ai/context/semantic-retriever';
import { EditorActionExecutor } from '../../main/ai/workspace/editor-action-executor';
import { DiagnosticsAggregator } from '../../main/ai/diagnostics/diagnostics-aggregator';
import { AiQuickFixGenerator } from '../../main/ai/diagnostics/ai-quickfix-generator';
import { BackgroundAnalyzer } from '../../main/ai/diagnostics/background-analyzer';
declare const _symbolIndexer: WorkspaceSymbolIndexer;
declare const _referenceEngine: ReferenceEngine;
declare const _dependencyGraphEngine: DependencyGraphEngine;
declare const _semanticRetriever: SemanticContextRetriever;
declare const _editorActionExecutor: EditorActionExecutor;
declare const _diagnosticsAggregator: DiagnosticsAggregator;
declare const _quickFixGenerator: AiQuickFixGenerator;
declare const _backgroundAnalyzer: BackgroundAnalyzer;
/**
 * Workspace IPC handlers — binds workspace IPC channels to WorkspaceApplicationService and WorkspaceService.
 */
export declare function registerWorkspaceHandlers(router: IIpcRouter, workspaceService: IWorkspaceService, workspaceAppService?: IWorkspaceApplicationService): void;
/** Exported singletons for use by AI orchestrator and other main-process modules. */
export { _symbolIndexer as workspaceSymbolIndexer, _referenceEngine as referenceEngine, _dependencyGraphEngine as dependencyGraphEngine, _semanticRetriever as semanticRetriever, _editorActionExecutor as editorActionExecutor, _diagnosticsAggregator as diagnosticsAggregator, _quickFixGenerator as quickFixGenerator, _backgroundAnalyzer as backgroundAnalyzer, };
