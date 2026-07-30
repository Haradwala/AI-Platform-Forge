export enum MemoryLifecycleState {
  Created = 'created',
  Indexed = 'indexed',
  Retrieved = 'retrieved',
  Reinforced = 'reinforced',
  Compacted = 'compacted',
  Archived = 'archived',
  Expired = 'expired',
  Deleted = 'deleted'
}

export enum MemoryRelationshipType {
  DerivedFrom = 'derived_from',
  Contradicts = 'contradicts',
  Supports = 'supports',
  Duplicates = 'duplicates',
  CausedBy = 'caused_by',
  RelatedTo = 'related_to'
}

export interface IMemoryEdge {
  readonly type: MemoryRelationshipType;
  readonly targetRecordId: string;
}

export interface IBaseMemory {
  readonly id: string;
  readonly version: number;
  readonly revision: number;
  readonly state: MemoryLifecycleState;
  readonly confidence: number;
  readonly relationships: IMemoryEdge[];
  readonly createdBy: string;
  readonly ownerScope: 'private' | 'shared' | 'workspace' | 'global';
  readonly createdAt: Date;
  readonly lastAccessedAt: Date;
  readonly accessCount: number;
}

export interface ISemanticMemory extends IBaseMemory {
  readonly concept: string;
  readonly facts: Record<string, any>;
  readonly documentation?: string;
}

export interface IEpisodicMemory extends IBaseMemory {
  readonly sessionId: string;
  readonly conversationId?: string;
  readonly toolExecutions: Array<{ toolId: string; success: boolean }>;
  readonly failureReason?: string;
}
