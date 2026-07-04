import { IParseJob, ICancellationToken } from './scheduler';
import { IParseResult } from './parser';

export interface IParseWorkerPool {
  execute(job: IParseJob, cancellationToken: ICancellationToken): Promise<IParseResult>;
  shutdown(): Promise<void>;
}
