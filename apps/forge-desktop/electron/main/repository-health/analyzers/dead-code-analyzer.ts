import { IRepositoryAnalyzer } from '../registry/analyzer-registry';
import { RepositorySnapshot, AnalyzerResult, Finding } from '../contracts/health-types';

export class DeadCodeAnalyzer implements IRepositoryAnalyzer {
  readonly name = 'dead-code';

  async analyze(snapshot: RepositorySnapshot): Promise<AnalyzerResult> {
    const startTime = Date.now();
    const findings: Finding[] = [];

    for (const [fileKey, dependents] of snapshot.reverseDependencyGraph.entries()) {
      const fileMeta = snapshot.files.get(fileKey);
      if (!fileMeta || fileMeta.isTestFile) continue;

      // Unused file (0 dependents and not entry point index.ts/main)
      if (dependents.size === 0 && !fileKey.includes('index.') && !fileKey.includes('main.')) {
        findings.push({
          id: `dead-file-${fileKey}`,
          title: `Unused File Candidate: ${fileKey}`,
          severity: 'medium',
          category: 'dead-code',
          confidence: 0.85,
          file: fileKey,
          description: `File '${fileKey}' has 0 internal dependents importing it.`,
          suggestion: 'Safe candidate to inspect and remove if no external runtime loads it dynamically.',
          fixStrategy: 'delete-file',
          evidence: {
            matchedRules: ['ZeroDependentsRule'],
            relatedFiles: [],
            metrics: { dependentsCount: 0, LOC: fileMeta.lineCount }
          },
          autoFixAvailable: true,
          estimatedImpact: 'medium',
          timestamp: Date.now()
        });
      }
    }

    return {
      analyzerName: this.name,
      executionTimeMs: Date.now() - startTime,
      findings
    };
  }
}
