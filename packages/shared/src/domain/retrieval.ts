export interface IRetrievalSource {
  readonly providerId: string;
  readonly confidence: number;
  readonly rawScore: number;
}

export interface IRetrievalTraceItem {
  readonly providerDecision?: string;
  readonly deduplicationHistory: string[];
  readonly rankingDecision?: string;
  readonly normalizationDetails?: Record<string, number>;
}

export interface IRetrievalTrace {
  readonly items: IRetrievalTraceItem[];
  readonly timestamp: Date;
}

export interface IRetrievalMetadata {
  readonly workspaceId: string;
  readonly fileHash?: string;
  readonly author?: string;
  readonly branch?: string;
  readonly linesCount?: number;
  readonly timestamp: Date;
}

export interface IRetrievalCandidate {
  readonly id: string;
  readonly workspaceId: string;
  readonly sources: IRetrievalSource[];
  readonly content: string;
  readonly path: string;
  readonly metadata: IRetrievalMetadata;
  
  readonly normalizedScore: number;
  readonly graphDistance: number;
  readonly keywordScore: number;
  readonly vectorScore: number;
  readonly freshnessScore: number;
  
  readonly trace: IRetrievalTrace;
}
