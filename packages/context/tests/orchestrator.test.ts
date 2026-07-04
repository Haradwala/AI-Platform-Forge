import { describe, it, expect } from 'vitest';
import { RetrievalOrchestrator } from '../src/retrieval/orchestrator';
import { WorkspaceRetriever } from '../src/retrieval/retrievers/workspace';
import { DocumentationRetriever } from '../src/retrieval/retrievers/doc';
import { IRetrievalPlan } from '../src/interfaces/retrieval';

describe('RetrievalOrchestrator Merging', () => {
  it('should run multiple sub-retrievers and merge candidate context files', async () => {
    const orchestrator = new RetrievalOrchestrator();
    orchestrator.registerRetriever(new WorkspaceRetriever());
    orchestrator.registerRetriever(new DocumentationRetriever());

    const plan: IRetrievalPlan = {
      workspaceId: 'w-1',
      maxGraphHopDepth: 1,
      relationKinds: [],
      searchQueries: ['readme']
    };

    const candidates = await orchestrator.retrieveAll(plan, 'package.json');

    expect(candidates.length).toBe(2);

    const docCand = candidates.find((c) => c.metadata.retrievalSource === 'documentation');
    expect(docCand).toBeDefined();
    expect(docCand?.path).toBe('README.md');

    const workspaceCand = candidates.find((c) => c.metadata.retrievalSource === 'workspace');
    expect(workspaceCand).toBeDefined();
    expect(workspaceCand?.path).toBe('package.json');
  });
});
