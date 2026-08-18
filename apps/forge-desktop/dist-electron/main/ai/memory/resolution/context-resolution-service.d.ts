/**
 * context-resolution-service.ts
 *
 * Context Resolution Service — resolves conversational references ("them", "these files",
 * "it", "that section", "the error", "how many") against the session's ExecutionDomain.
 * Returns a typed ResolvedContext object.
 */
import type { ISessionServices } from '../../session/session-context-manager';
export interface ResolvedEntityBinding {
    readonly referenceTerm: string;
    readonly category: string;
    readonly resolvedValue: unknown;
    readonly turnId: string;
}
export interface DocumentResolution {
    readonly type: 'document';
    readonly path: string;
    readonly index?: number;
}
export interface CollectionResolution {
    readonly type: 'collection';
    readonly items: string[];
}
export interface PaginationResolution {
    readonly type: 'pagination';
    readonly direction: string;
    readonly limit: number;
}
export type Resolution = DocumentResolution | CollectionResolution | PaginationResolution;
export interface ResolvedContext {
    readonly originalPrompt: string;
    readonly resolvedPrompt: string;
    readonly entityBindings: readonly ResolvedEntityBinding[];
    readonly hasResolvedReferences: boolean;
    readonly resolution?: Resolution;
}
export interface IContextResolutionService {
    resolve(userPrompt: string, session: ISessionServices): ResolvedContext;
}
import { ResolverChain } from './resolvers';
export declare class ContextResolutionService implements IContextResolutionService {
    private readonly chain;
    constructor(chain?: ResolverChain);
    resolve(userPrompt: string, session: ISessionServices): ResolvedContext;
}
