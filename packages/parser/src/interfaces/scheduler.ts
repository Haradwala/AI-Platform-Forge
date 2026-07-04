export interface ICancellationToken {
  readonly isCancellationRequested: boolean;
  throwIfCancelled(): void;
}

export interface ICancellationTokenSource {
  readonly token: ICancellationToken;
  cancel(): void;
}

export interface IParseJob {
  readonly fileId: string;
  readonly workspaceId: string;
  readonly path: string;
  readonly priority: number;
}

export interface IParseScheduler {
  schedule(job: IParseJob): Promise<void>;
  cancelJob(fileId: string): void;
  cancelAll(): void;
}
