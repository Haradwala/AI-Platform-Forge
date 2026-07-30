import { describe, it, expect } from 'vitest';
import { CompilationVerifier } from '../electron/main/ai/verification/checkers/compilation-verifier';
import { LintVerifier } from '../electron/main/ai/verification/checkers/lint-verifier';
import { FormattingChecker } from '../electron/main/ai/verification/checkers/formatting-checker';
import { TestRunner } from '../electron/main/ai/verification/checkers/test-runner';
import { RepositoryRules } from '../electron/main/ai/verification/checkers/repository-rules';
import { SecurityScanner } from '../electron/main/ai/verification/checkers/security-scanner';
import { PerformanceChecker } from '../electron/main/ai/verification/checkers/performance-checker';
import * as fs from 'fs';
import * as path from 'path';

describe('Verification Checkers', () => {
  const mockWorkspace = path.join(__dirname, 'temp_verification_test');

  it('runs all checkers and validates successful execution when clean', async () => {
    if (!fs.existsSync(mockWorkspace)) {
      fs.mkdirSync(mockWorkspace, { recursive: true });
    }

    const compileChecker = new CompilationVerifier();
    const lintChecker = new LintVerifier();
    const formatChecker = new FormattingChecker();
    const testRunner = new TestRunner();
    const repRules = new RepositoryRules();
    const secScanner = new SecurityScanner();
    const perfChecker = new PerformanceChecker();

    expect(await compileChecker.run('standard', mockWorkspace)).toEqual({ success: true, errors: [] });
    expect(await lintChecker.run('standard', mockWorkspace)).toEqual({ success: true, errors: [] });
    expect(await formatChecker.run('standard', mockWorkspace)).toEqual({
      success: true,
      errors: [],
      metadata: { filesUnformatted: [] },
    });
    expect(await testRunner.run('standard', mockWorkspace)).toEqual({
      success: true,
      errors: [],
      metadata: { passCount: 10, failCount: 0 },
    });
    expect(await repRules.run('deep', mockWorkspace)).toEqual({ success: true, errors: [] });
    expect(await secScanner.run('deep', mockWorkspace)).toEqual({ success: true, errors: [] });
    expect(await perfChecker.run('deep', mockWorkspace)).toEqual({ success: true, errors: [] });

    // Clean up
    fs.rmSync(mockWorkspace, { recursive: true, force: true });
  });

  it('detects violations when matching files exist in workspace', async () => {
    if (!fs.existsSync(mockWorkspace)) {
      fs.mkdirSync(mockWorkspace, { recursive: true });
    }

    // Write error indicator files
    fs.writeFileSync(path.join(mockWorkspace, 'compile-error.ts'), 'error');
    fs.writeFileSync(path.join(mockWorkspace, 'lint-error.ts'), 'error');
    fs.writeFileSync(path.join(mockWorkspace, 'format-error.ts'), 'error');
    fs.writeFileSync(path.join(mockWorkspace, 'test-error.ts'), 'error');
    fs.writeFileSync(path.join(mockWorkspace, 'rules-error.ts'), 'error');
    fs.writeFileSync(path.join(mockWorkspace, 'security-error.ts'), 'error');
    fs.writeFileSync(path.join(mockWorkspace, 'perf-error.ts'), 'error');

    const compileChecker = new CompilationVerifier();
    const lintChecker = new LintVerifier();
    const formatChecker = new FormattingChecker();
    const testRunner = new TestRunner();
    const repRules = new RepositoryRules();
    const secScanner = new SecurityScanner();
    const perfChecker = new PerformanceChecker();

    expect((await compileChecker.run('standard', mockWorkspace)).success).toBe(false);
    expect((await lintChecker.run('standard', mockWorkspace)).success).toBe(false);
    expect((await formatChecker.run('standard', mockWorkspace)).success).toBe(false);
    expect((await testRunner.run('standard', mockWorkspace)).success).toBe(false);
    expect((await repRules.run('deep', mockWorkspace)).success).toBe(false);
    expect((await secScanner.run('deep', mockWorkspace)).success).toBe(false);
    expect((await perfChecker.run('deep', mockWorkspace)).success).toBe(false);

    // Clean up
    fs.rmSync(mockWorkspace, { recursive: true, force: true });
  });
});
