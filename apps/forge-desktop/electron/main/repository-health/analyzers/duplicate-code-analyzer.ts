import { IRepositoryAnalyzer } from '../registry/analyzer-registry';
import { RepositorySnapshot, AnalyzerResult, Finding } from '../contracts/health-types';

export class DuplicateCodeAnalyzer implements IRepositoryAnalyzer {
  readonly name = 'duplicate-code';

  async analyze(snapshot: RepositorySnapshot): Promise<AnalyzerResult> {
    const startTime = Date.now();
    const findings: Finding[] = [];
    const hashMap = new Map<string, string[]>();

    for (const [fileKey, meta] of snapshot.files.entries()) {
      if (meta.isTestFile || meta.lineCount < 10) continue;

      if (!hashMap.has(meta.hash)) {
        hashMap.set(meta.hash, []);
      }
      hashMap.get(meta.hash)?.push(fileKey);
    }

    for (const [hash, fileList] of hashMap.entries()) {
      if (fileList.length > 1) {
        findings.push({
          id: `dup-hash-${hash.substring(0, 8)}`,
          title: `Identical Duplicate Files Detected (${fileList.length} files)`,
          severity: 'high',
          category: 'duplicate',
          confidence: 0.98,
          file: fileList[0],
          description: `Identical content hash found in files: ${fileList.join(', ')}`,
          suggestion: 'Consolidate duplicate implementations into a shared module or export.',
          fixStrategy: 'merge-helper',
          evidence: {
            matchedRules: ['ContentHashMatchRule'],
            relatedFiles: fileList,
            metrics: { duplicateCount: fileList.length }
          },
          autoFixAvailable: true,
          estimatedImpact: 'high',
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
