import { ILanguageParser } from './repository-types';
import { SymbolIndexService } from './symbol-index';
import { DependencyGraphService } from './dependency-graph';
import { RepositoryEventService } from './repository-events';
export declare class IncrementalIndexerService {
    private readonly parser;
    private readonly symbolsIndex;
    private readonly graph;
    private readonly eventService;
    constructor(parser: ILanguageParser, symbolsIndex: SymbolIndexService, graph: DependencyGraphService, eventService: RepositoryEventService);
    indexFile(filePath: string): Promise<void>;
}
