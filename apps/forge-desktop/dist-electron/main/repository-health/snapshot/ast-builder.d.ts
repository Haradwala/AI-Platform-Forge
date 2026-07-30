import { ASTNodeInfo } from '../contracts/health-types';
export declare class ASTBuilder {
    buildASTNodes(rootPath: string, relativePaths: string[]): Promise<Map<string, ASTNodeInfo>>;
    private parseContent;
}
