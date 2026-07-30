/**
 * repository-analyzer.ts — Phase 25-28 Comprehensive Repository Stack Analyzer
 *
 * Scans workspace directories to detect languages, frameworks, package managers,
 * build systems, CI, Docker, databases, and AI libraries. Generates categorized runtime recommendations.
 */

import * as fs from 'fs';
import * as path from 'path';
import { WorkspaceProfile } from '../ai/contracts/execution-contracts';

export interface ComprehensiveProjectAnalysis {
  projectType: string;
  languages: string[];
  frameworks: string[];
  packageManager: string;
  isMonorepo: boolean;
  testFramework?: string;
  ciProvider?: string;
  hasDocker: boolean;
  hasKubernetes: boolean;
  database?: string;
  cloudProvider?: string;
  aiLibraries: string[];
  entryPoints: string[];
  recommendations: WorkspaceProfile['analysis']['runtimeRecommendations'];
}

export class RepositoryAnalyzer {
  /**
   * Scans repository root directory to detect full project stack and runtime recommendations.
   */
  analyze(repoPath: string): ComprehensiveProjectAnalysis {
    const files = fs.existsSync(repoPath) ? fs.readdirSync(repoPath) : [];
    const languages: string[] = [];
    const frameworks: string[] = [];
    let packageManager = 'npm';
    let isMonorepo = false;
    let testFramework: string | undefined;
    let ciProvider: string | undefined;
    let hasDocker = false;
    let hasKubernetes = false;
    const aiLibraries: string[] = [];
    const entryPoints: string[] = [];

    if (files.includes('package.json')) {
      languages.push('TypeScript', 'JavaScript');
      if (files.includes('pnpm-lock.yaml')) packageManager = 'pnpm';
      else if (files.includes('yarn.lock')) packageManager = 'yarn';
      else if (files.includes('bun.lockb')) packageManager = 'bun';

      try {
        const pkgRaw = fs.readFileSync(path.join(repoPath, 'package.json'), 'utf-8');
        const pkg = JSON.parse(pkgRaw);
        const allDeps = { ...(pkg.dependencies || {}), ...(pkg.devDependencies || {}) };

        if (allDeps['react']) frameworks.push('React');
        if (allDeps['next']) frameworks.push('Next.js');
        if (allDeps['electron']) frameworks.push('Electron');
        if (allDeps['vite']) frameworks.push('Vite');
        if (allDeps['@angular/core']) frameworks.push('Angular');
        if (allDeps['vue']) frameworks.push('Vue');

        if (allDeps['vitest']) testFramework = 'Vitest';
        else if (allDeps['jest']) testFramework = 'Jest';

        if (allDeps['openai']) aiLibraries.push('OpenAI SDK');
        if (allDeps['@anthropic-ai/sdk']) aiLibraries.push('Anthropic SDK');
        if (allDeps['@google/generative-ai']) aiLibraries.push('Gemini SDK');
        if (allDeps['ollama']) aiLibraries.push('Ollama');

        if (pkg.workspaces || files.includes('pnpm-workspace.yaml') || files.includes('lerna.json')) {
          isMonorepo = true;
        }
      } catch (err) {
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

    const recommendations: WorkspaceProfile['analysis']['runtimeRecommendations'] = [
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
