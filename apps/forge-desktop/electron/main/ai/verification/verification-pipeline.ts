import type {
  IVerificationChecker,
  IVerificationEvidence,
  VerificationPolicy,
  VerificationState,
  IVerificationReport,
  IVerificationMetrics,
} from './verification-types';
import type { IDesktopLogger, IDesktopEventBus } from '../../container/service-interfaces';

export class VerificationPipeline {
  private currentState: VerificationState = 'queued';

  constructor(
    private readonly compilationVerifier: IVerificationChecker,
    private readonly lintVerifier: IVerificationChecker,
    private readonly formattingChecker: IVerificationChecker,
    private readonly testRunner: IVerificationChecker,
    private readonly repositoryRules: IVerificationChecker,
    private readonly securityScanner: IVerificationChecker,
    private readonly performanceChecker: IVerificationChecker,
    private readonly eventBus: IDesktopEventBus,
    private readonly logger: IDesktopLogger
  ) {}

  getState(): VerificationState {
    return this.currentState;
  }

  async run(policy: VerificationPolicy, workspaceRoot: string | null): Promise<IVerificationReport> {
    this.logger.info(`[VerificationPipeline] Starting verification using policy: "${policy}"`);
    this.currentState = 'queued';
    this.emitStateChange();

    const startTime = Date.now();
    const metrics: IVerificationMetrics = {
      compileTimeMs: 0,
      lintTimeMs: 0,
      testTimeMs: 0,
      scanTimeMs: 0,
    };

    let compResult = { success: true, errors: [] as IVerificationEvidence[] };
    let lintResult = { success: true, errors: [] as IVerificationEvidence[] };
    let formatResult = { success: true, filesUnformatted: [] as string[] };
    let testResult = { success: true, passCount: 0, failCount: 0, errors: [] as IVerificationEvidence[] };
    let securityResult = { success: true, issues: [] as IVerificationEvidence[] };
    let archResult = { success: true, issues: [] as IVerificationEvidence[] };
    let perfResult = { success: true, issues: [] as IVerificationEvidence[] };
    const suggestions: string[] = [];

    // Phase 1: Compilation
    this.currentState = 'compiling';
    this.emitStateChange();
    const compStart = Date.now();
    try {
      const run = await this.compilationVerifier.run(policy, workspaceRoot);
      compResult = { success: run.success, errors: run.errors };
      if (!run.success) suggestions.push('Fix compiler and type errors reported in source files.');
    } catch (err: any) {
      compResult = {
        success: false,
        errors: [
          {
            file: 'workspace',
            line: 0,
            column: 0,
            message: err.message,
            severity: 'error',
            source: 'compiler',
          },
        ],
      };
    }
    metrics.compileTimeMs = Date.now() - compStart;

    // Phase 2: Linting & Formatting
    this.currentState = 'linting';
    this.emitStateChange();
    const lintStart = Date.now();
    try {
      const run = await this.lintVerifier.run(policy, workspaceRoot);
      const fmtRun = await this.formattingChecker.run(policy, workspaceRoot);

      lintResult = { success: run.success, errors: run.errors };
      formatResult = { success: fmtRun.success, filesUnformatted: fmtRun.metadata?.filesUnformatted || [] };

      if (!run.success) suggestions.push('Review ESLint/Biome rules diagnostics.');
      if (!fmtRun.success) suggestions.push('Format target files using Prettier/Biome to clear formatting issues.');
    } catch (err: any) {
      lintResult = {
        success: false,
        errors: [
          {
            file: 'workspace',
            line: 0,
            column: 0,
            message: err.message,
            severity: 'error',
            source: 'linter',
          },
        ],
      };
    }
    metrics.lintTimeMs = Date.now() - lintStart;

    // Phase 3: Testing
    if (policy === 'standard' || policy === 'deep' || policy === 'release') {
      this.currentState = 'testing';
      this.emitStateChange();
      const testStart = Date.now();
      try {
        const run = await this.testRunner.run(policy, workspaceRoot);
        testResult = {
          success: run.success,
          passCount: run.metadata?.passCount || 0,
          failCount: run.metadata?.failCount || 0,
          errors: run.errors,
        };
        if (!run.success) suggestions.push('Fix failing tests in target directories.');
      } catch (err: any) {
        testResult = {
          success: false,
          passCount: 0,
          failCount: 1,
          errors: [
            {
              file: 'tests',
              line: 0,
              column: 0,
              message: err.message,
              severity: 'error',
              source: 'tester',
            },
          ],
        };
      }
      metrics.testTimeMs = Date.now() - testStart;
    }

    // Phase 4: Scanning (Security, Architecture, Performance)
    if (policy === 'deep' || policy === 'release') {
      this.currentState = 'scanning';
      this.emitStateChange();
      const scanStart = Date.now();

      // Security
      try {
        const run = await this.securityScanner.run(policy, workspaceRoot);
        securityResult = { success: run.success, issues: run.errors };
        if (!run.success) suggestions.push('Verify keys / dangerous eval usages to resolve security risks.');
      } catch (err: any) {
        securityResult = {
          success: false,
          issues: [
            {
              file: 'security',
              line: 0,
              column: 0,
              message: err.message,
              severity: 'error',
              source: 'security',
            },
          ],
        };
      }

      // Architecture
      try {
        const run = await this.repositoryRules.run(policy, workspaceRoot);
        archResult = { success: run.success, issues: run.errors };
        if (!run.success) suggestions.push('Fix import dependencies cycle loops or naming pattern violations.');
      } catch (err: any) {
        archResult = {
          success: false,
          issues: [
            {
              file: 'architecture',
              line: 0,
              column: 0,
              message: err.message,
              severity: 'error',
              source: 'architecture',
            },
          ],
        };
      }

      // Performance
      try {
        const run = await this.performanceChecker.run(policy, workspaceRoot);
        perfResult = { success: run.success, issues: run.errors };
      } catch (err: any) {
        perfResult = {
          success: false,
          issues: [
            {
              file: 'performance',
              line: 0,
              column: 0,
              message: err.message,
              severity: 'error',
              source: 'performance',
            },
          ],
        };
      }

      metrics.scanTimeMs = Date.now() - scanStart;
    }

    const overallSuccess =
      compResult.success &&
      lintResult.success &&
      formatResult.success &&
      testResult.success &&
      securityResult.success &&
      archResult.success &&
      perfResult.success;

    this.currentState = overallSuccess ? 'completed' : 'failed';
    this.emitStateChange();

    const durationMs = Date.now() - startTime;
    this.logger.info(`[VerificationPipeline] Verification complete. Success: ${overallSuccess} in ${durationMs}ms`);

    return {
      success: overallSuccess,
      state: this.currentState,
      policy,
      durationMs,
      compilation: compResult,
      lint: lintResult,
      test: testResult,
      format: formatResult,
      security: securityResult,
      architecture: archResult,
      performance: perfResult,
      suggestions,
    };
  }

  private emitStateChange(): void {
    this.eventBus.emit('startup:stage-changed', { stage: `verification:${this.currentState}` });
  }
}
