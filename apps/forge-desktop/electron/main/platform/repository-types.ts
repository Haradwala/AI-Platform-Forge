export interface IRange {
  startLine: number;
  startColumn: number;
  endLine: number;
  endColumn: number;
}

export interface ISymbol {
  id: string;
  name: string;
  kind: 'class' | 'interface' | 'enum' | 'struct' | 'trait' | 'function' | 'variable' | 'constant' | 'method' | 'property' | 'namespace' | 'module';
  file: string;
  line: number;
  column: number;
  range?: IRange;
  parent?: string;
  children: string[];
  visibility?: 'public' | 'private' | 'protected' | 'internal';
  language: string;
  documentation?: string;
  annotations?: string[];
}

export interface IUnifiedCodeModel {
  symbols: ISymbol[];
  imports: string[];
  exports: string[];
  references: string[];
  diagnostics: string[];
  metadata: Record<string, any>;
}

export interface ILanguageParser {
  readonly id: string;
  readonly language: string;
  supports(filePath: string): boolean;
  parse(filePath: string, content: string): Promise<IUnifiedCodeModel> | IUnifiedCodeModel;
}

export type RepositoryQuery =
  | { type: 'findSymbol'; query: string }
  | { type: 'findReferences'; symbolName: string }
  | { type: 'findImplementations'; interfaceName: string }
  | { type: 'findCallers'; functionName: string }
  | { type: 'findDependencyPath'; from: string; to: string }
  | { type: 'findCircularDependencies' }
  | { type: 'workspaceStatistics' }
  | { type: 'findFile'; query: string }
  | { type: 'findProject'; name: string }
  | { type: 'findPackage'; name: string }
  | { type: 'findImporters'; filePath: string }
  | { type: 'findExporters'; filePath: string }
  | { type: 'findFilesByLanguage'; language: string };

export type RepositoryResult = {
  success: boolean;
  data: any;
  error?: string;
};

export type RepositoryEventListener = (event: { type: string; payload: any }) => void;

export interface IDisposable {
  dispose(): void;
}

export interface IRepositoryProvider {
  scanWorkspace(): Promise<void>;
  query(request: RepositoryQuery): Promise<RepositoryResult>;
  subscribe(listener: RepositoryEventListener): IDisposable;
}
