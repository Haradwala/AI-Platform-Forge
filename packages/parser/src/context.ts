import { IEventBus } from '@forge/core';
import { ISymbol } from './models/symbol';
import { IRelationship } from './models/relationship';
import { IDiagnostic } from './interfaces/parser';
import { ICancellationToken } from './interfaces/scheduler';

export class ParserContext {
  public readonly symbols = new Map<string, ISymbol>();
  public readonly relationships: IRelationship[] = [];
  public readonly diagnostics: IDiagnostic[] = [];

  constructor(
    public readonly workspaceId: string,
    public readonly filePath: string,
    public readonly content: string,
    public readonly eventBus: IEventBus,
    public readonly cancellationToken: ICancellationToken
  ) {}
}
