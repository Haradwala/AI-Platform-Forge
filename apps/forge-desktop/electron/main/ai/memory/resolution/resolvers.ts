/**
 * resolvers.ts
 *
 * Modular Reference Resolvers for Context Resolution Service.
 * Implements IReferenceResolver interface and ResolverChain pattern.
 */

import type { ISessionServices, SelectionContext } from '../../session/session-context-manager';
import type { ResolvedEntityBinding, Resolution } from './context-resolution-service';
import { ExecutionEntityExtractor } from '../extraction/execution-entity-extractor';
import { ExecutionResultKind } from '../../contracts/execution-result-kind';

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

const extractor = new ExecutionEntityExtractor();

function extractTargetValue(entity: any): string | undefined {
  if (!entity) return undefined;
  const list = Array.isArray(entity) ? entity : (Array.isArray(entity.value) ? entity.value : (Array.isArray(entity.results) ? entity.results : (Array.isArray(entity.files) ? entity.files : null)));
  if (list && list.length > 0) {
    const first = list[0];
    if (typeof first === 'string' && first !== 'search_results' && first !== 'file_list') return first;
    if (first && typeof first.filePath === 'string') return first.filePath;
    if (first && typeof first.file === 'string') return first.file;
  }
  if (typeof entity.filePath === 'string') return entity.filePath;
  if (typeof entity.path === 'string') return entity.path;
  if (typeof entity.key === 'string' && entity.key !== 'search_results' && entity.key !== 'file_list' && entity.key !== 'file_count' && entity.key !== 'file') return entity.key;
  if (typeof entity.value === 'string' && !entity.value.includes('\n') && !entity.value.startsWith('{') && !entity.value.startsWith('<')) return entity.value;
  return undefined;
}

function getAvailableItems(session: ISessionServices): { items: string[]; collection: 'search_results' | 'file_list' } | null {
  const state = session.getState ? session.getState() : null;
  const events = session.execution ? session.execution.getEvents() : [];

  if (session.selectionContext?.items && session.selectionContext.items.length > 0) {
    return { items: session.selectionContext.items as string[], collection: 'search_results' };
  }

  if ((state as any)?.candidateResults && Array.isArray((state as any).candidateResults) && (state as any).candidateResults.length > 0) {
    return { items: (state as any).candidateResults, collection: 'search_results' };
  }

  if (state?.lastSearchResult?.results && state.lastSearchResult.results.length > 0) {
    const items = state.lastSearchResult.results.map((r) => r.filePath).filter((f) => typeof f === 'string' && f.trim().length > 0);
    if (items.length > 0) {
      return { items, collection: 'search_results' };
    }
  }

  const searchEntity: any = state?.activeEntities?.searchResults
    || session.entities?.getLatest(ExecutionResultKind.SEARCH_RESULTS)
    || extractor.getLatestEntity(events, 'search_results');
  if (searchEntity) {
    const list = Array.isArray(searchEntity.value) ? searchEntity.value : (Array.isArray(searchEntity.results) ? searchEntity.results : []);
    const items = list.map((i: any) => (typeof i === 'string' ? i : i?.filePath || i?.file || i?.name)).filter((f: any) => typeof f === 'string' && f.trim().length > 0);
    if (items.length > 0) {
      return { items, collection: 'search_results' };
    }
  }

  const fileListEntity: any = state?.activeEntities?.fileList
    || session.entities?.getLatest(ExecutionResultKind.FILE_LIST)
    || extractor.getLatestEntity(events, 'file_list');
  if (fileListEntity) {
    const list = Array.isArray(fileListEntity.value) ? fileListEntity.value : (Array.isArray(fileListEntity.files) ? fileListEntity.files : []);
    const items = list.map((i: any) => (typeof i === 'string' ? i : i?.filePath || i?.file || i?.name)).filter((f: any) => typeof f === 'string' && f.trim().length > 0);
    if (items.length > 0) {
      return { items, collection: 'file_list' };
    }
  }

  return null;
}

// 1. Pronoun Resolver ("it", "them", "that file", "this file", "that section", "open it", "summarize it", "explain it")
export class PronounResolver implements IReferenceResolver {
  canResolve(prompt: string): boolean {
    const p = prompt.toLowerCase();
    return /\b(it|them|those|these files|those files|that file|that document|this file|that section|that part|open it|summarize it|explain it)\b/i.test(p);
  }

