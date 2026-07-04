import { describe, it, expect } from 'vitest';
import { WorkspaceScanner } from '../src/scanner';
import { IgnoreRuleManager } from '../src/ignore';
import { FileWatcher } from '../src/watcher';
import { EventBus } from '@forge/core';
import * as fs from 'fs/promises';
import * as path from 'path';
import { IWorkspaceFile } from '@forge/shared';

describe('WorkspaceScanner Unit Tests', () => {
  it('should recursively crawl directories, respect ignore rules, and return rich WorkspaceFile objects', async () => {
    const tmpDir = path.join(__dirname, 'tmp_scanner_test');
    await fs.mkdir(path.join(tmpDir, 'src/components'), { recursive: true });
    await fs.mkdir(path.join(tmpDir, 'node_modules/lodash'), { recursive: true });

    await fs.writeFile(path.join(tmpDir, 'src/main.ts'), 'console.log("hello");');
    await fs.writeFile(path.join(tmpDir, 'src/components/button.tsx'), 'export const Button = () => null;');
    await fs.writeFile(path.join(tmpDir, 'node_modules/lodash/index.js'), 'module.exports = {};');
    await fs.writeFile(path.join(tmpDir, 'debug.log'), 'error logs...');

    const ignore = new IgnoreRuleManager(['node_modules', '*.log']);
    const scanner = new WorkspaceScanner();
    const files: IWorkspaceFile[] = [];

    for await (const file of scanner.scan(tmpDir, ignore)) {
      files.push(file);
    }

    const filePaths = files.map(f => f.relativePath.replace(/\\/g, '/'));
    
    expect(filePaths).toContain('src');
    expect(filePaths).toContain('src/main.ts');
    expect(filePaths).toContain('src/components');
    expect(filePaths).toContain('src/components/button.tsx');

    expect(filePaths).not.toContain('node_modules');
    expect(filePaths).not.toContain('node_modules/lodash/index.js');
    expect(filePaths).not.toContain('debug.log');

    const mainTs = files.find(f => f.relativePath.replace(/\\/g, '/') === 'src/main.ts')!;
    expect(mainTs).toBeDefined();
    expect(mainTs.name).toBe('main.ts');
    expect(mainTs.extension).toBe('.ts');
    expect(mainTs.isDirectory).toBe(false);
    expect(mainTs.size).toBe(21);
    expect(mainTs.lastModified).toBeInstanceOf(Date);

    const srcDir = files.find(f => f.relativePath.replace(/\\/g, '/') === 'src')!;
    expect(srcDir.isDirectory).toBe(true);
    expect(srcDir.extension).toBe('');

    await fs.rm(tmpDir, { recursive: true, force: true });
  });
});

describe('FileWatcher Integration Tests', () => {
  it('should watch directory changes and publish normalized events to the EventBus', async () => {
    const tmpDir = path.join(__dirname, 'tmp_watcher_test');
    await fs.rm(tmpDir, { recursive: true, force: true });
    await fs.mkdir(tmpDir, { recursive: true });

    const eventBus = new EventBus();
    const watcher = new FileWatcher('ws-test', eventBus);
    const ignore = new IgnoreRuleManager(['node_modules']);

    const createdEvents: any[] = [];
    const modifiedEvents: any[] = [];
    const deletedEvents: any[] = [];

    eventBus.subscribe('workspace.file.created', (event) => {
      createdEvents.push(event.payload);
    });

    eventBus.subscribe('workspace.file.modified', (event) => {
      modifiedEvents.push(event.payload);
    });

    eventBus.subscribe('workspace.file.deleted', (event) => {
      deletedEvents.push(event.payload);
    });

    watcher.startWatching(tmpDir, ignore);

    // Give Chokidar a moment to initialize
    await new Promise((resolve) => setTimeout(resolve, 800));

    // 1. Create a file
    const testFile = path.join(tmpDir, 'info.txt');
    await fs.writeFile(testFile, 'hello');

    // Wait for the creation event to populate and settle
    await new Promise((resolve) => setTimeout(resolve, 400));

    expect(createdEvents.length).toBeGreaterThanOrEqual(1);
    expect(createdEvents[0].file.name).toBe('info.txt');
    expect(createdEvents[0].file.relativePath.replace(/\\/g, '/')).toBe('info.txt');
    expect(createdEvents[0].file.size).toBe(5);

    // 2. Modify the file
    await fs.writeFile(testFile, 'hello world');
    await new Promise((resolve) => setTimeout(resolve, 400));

    expect(modifiedEvents.length).toBeGreaterThanOrEqual(1);
    expect(modifiedEvents[0].file.size).toBe(11);

    // 3. Delete the file
    let unlinked = false;
    for (let i = 0; i < 10; i++) {
      try {
        await fs.unlink(testFile);
        unlinked = true;
        break;
      } catch (err: any) {
        if (err.code === 'EBUSY') {
          await new Promise((resolve) => setTimeout(resolve, 100));
        } else {
          throw err;
        }
      }
    }
    expect(unlinked).toBe(true);
    await new Promise((resolve) => setTimeout(resolve, 400));

    expect(deletedEvents.length).toBeGreaterThanOrEqual(1);
    expect(deletedEvents[0].relativePath.replace(/\\/g, '/')).toBe('info.txt');

    await watcher.stopWatching();
    await fs.rm(tmpDir, { recursive: true, force: true });
  });
});
