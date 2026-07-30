import { IRepositoryAnalyzer } from '../registry/analyzer-registry';
import { RepositorySnapshot, AnalyzerResult, Finding, DEFAULT_HEALTH_THRESHOLDS } from '../contracts/health-types';

export class ComplexityAnalyzer implements IRepositoryAnalyzer {
  readonly name = 'complexity';

  async analyze(snapshot: RepositorySnapshot): Promise<AnalyzerResult> {
    const startTime = Date.now();
    const findings: Finding[] = [];

    for (const [fileKey, ast] of snapshot.astNodes.entries()) {
      const meta = snapshot.files.get(fileKey);
      if (!meta || meta.isTestFile) continue;

      // God Object / Oversized File (>500 LOC)
      if (meta.lineCount > DEFAULT_HEALTH_THRESHOLDS.maxFileLOC) {
        findings.push({
          id: `complexity-god-object-${fileKey}`,
          title: `God Object / Oversized File (${meta.lineCount} LOC)`,
          severity: meta.lineCount > 750 ? 'critical' : 'high',
          category: 'complexity',
          confidence: 0.95,
          file: fileKey,
          description: `File '${fileKey}' has ${meta.lineCount} LOC exceeding maximum threshold of ${DEFAULT_HEALTH_THRESHOLDS.maxFileLOC} LOC.`,
          suggestion: 'Decompose giant module into focused single-responsibility domain subservices.',
          fixStrategy: 'split-class',
          evidence: {
            matchedRules: ['MaxFileLOCRule'],
            relatedFiles: [],
            metrics: { LOC: meta.lineCount, threshold: DEFAULT_HEALTH_THRESHOLDS.maxFileLOC }
          },
          autoFixAvailable: false,
          estimatedImpact: 'high',
          timestamp: Date.now()
        });
      }

      // High Cyclomatic Complexity (>18)
      if (ast.cyclomaticComplexity > DEFAULT_HEALTH_THRESHOLDS.maxCyclomaticComplexity) {
        findings.push({
          id: `complexity-cyclomatic-${fileKey}`,
          title: `High Cyclomatic Complexity (${ast.cyclomaticComplexity})`,
          severity: 'medium',
          category: 'complexity',
          confidence: 0.9,
          file: fileKey,
          description: `File '${fileKey}' has cyclomatic complexity score of ${ast.cyclomaticComplexity}.`,
          suggestion: 'Simplify conditional logic branches into lookup tables or strategy pattern.',
          fixStrategy: 'split-class',
          evidence: {
            matchedRules: ['CyclomaticComplexityRule'],
            relatedFiles: [],
            metrics: { complexity: ast.cyclomaticComplexity }
          },
          autoFixAvailable: false,
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