  resolve(prompt: string, session: ISessionServices, current: ResolutionResult): ResolutionResult {
    const p = prompt.toLowerCase();
    const state = session.getState ? session.getState() : null;
    const events = session.execution ? session.execution.getEvents() : [];
    const bindings = [...current.entityBindings];
    let resolvedPrompt = current.resolvedPrompt;
    let hasResolved = current.hasResolved;
    let resolution = current.resolution;

    if (/\b(them|those|these files|those files)\b/i.test(p)) {
      const available = getAvailableItems(session);
      if (available) {
        bindings.push({
          referenceTerm: 'them',
          category: available.collection,
          resolvedValue: available.items,
          turnId: '',
        });
        const listStr = available.items.slice(0, 50).join(', ');
        resolvedPrompt = `${resolvedPrompt} (Referring to previously found files: [${listStr}])`;
        hasResolved = true;
        resolution = { type: 'collection', items: available.items };
      }
    }

    if (/\b(it|that file|that document|this file|that section|that part|open it|summarize it|explain it)\b/i.test(p)) {
      const activeDocumentPath: string | null = state?.activeDocument?.filePath ?? null;
      const searchResultsEntity = state?.activeEntities?.searchResults
        || session.entities?.getLatest(ExecutionResultKind.SEARCH_RESULTS)
        || extractor.getLatestEntity(events, 'search_results');
      const fileContentEntity = state?.activeEntities?.fileContent
        || session.entities?.getLatest(ExecutionResultKind.FILE_CONTENT)
        || extractor.getLatestEntity(events, 'file_content');
      const fileListEntity = state?.activeEntities?.fileList
        || session.entities?.getLatest(ExecutionResultKind.FILE_LIST)
        || extractor.getLatestEntity(events, 'file_list');

      let targetKey: string | undefined;
      let chosenCategory = 'file_content';
      const lastActionKind = state?.lastActionKind ?? null;

      if (lastActionKind === ExecutionResultKind.FILE_CONTENT && activeDocumentPath) {
        targetKey = activeDocumentPath;
        chosenCategory = 'file_content';
      } else if (lastActionKind === ExecutionResultKind.SEARCH_RESULTS && searchResultsEntity) {
        targetKey = extractTargetValue(searchResultsEntity);
        chosenCategory = 'search_results';
      } else if (activeDocumentPath) {
        targetKey = activeDocumentPath;
        chosenCategory = 'file_content';
      } else if (searchResultsEntity) {
        targetKey = extractTargetValue(searchResultsEntity);
        chosenCategory = 'search_results';
      } else if (fileContentEntity) {
        targetKey = extractTargetValue(fileContentEntity);
        chosenCategory = 'file_content';
      } else if (fileListEntity) {
        targetKey = extractTargetValue(fileListEntity);
        chosenCategory = 'file_list';
      }

      if (targetKey) {
        bindings.push({
          referenceTerm: 'it',
          category: chosenCategory,
          resolvedValue: targetKey,
          turnId: '',
        });
        resolvedPrompt = `${resolvedPrompt} (Referring to document: ${targetKey})`;
        hasResolved = true;
        resolution = { type: 'document', path: targetKey };
      }
    }

    return { resolvedPrompt, entityBindings: bindings, hasResolved, resolution };
  }
}

const ORDINAL_MAP: Record<string, number> = {
  first: 0, '1st': 0,
  second: 1, '2nd': 1,
  third: 2, '3rd': 2,
  fourth: 3, '4th': 3,
  fifth: 4, '5th': 4,
  sixth: 5, '6th': 5,
  seventh: 6, '7th': 6,
  eighth: 7, '8th': 7,
  ninth: 8, '9th': 8,
  tenth: 9, '10th': 9,
};

