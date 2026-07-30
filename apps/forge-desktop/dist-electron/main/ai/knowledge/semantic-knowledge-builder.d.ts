import { IRepositoryProvider } from '../../container/service-interfaces';
export interface ISemanticLink {
    from: string;
    to: string;
    relation: 'implements' | 'references' | 'requires' | 'contains';
}
export declare class SemanticKnowledgeBuilder {
    private readonly repositoryProvider;
    constructor(repositoryProvider: IRepositoryProvider);
    buildSemanticGraph(): Promise<ISemanticLink[]>;
}
