"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SemanticKnowledgeBuilder = void 0;
class SemanticKnowledgeBuilder {
    repositoryProvider;
    constructor(repositoryProvider) {
        this.repositoryProvider = repositoryProvider;
    }
    async buildSemanticGraph() {
        const links = [];
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
exports.SemanticKnowledgeBuilder = SemanticKnowledgeBuilder;
//# sourceMappingURL=semantic-knowledge-builder.js.map