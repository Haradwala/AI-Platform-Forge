import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';
import { RepositoryImporter } from '../electron/main/platform/repository-importer';
import { RepositoryAnalyzer } from '../electron/main/platform/repository-analyzer';

const testLocalPath = path.join(__dirname, 'temp_import_repo');

describe('Phase 25-28 Repository Importer Suite', () => {
  beforeEach(() => {
    if (!fs.existsSync(testLocalPath)) {
      fs.mkdirSync(testLocalPath, { recursive: true });
      fs.writeFileSync(path.join(testLocalPath, 'package.json'), JSON.stringify({ name: 'imported-app', dependencies: { react: '^18.0.0', vitest: '^1.0.0' } }), 'utf-8');
      fs.writeFileSync(path.join(testLocalPath, 'pnpm-lock.yaml'), '', 'utf-8');
    }
  });

  afterEach(() => {
    if (fs.existsSync(testLocalPath)) {
      fs.rmSync(testLocalPath, { recursive: true, force: true });
    }
  });

  it('RepositoryAnalyzer detects language, package manager, and generates recommendations', () => {
    const analyzer = new RepositoryAnalyzer();
    const result = analyzer.analyze(testLocalPath);

    expect(result.languages).toContain('TypeScript');
    expect(result.packageManager).toBe('pnpm');
    expect(result.frameworks).toContain('React');
    expect(result.testFramework).toBe('Vitest');
    expect(result.recommendations.length).toBeGreaterThanOrEqual(4);
  });

  it('RepositoryImporter executes 4-stage pipeline cleanly for local project', async () => {
    const importer = new RepositoryImporter();
    const res = await importer.importRepository({
      source: 'local',
      url: testLocalPath,
      localPath: testLocalPath,
    });

    expect(res.targetPath).toBe(testLocalPath);
    expect(res.analysis.packageManager).toBe('pnpm');
    expect(res.profile.analysis.runtimeRecommendations.length).toBeGreaterThan(0);
    expect(fs.existsSync(path.join(testLocalPath, '.forge', 'workspace.json'))).toBe(true);
  });
});
