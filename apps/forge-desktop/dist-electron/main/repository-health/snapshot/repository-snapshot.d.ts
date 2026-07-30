import { RepositorySnapshot } from '../contracts/health-types';
export declare class SnapshotBuilder {
    private scanner;
    private metadataCollector;
    private astBuilder;
    private dependencyBuilder;
    buildSnapshot(rootPath: string): Promise<RepositorySnapshot>;
}
