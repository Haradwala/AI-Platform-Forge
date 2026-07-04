import { describe, it, expect } from 'vitest';
import { IgnoreRuleManager } from '../src/ignore';
import * as fs from 'fs/promises';
import * as path from 'path';

describe('IgnoreRuleManager Unit Tests', () => {
  it('should ignore default patterns correctly', () => {
    const manager = new IgnoreRuleManager();

    expect(manager.isIgnored('.git/config')).toBe(true);
    expect(manager.isIgnored('node_modules/lodash/index.js')).toBe(true);
    expect(manager.isIgnored('node_modules/index.d.ts')).toBe(true);
    expect(manager.isIgnored('.venv/bin/python')).toBe(true);
    expect(manager.isIgnored('dist/index.js')).toBe(true);
    expect(manager.isIgnored('src/main.ts')).toBe(false);
  });

  it('should compile custom globs and evaluate relative paths correctly', () => {
    const manager = new IgnoreRuleManager([]);

    manager.addPatterns(['*.log', 'temp/']);

    expect(manager.isIgnored('debug.log')).toBe(true);
    expect(manager.isIgnored('src/errors.log')).toBe(true);
    expect(manager.isIgnored('temp/cache.json')).toBe(true);
    expect(manager.isIgnored('src/temp/cache.json')).toBe(true);
    expect(manager.isIgnored('src/main.ts')).toBe(false);
  });

  it('should handle absolute root paths correctly', () => {
    const manager = new IgnoreRuleManager([]);

    manager.addPatterns(['/build']);

    expect(manager.isIgnored('build/main.js')).toBe(true);
    expect(manager.isIgnored('src/build/main.js')).toBe(false);
  });

  it('should load gitignore rules from workspace paths', async () => {
    const tmpDir = path.join(__dirname, 'tmp_ignore_test');
    await fs.mkdir(tmpDir, { recursive: true });
    
    await fs.writeFile(
      path.join(tmpDir, '.gitignore'),
      `# mock gitignore\n/build/\n*.tmp\n`
    );

    const manager = new IgnoreRuleManager([]);
    await manager.loadGitignore(tmpDir);

    expect(manager.isIgnored('build/index.js')).toBe(true);
    expect(manager.isIgnored('src/build/index.js')).toBe(false);
    expect(manager.isIgnored('cache.tmp')).toBe(true);
    expect(manager.isIgnored('src/cache.tmp')).toBe(true);

    await fs.rm(tmpDir, { recursive: true, force: true });
  });
});
