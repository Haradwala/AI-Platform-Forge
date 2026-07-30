import { describe, it, expect, vi } from 'vitest';
import { VerificationPipeline } from '../electron/main/ai/verification/verification-pipeline';
import type { IVerificationChecker } from '../electron/main/ai/verification/verification-types';
import type { IDesktopLogger, IDesktopEventBus } from '../electron/main/container/service-interfaces';

describe('VerificationPipeline', () => {
  it('correctly executes checkers relevant to the specified policy', async () => {
    const mockCompile: IVerificationChecker = {
      name: 'CompilationVerifier',
      run: vi.fn().mockResolvedValue({ success: true, errors: [] }),
    };
    const mockLint: IVerificationChecker = {
      name: 'LintVerifier',
      run: vi.fn().mockResolvedValue({ success: true, errors: [] }),
    };
    const mockFormat: IVerificationChecker = {
      name: 'FormattingChecker',
      run: vi.fn().mockResolvedValue({ success: true, errors: [], metadata: { filesUnformatted: [] } }),
    };
    const mockTest: IVerificationChecker = {
      name: 'TestRunner',
      run: vi.fn().mockResolvedValue({ success: true, errors: [], metadata: { passCount: 5, failCount: 0 } }),
    };
    const mockRules: IVerificationChecker = {
      name: 'RepositoryRules',
      run: vi.fn().mockResolvedValue({ success: true, errors: [] }),
    };
    const mockSecurity: IVerificationChecker = {
      name: 'SecurityScanner',
      run: vi.fn().mockResolvedValue({ success: true, errors: [] }),
    };
    const mockPerf: IVerificationChecker = {
      name: 'PerformanceChecker',
      run: vi.fn().mockResolvedValue({ success: true, errors: [] }),
    };

    const mockEventBus = {
      emit: vi.fn(),
    } as unknown as IDesktopEventBus;

    const mockLogger = {
      info: vi.fn(),
      debug: vi.fn(),
      warn: vi.fn(),
      error: vi.fn(),
    } as unknown as IDesktopLogger;

    const pipeline = new VerificationPipeline(
      mockCompile,
      mockLint,
      mockFormat,
      mockTest,
      mockRules,
      mockSecurity,
      mockPerf,
      mockEventBus,
      mockLogger
    );

    // Test 'quick' policy: only Compile, Lint, Format should run
    const quickReport = await pipeline.run('quick', '/mock/workspace');
    expect(quickReport.success).toBe(true);
    expect(mockCompile.run).toHaveBeenCalled();
    expect(mockLint.run).toHaveBeenCalled();
    expect(mockFormat.run).toHaveBeenCalled();
    expect(mockTest.run).not.toHaveBeenCalled();
    expect(mockRules.run).not.toHaveBeenCalled();

    // Test 'deep' policy: all checkers should run
    vi.clearAllMocks();
    const deepReport = await pipeline.run('deep', '/mock/workspace');
    expect(deepReport.success).toBe(true);
    expect(mockCompile.run).toHaveBeenCalled();
    expect(mockLint.run).toHaveBeenCalled();
    expect(mockFormat.run).toHaveBeenCalled();
    expect(mockTest.run).toHaveBeenCalled();
    expect(mockRules.run).toHaveBeenCalled();
    expect(mockSecurity.run).toHaveBeenCalled();
    expect(mockPerf.run).toHaveBeenCalled();
  });
});
