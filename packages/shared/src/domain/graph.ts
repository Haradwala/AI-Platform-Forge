import { ISourceRange } from './symbol';

export type GraphNodeKind =
  | 'workspace'
  | 'project'
  | 'package'
  | 'directory'
  | 'file'
  | 'namespace'
  | 'module'
  | 'class'
  | 'interface'
  | 'method'
  | 'function'
  | 'variable'
  | 'constant'
  | 'enum'
  | 'type_alias';

export interface IStructuredMetadata {
  readonly visibility: 'public' | 'private' | 'protected' | 'package';
  readonly language: string;
  readonly documentation?: string;
  readonly modifiers: string[];
  readonly annotations: string[];
  readonly attributes: Record<string, any>;
}

export interface IGraphNode {
  readonly id: string;
  readonly kind: GraphNodeKind;
  readonly displayName: string;
  readonly qualifiedName: string;
  readonly filePath: string;
  readonly metadata: IStructuredMetadata;
  readonly range?: ISourceRange;
  readonly hash: string;
  readonly version: number;
  readonly parserVersion: string;
  readonly schemaVersion: string;
  readonly timestamps: {
    readonly createdAt: Date;
    readonly updatedAt: Date;
  };
}

export type GraphEdgeKind =
  | 'contains'
  | 'belongs_to'
  | 'imports'
  | 'exports'
  | 'calls'
  | 'extends'
  | 'implements'
  | 'references'
  | 'defines'
  | 'throws'
  | 'returns';

export interface IGraphEdge {
  readonly id: string;
  readonly sourceId: string;
  readonly targetId: string;
  readonly kind: GraphEdgeKind;
  readonly confidence: number;
  readonly metadata: Record<string, any>;
  readonly timestamps: {
    readonly createdAt: Date;
    readonly updatedAt: Date;
  };
}
