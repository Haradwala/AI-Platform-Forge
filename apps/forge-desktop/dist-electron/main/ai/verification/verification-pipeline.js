"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VerificationPipeline = void 0;
class VerificationPipeline {
    compilationVerifier;
    lintVerifier;
    formattingChecker;
    testRunner;
    repositoryRules;
    securityScanner;
    performanceChecker;
    eventBus;
    logger;
    currentState = 'queued';
    constructor(compilationVerifier, lintVerifier, formattingChecker, testRunner, repositoryRules, securityScanner, performanceChecker, eventBus, logger) {
        this.compilationVerifier = compilationVerifier;
        this.lintVerifier = lintVerifier;
        this.formattingChecker = formattingChecker;
        this.testRunner = testRunner;
        this.repositoryRules = repositoryRules;
        this.securityScanner = securityScanner;
        this.performanceChecker = performanceChecker;
        this.eventBus = eventBus;
        this.logger = logger;
    }
    getState() {
        return this.currentState;
    }
    async run(policy, workspaceRoot) {
        this.logger.info(`[VerificationPipeline] Starting verification using policy: "${policy}"`);
        this.currentState = 'queued';
        this.emitStateChange();
        const startTime = Date.now();
        const metrics = {
            compileTimeMs: 0,
            lintTimeMs: 0,
            testTimeMs: 0,
            scanTimeMs: 0,
        };
        let compResult = { success: true, errors: [] };
        let lintResult = { success: true, errors: [] };
        let formatResult = { success: true, filesUnformatted: [] };
        let testResult = { success: true, passCount: 0, failCount: 0, errors: [] };
        let securityResult = { success: true, issues: [] };
        let archResult = { success: true, issues: [] };
        let perfResult = { success: true, issues: [] };
        const suggestions = [];
        // Phase 1: Compilation
        this.currentState = 'compiling';
        this.emitStateChange();
        const compStart = Date.now();
        try {
            const run = await this.compilationVerifier.run(policy, workspaceRoot);
            compResult = { success: run.success, errors: run.errors };
            if (!run.success)
                suggestions.push('Fix compiler and type errors reported in source files.');
        }
        catch (err) {
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
            if (!run.success)
                suggestions.push('Review ESLint/Biome rules diagnostics.');
            if (!fmtRun.success)
                suggestions.push('Format target files using Prettier/Biome to clear formatting issues.');
        }
        catch (err) {
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
                if (!run.success)
                    suggestions.push('Fix failing tests in target directories.');
            }
            catch (err) {
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
                if (!run.success)
                    suggestions.push('Verify keys / dangerous eval usages to resolve security risks.');
            }
            catch (err) {
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
                if (!run.success)
                    suggestions.push('Fix import dependencies cycle loops or naming pattern violations.');
            }
            catch (err) {
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
            }
            catch (err) {
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
        const overallSuccess = compResult.success &&
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
    emitStateChange() {
        this.eventBus.emit('startup:stage-changed', { stage: `verification:${this.currentState}` });
    }
}
exports.VerificationPipeline = VerificationPipeline;
//# sourceMappingURL=verification-pipeline.js.map