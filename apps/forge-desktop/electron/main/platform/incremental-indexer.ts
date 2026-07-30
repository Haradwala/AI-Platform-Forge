import * as fs from 'fs';
import { ILanguageParser } from './repository-types';
import { SymbolIndexService } from './symbol-index';
import { DependencyGraphService } from './dependency-graph';
import { RepositoryEventService } from './repository-events';

export class IncrementalIndexerService {
  constructor(
    private readonly parser: ILanguageParser,
    private readonly symbolsIndex: SymbolIndexService,
    private readonly graph: DependencyGraphService,
    private readonly eventService: RepositoryEventService
  ) {}

  async indexFile(filePath: string): Promise<void> {
    try {
      this.symbolsIndex.removeSymbolsForFile(filePath);
      this.graph.removeFile(filePath);

      if (!fs.existsSync(filePath)) {
        this.eventService.emitFileUpdated(filePath, 'deleted');
        return;
      }

      const content = await fs.promises.readFile(filePath, 'utf8');
      const parsed = await this.parser.parse(filePath, content);

      this.symbolsIndex.addSymbols(parsed.symbols);
      this.graph.addImports(filePath, parsed.imports);
      this.graph.addReferences(filePath, parsed.references);

      this.eventService.emitFileUpdated(filePath, 'updated');
    } catch (err) {
      console.error(`[IncrementalIndexerService] Failed to index ${filePath}:`, err);
    }
  }
}