// 2. Ordinal Resolver ("first one", "second package.json", "the third one", "number 3", "#3")
export class OrdinalResolver implements IReferenceResolver {
  canResolve(prompt: string, session: ISessionServices): boolean {
    const p = prompt.toLowerCase();
    const hasOrdinalPattern = /\b(first|second|third|fourth|fifth|sixth|seventh|eighth|ninth|tenth|1st|2nd|3rd|4th|5th|6th|7th|8th|9th|10th|number\s*\d+|#\d+)\b/i.test(p);
    if (!hasOrdinalPattern) return false;
    const available = getAvailableItems(session);
    return available !== null;
  }

  resolve(prompt: string, session: ISessionServices, current: ResolutionResult): ResolutionResult {
    const p = prompt.toLowerCase();
    const bindings = [...current.entityBindings];
    let resolvedPrompt = current.resolvedPrompt;
    let hasResolved = current.hasResolved;
    let resolution = current.resolution;

    const available = getAvailableItems(session);
    if (!available) return current;

    let targetIndex: number | null = null;
    let referenceTerm = '';

    const wordMatch = p.match(/\b(first|second|third|fourth|fifth|sixth|seventh|eighth|ninth|tenth|1st|2nd|3rd|4th|5th|6th|7th|8th|9th|10th)\b/i);
    if (wordMatch) {
      const term = wordMatch[1].toLowerCase();
      if (term in ORDINAL_MAP) {
        targetIndex = ORDINAL_MAP[term];
        referenceTerm = wordMatch[0];
      }
    }

    if (targetIndex === null) {
      const numMatch = p.match(/\b(?:number|#)\s*(\d+)\b/i) || p.match(/\b(\d+)(?:st|nd|rd|th)\b/i);
      if (numMatch) {
        targetIndex = parseInt(numMatch[1], 10) - 1;
        referenceTerm = numMatch[0];
      }
    }

    if (targetIndex !== null && targetIndex >= 0 && targetIndex < available.items.length) {
      const targetPath = available.items[targetIndex];
      bindings.push({
        referenceTerm: referenceTerm || `index_${targetIndex + 1}`,
        category: available.collection,
        resolvedValue: targetPath,
        turnId: '',
      });
      resolvedPrompt = `${resolvedPrompt} (Referring to document: ${targetPath})`;
      hasResolved = true;
      resolution = { type: 'document', path: targetPath, index: targetIndex };

      if (session.setSelectionContext) {
        session.setSelectionContext({
          activeCollection: available.collection,
          items: available.items,
          selectedIndex: targetIndex,
          selectedItem: targetPath,
        });
      }
    }

    return { resolvedPrompt, entityBindings: bindings, hasResolved, resolution };
  }
}

// 3. Relative Resolver ("next", "previous", "prev", "last")
export class RelativeResolver implements IReferenceResolver {
  canResolve(prompt: string, session: ISessionServices): boolean {
    const p = prompt.toLowerCase();
    const hasRelativeWord = /\b(next|previous|prev|last)\b/i.test(p);
    if (!hasRelativeWord) return false;
    const available = getAvailableItems(session);
    return available !== null;
  }

  resolve(prompt: string, session: ISessionServices, current: ResolutionResult): ResolutionResult {
    const p = prompt.toLowerCase();
    const bindings = [...current.entityBindings];
    let resolvedPrompt = current.resolvedPrompt;
    let hasResolved = current.hasResolved;
    let resolution = current.resolution;

    const available = getAvailableItems(session);
    if (!available) return current;

    const selectionCtx = session.selectionContext;
    let targetIndex = selectionCtx ? selectionCtx.selectedIndex : 0;

    if (/\b(next)\b/i.test(p)) {
      targetIndex = selectionCtx ? Math.min(selectionCtx.selectedIndex + 1, available.items.length - 1) : 0;
    } else if (/\b(previous|prev)\b/i.test(p)) {
      targetIndex = selectionCtx ? Math.max(selectionCtx.selectedIndex - 1, 0) : 0;
    } else if (/\b(last)\b/i.test(p)) {
      targetIndex = available.items.length - 1;
    }

    if (targetIndex >= 0 && targetIndex < available.items.length) {
      const targetPath = available.items[targetIndex];
      const matchWord = (p.match(/\b(next|previous|prev|last)\b/i) || [])[0] || 'relative';

      bindings.push({
        referenceTerm: matchWord,
        category: available.collection,
        resolvedValue: targetPath,
        turnId: '',
      });
      resolvedPrompt = `${resolvedPrompt} (Referring to document: ${targetPath})`;
      hasResolved = true;
      resolution = { type: 'document', path: targetPath, index: targetIndex };

      if (session.setSelectionContext) {
        session.setSelectionContext({
          activeCollection: available.collection,
          items: available.items,
          selectedIndex: targetIndex,
          selectedItem: targetPath,
        });
      }
    }

    return { resolvedPrompt, entityBindings: bindings, hasResolved, resolution };
  }
}

// 4. Range Resolver ("first 20", "next 20", "previous 20", "last 10", "continue", "show more")
export class RangeResolver implements IReferenceResolver {
  canResolve(prompt: string): boolean {
    const p = prompt.toLowerCase();
    return /\b(first \d+|next \d+|previous \d+|last \d+|continue|show more)\b/i.test(p);
  }

  resolve(prompt: string, session: ISessionServices, current: ResolutionResult): ResolutionResult {
    const p = prompt.toLowerCase();
    const events = session.execution ? session.execution.getEvents() : [];
    const bindings = [...current.entityBindings];
    let resolvedPrompt = current.resolvedPrompt;
    let hasResolved = current.hasResolved;
    let resolution = current.resolution;

    const pageMatch = p.match(/\b(first|next|previous|last)\s+(\d+)\b/i) || p.match(/\b(continue|show more)\b/i);
    if (pageMatch) {
      const direction = pageMatch[1].toLowerCase();
      const limit = pageMatch[2] ? parseInt(pageMatch[2], 10) : 20;
      const listEntity: any = session.entities?.getLatest(ExecutionResultKind.FILE_LIST) || extractor.getLatestEntity(events, 'file_list');
      if (listEntity) {
        bindings.push({
          referenceTerm: pageMatch[0],
          category: 'pagination',
          resolvedValue: { direction, limit },
          turnId: listEntity.turnId || '',
        });
        resolvedPrompt = `${resolvedPrompt} (Pagination: ${direction} ${limit})`;
        hasResolved = true;
        resolution = { type: 'pagination', direction, limit };
      }
    }

    return { resolvedPrompt, entityBindings: bindings, hasResolved, resolution };
  }
}

// 5. Collection Resolver ("search results", "matching files", "matches", "what file", "current file")
export class CollectionResolver implements IReferenceResolver {
  canResolve(prompt: string): boolean {
    const p = prompt.toLowerCase();
    return /\b(search results|matching files|matches|what file|what file are we discussing|active file|current file)\b/i.test(p);
  }

  resolve(prompt: string, session: ISessionServices, current: ResolutionResult): ResolutionResult {
    const p = prompt.toLowerCase();
    const events = session.execution ? session.execution.getEvents() : [];
    const bindings = [...current.entityBindings];
    let resolvedPrompt = current.resolvedPrompt;
    let hasResolved = current.hasResolved;
    let resolution = current.resolution;

    if (/\b(search results|matching files|matches)\b/i.test(p)) {
      const searchEntity: any = session.entities?.getLatest(ExecutionResultKind.SEARCH_RESULTS) || extractor.getLatestEntity(events, 'search_results');
      if (searchEntity) {
        bindings.push({
          referenceTerm: 'search_results',
          category: 'search_results',
          resolvedValue: searchEntity.value,
          turnId: searchEntity.turnId || '',
        });
        hasResolved = true;
      }
    }

    if (/\b(what file|what file are we discussing|active file|current file)\b/i.test(p)) {
      const fileContentEntity = session.entities?.getLatest(ExecutionResultKind.FILE_CONTENT) || extractor.getLatestEntity(events, 'file_content');
      if (fileContentEntity) {
        const targetKey = extractTargetValue(fileContentEntity);
        if (targetKey) {
          bindings.push({
            referenceTerm: 'what_file',
            category: 'file_content',
            resolvedValue: targetKey,
            turnId: fileContentEntity.turnId || '',
          });
          resolvedPrompt = `${resolvedPrompt} (Referring to document: ${targetKey})`;
          hasResolved = true;
          resolution = { type: 'document', path: targetKey };
        }
      }
    }

    return { resolvedPrompt, entityBindings: bindings, hasResolved, resolution };
  }
}

// Backward compatibility class aliases
export class ConversationReferenceResolver extends PronounResolver {}
export class OrdinalReferenceResolver extends OrdinalResolver {}
export class PaginationReferenceResolver extends RangeResolver {}
export class SearchReferenceResolver extends CollectionResolver {}
export class FileReferenceResolver extends CollectionResolver {}

// 6. Resolver Chain
export class ResolverChain {
  private readonly resolvers: IReferenceResolver[] = [];

  constructor(resolvers?: IReferenceResolver[]) {
    this.resolvers = resolvers || [
      new PronounResolver(),
      new OrdinalResolver(),
      new RelativeResolver(),
      new RangeResolver(),
      new CollectionResolver(),
    ];
  }

  register(resolver: IReferenceResolver): void {
    this.resolvers.push(resolver);
  }

  resolve(userPrompt: string, session: ISessionServices): ResolutionResult {
    let result: ResolutionResult = {
      resolvedPrompt: userPrompt,
      entityBindings: [],
      hasResolved: false,
    };

    for (const resolver of this.resolvers) {
      if (resolver.canResolve(userPrompt, session)) {
        result = resolver.resolve(userPrompt, session, result);
      }
    }

    return result;
  }
}
