import { IRepositoryProvider } from '../../container/service-interfaces';

export interface ISemanticLink {
  from: string;
  to: string;
  relation: 'implements' | 'references' | 'requires' | 'contains';
}

export class SemanticKnowledgeBuilder {
  constructor(private readonly repositoryProvider: IRepositoryProvider) {}

  async buildSemanticGraph(): Promise<ISemanticLink[]> {
    const links: ISemanticLink[] = [];

    const symbolsResult = await this.repositoryProvider.query({ type: 'findSymbol', query: '' });
    if (symbolsResult.success && Array.isArray(symbolsResult.data)) {
      for (const sym of symbolsResult.data) {
        if (sym.parent) {
          links.push({
            from: sym.name,
            to: sym.parent,
            relation: 'implements',
          });
        }

        const refsResult = await this.repositoryProvider.query({ type: 'findReferences', symbolName: sym.name });
        if (refsResult.success && Array.isArray(refsResult.data)) {
          for (const refFile of refsResult.data) {
            links.push({
              from: refFile,
              to: sym.name,
              relation: 'references',
            });
          }
        }
      }
    }

    return links;
  }
}
