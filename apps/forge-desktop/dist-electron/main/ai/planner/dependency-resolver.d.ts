export interface IDependencyRelation {
    readonly file: string;
    readonly dependsOn: string[];
}
export declare class DependencyResolver {
    resolveDependencies(filesList: string[]): IDependencyRelation[];
}
