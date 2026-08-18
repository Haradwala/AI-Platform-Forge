/**
 * resolvers.ts
 *
 * Modular Reference Resolvers for Context Resolution Service.
 * Implements IReferenceResolver interface and ResolverChain pattern.
 */
import type { ISessionServices } from '../../session/session-context-manager';
import type { ResolvedEntityBinding, Resolution } from './context-resolution-service';
export interface ResolutionResult {
    resolvedPrompt: string;
    entityBindings: ResolvedEntityBinding[];
    hasResolved: boolean;
    resolution?: Resolution;
}
export interface IReferenceResolver {
    canResolve(prompt: string, session: ISessionServices): boolean;
    resolve(prompt: string, session: ISessionServices, currentResult: ResolutionResult): ResolutionResult;
}
export declare class PronounResolver implements IReferenceResolver {
    canResolve(prompt: string): boolean;
    resolve(prompt: string, session: ISessionServices, current: ResolutionResult): ResolutionResult;
}
export declare class OrdinalResolver implements IReferenceResolver {
    canResolve(prompt: string, session: ISessionServices): boolean;
    resolve(prompt: string, session: ISessionServices, current: ResolutionResult): ResolutionResult;
}
export declare class RelativeResolver implements IReferenceResolver {
    canResolve(prompt: string, session: ISessionServices): boolean;
    resolve(prompt: string, session: ISessionServices, current: ResolutionResult): ResolutionResult;
}
export declare class RangeResolver implements IReferenceResolver {
    canResolve(prompt: string): boolean;
    resolve(prompt: string, session: ISessionServices, current: ResolutionResult): ResolutionResult;
}
export declare class CollectionResolver implements IReferenceResolver {
    canResolve(prompt: string): boolean;
    resolve(prompt: string, session: ISessionServices, current: ResolutionResult): ResolutionResult;
}
export declare class ConversationReferenceResolver extends PronounResolver {
}
export declare class OrdinalReferenceResolver extends OrdinalResolver {
}
export declare class PaginationReferenceResolver extends RangeResolver {
}
export declare class SearchReferenceResolver extends CollectionResolver {
}
export declare class FileReferenceResolver extends CollectionResolver {
}
export declare class ResolverChain {
    private readonly resolvers;
    constructor(resolvers?: IReferenceResolver[]);
    register(resolver: IReferenceResolver): void;
    resolve(userPrompt: string, session: ISessionServices): ResolutionResult;
}
