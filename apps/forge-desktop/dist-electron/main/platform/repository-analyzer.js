"use strict";
/**
 * repository-analyzer.ts — Phase 25-28 Comprehensive Repository Stack Analyzer
 *
 * Scans workspace directories to detect languages, frameworks, package managers,
 * build systems, CI, Docker, databases, and AI libraries. Generates categorized runtime recommendations.
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.RepositoryAnalyzer = void 0;
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
class RepositoryAnalyzer {
    /**
     * Scans repository root directory to detect full project stack and runtime recommendations.
     */
    analyze(repoPath) {
        const files = fs.existsSync(repoPath) ? fs.readdirSync(repoPath) : [];
        const languages = [];
        const frameworks = [];
        let packageManager = 'npm';
        let isMonorepo = false;
        let testFramework;
        let ciProvider;
        let hasDocker = false;
        let hasKubernetes = false;
        const aiLibraries = [];
        const entryPoints = [];
        if (files.includes('package.json')) {
            languages.push('TypeScript', 'JavaScript');
            if (files.includes('pnpm-lock.yaml'))
                packageManager = 'pnpm';
            else if (files.includes('yarn.lock'))
                packageManager = 'yarn';
            else if (files.includes('bun.lockb'))
                packageManager = 'bun';
            try {
                const pkgRaw = fs.readFileSync(path.join(repoPath, 'package.json'), 'utf-8');
                const pkg = JSON.parse(pkgRaw);
                const allDeps = { ...(pkg.dependencies || {}), ...(pkg.devDependencies || {}) };
                if (allDeps['react'])
                    frameworks.push('React');
                if (allDeps['next'])
                    frameworks.push('Next.js');
                if (allDeps['electron'])
                    frameworks.push('Electron');
                if (allDeps['vite'])
                    frameworks.push('Vite');
                if (allDeps['@angular/core'])
                    frameworks.push('Angular');
                if (allDeps['vue'])
                    frameworks.push('Vue');
                if (allDeps['vitest'])
                    testFramework = 'Vitest';
                else if (allDeps['jest'])
                    testFramework = 'Jest';
                if (allDeps['openai'])
                    aiLibraries.push('OpenAI SDK');
                if (allDeps['@anthropic-ai/sdk'])
                    aiLibraries.push('Anthropic SDK');
                if (allDeps['@google/generative-ai'])
                    aiLibraries.push('Gemini SDK');
                if (allDeps['ollama'])
                    aiLibraries.push('Ollama');
                if (pkg.workspaces || files.includes('pnpm-workspace.yaml') || files.includes('lerna.json')) {
                    isMonorepo = true;
                }
            }
            catch (err) {
                // Ignore parse error
            }
        }
        if (files.includes('Cargo.toml')) {
            languages.push('Rust');
            packageManager = 'cargo';
        }
        if (files.includes('go.mod')) {
            languages.push('Go');
            packageManager = 'go';
        }
        if (files.includes('requirements.txt') || files.includes('pyproject.toml')) {
            languages.push('Python');
            packageManager = 'pip';
        }
        if (files.includes('Dockerfile') || files.includes('docker-compose.yml')) {
            hasDocker = true;
        }
        if (files.includes('k8s') || files.includes('kubernetes')) {
            hasKubernetes = true;
        }
        if (files.includes('.github')) {
            ciProvider = 'GitHub Actions';
        }
        // Detect entry points
        const candidates = ['src/index.ts', 'src/main.tsx', 'index.js', 'src/App.tsx', 'electron/main/index.ts'];
        for (const c of candidates) {
            if (fs.existsSync(path.join(repoPath, c))) {
                entryPoints.push(c);
            }
        }
        const recommendations = [
            { category: 'best_overall', runtimeId: 'claude', reason: 'Superior architectural reasoning and tool execution' },
            { category: 'best_local', runtimeId: 'ollama', reason: 'Zero network dependency and high privacy' },
            { category: 'best_coding', runtimeId: 'claude', reason: 'Optimized for TypeScript, React, and monorepo refactoring' },
            { category: 'best_vision', runtimeId: 'gemini', reason: 'Multimodal UI diagram and visual asset analysis' },
            { category: 'fastest', runtimeId: 'groq', reason: 'Ultra-low latency real-time code completion' },
            { category: 'offline', runtimeId: 'ollama', reason: 'Fully offline local executable pipeline' },
        ];
        return {
            projectType: frameworks.includes('Electron') ? 'desktop' : frameworks.includes('Next.js') ? 'web_app' : 'library',
            languages: languages.length > 0 ? languages : ['TypeScript'],
            frameworks,
            packageManager,
            isMonorepo,
            testFramework,
            ciProvider,
            hasDocker,
            hasKubernetes,
            aiLibraries,
            entryPoints: entryPoints.length > 0 ? entryPoints : ['index.ts'],
            recommendations,
        };
    }
}
exports.RepositoryAnalyzer = RepositoryAnalyzer;
//# sourceMappingURL=repository-analyzer.js.map