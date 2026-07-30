import { ASTNodeInfo } from '../contracts/health-types';
export declare class DependencyBuilder {
    buildDependencyGraph(rootPath: string, astNodes: Map<string, ASTNodeInfo>): {
        dependencyGraph: Map<string, Set<string>>;
        reverseDependencyGraph: Map<string, Set<string>>;
    };
}
