import { FileMetadata } from '../contracts/health-types';
export declare class MetadataCollector {
    collect(rootPath: string, relativePaths: string[]): Promise<Map<string, FileMetadata>>;
}
