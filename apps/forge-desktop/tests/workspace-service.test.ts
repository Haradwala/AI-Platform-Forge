import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';
import { WorkspaceService } from '../electron/main/workspace-service';
import { WindowRegistry } from '../electron/main/window-registry';
import type { IDesktopLogger } from '../electron/main/container/service-interfaces';

// ─── Mock Electron ────────────────────────────────────────────────────────────

vi.mock('electron', () => {
  return {
    app: {
      isPackaged: true,
      getPath: () => path.join(process.cwd(), 'temp', 'user-data'),
      whenReady: () => Promise.resolve(),
    },
    BrowserWindow: class {},
    shell: {
      openExternal: vi.fn(),
    },
  };
});

// ─── Spies & Mocks ────────────────────────────────────────────────────────────

const mockLogger = {
  info: vi.fn(),
  warn: vi.fn(),
  error: vi.fn(),
  debug: vi.fn(),
} as unknown as IDesktopLogger;

// ─── Tests ────────────────────────────────────────────────────────────────────

describe('WorkspaceService', () => {
  const testRoot = path.join(process.cwd(), 'temp', 'test-workspace');
  let registry: WindowRegistry;
  let service: WorkspaceService;

  beforeEach(() => {
    // Recreate clean test workspace dir
    if (fs.existsSync(testRoot)) {
      fs.rmSync(testRoot, { recursive: true, force: true });
    }
    fs.mkdirSync(testRoot, { recursive: true });

    registry = new WindowRegistry();
    service = new WorkspaceService(registry, mockLogger);
  });

  afterEach(() => {
    // Shutdown service to stop any watchers
    service.close();
    // Clean up files
    try {
      if (fs.existsSync(testRoot)) {
        fs.rmSync(testRoot, { recursive: true, force: true, maxRetries: 3, retryDelay: 50 });
      }
      const tempUserData = path.join(process.cwd(), 'temp', 'user-data');
      if (fs.existsSync(tempUserData)) {
        fs.rmSync(tempUserData, { recursive: true, force: true, maxRetries: 3, retryDelay: 50 });
      }
    } catch (_) {}
  });

  // ── Open / Close ───────────────────────────────────────────────────────────

  it('open() initializes workspace, creates .forge, subdirs and gitignore', async () => {
    const tree = await service.open(testRoot);

    expect(service.getRootPath()).toBe(path.resolve(testRoot));
    expect(tree.name).toBe(path.basename(testRoot));
    expect(tree.isDirectory).toBe(true);

    // Verify .forge/ directory exists with its subdirectories
    const forgeDir = path.join(testRoot, '.forge');
    expect(fs.existsSync(forgeDir)).toBe(true);
    expect(fs.existsSync(path.join(forgeDir, 'cache'))).toBe(true);
    expect(fs.existsSync(path.join(forgeDir, 'logs'))).toBe(true);
    expect(fs.existsSync(path.join(forgeDir, 'checkpoints'))).toBe(true);
    expect(fs.existsSync(path.join(forgeDir, 'indexes'))).toBe(true);
    expect(fs.existsSync(path.join(forgeDir, 'workspace.json'))).toBe(true);

    // Verify .gitignore was created and ignores .forge/
    const gitignoreFile = path.join(testRoot, '.gitignore');
    expect(fs.existsSync(gitignoreFile)).toBe(true);
    const content = fs.readFileSync(gitignoreFile, 'utf-8');
    expect(content).toContain('.forge/\n');
  });

  it('open() appends to existing .gitignore if .forge/ not already ignored', async () => {
    fs.writeFileSync(path.join(testRoot, '.gitignore'), 'node_modules/\n', 'utf-8');
    await service.open(testRoot);
    const content = fs.readFileSync(path.join(testRoot, '.gitignore'), 'utf-8');
    expect(content).toContain('node_modules/\n');
    expect(content).toContain('.forge/\n');
  });

  it('open() updates recent workspaces list', async () => {
    await service.open(testRoot);
    const recent = await service.getRecentWorkspaces();
    expect(recent).toContain(path.resolve(testRoot));
  });

  it('close() stops watcher and clears rootPath', async () => {
    await service.open(testRoot);
    expect(service.getRootPath()).not.toBeNull();
    await service.close();
    expect(service.getRootPath()).toBeNull();
  });

  // ── CRUD Operations ────────────────────────────────────────────────────────

  it('createFile() and readFile() work correctly', async () => {
    await service.open(testRoot);
    const file = 'test.txt';
    await service.createFile(file);
    expect(fs.existsSync(path.join(testRoot, file))).toBe(true);

    await service.writeFile(file, 'hello world');
    const content = await service.readFile(file);
    expect(content).toBe('hello world');
  });

  it('createFolder() creates a directory in the workspace', async () => {
    await service.open(testRoot);
    const folder = 'src';
    await service.createFolder(folder);
    expect(fs.existsSync(path.join(testRoot, folder))).toBe(true);
    expect(fs.statSync(path.join(testRoot, folder)).isDirectory()).toBe(true);
  });

  it('deleteEntry() deletes files and folders recursively', async () => {
    await service.open(testRoot);
    const file = 'temp.txt';
    await service.createFile(file);
    expect(fs.existsSync(path.join(testRoot, file))).toBe(true);
    await service.deleteEntry(file);
    expect(fs.existsSync(path.join(testRoot, file))).toBe(false);
  });

  it('renameEntry() renames paths within workspace', async () => {
    await service.open(testRoot);
    const oldFile = 'old.txt';
    const newFile = 'new.txt';
    await service.createFile(oldFile);
    await service.renameEntry(oldFile, newFile);
    expect(fs.existsSync(path.join(testRoot, oldFile))).toBe(false);
    expect(fs.existsSync(path.join(testRoot, newFile))).toBe(true);
  });

  // ── Path Traversal Prevention ──────────────────────────────────────────────

  it('prevents CRUD operations outside the workspace root (path traversal)', async () => {
    await service.open(testRoot);

    // Try reading a file outside the root path using relative path
    const outsideFile = '../outside.txt';
    await expect(service.readFile(outsideFile)).rejects.toThrow('Access Denied');

    // Try creating a file outside using absolute path
    const absoluteOutside = path.resolve(testRoot, '..', 'attack.txt');
    await expect(service.createFile(absoluteOutside)).rejects.toThrow('Access Denied');

    // Try writing to a file outside
    await expect(service.writeFile(outsideFile, 'exploit')).rejects.toThrow('Access Denied');

    // Try deleting outside
    await expect(service.deleteEntry(outsideFile)).rejects.toThrow('Access Denied');

    // Try renaming outside
    await expect(service.renameEntry('test.txt', outsideFile)).rejects.toThrow('Access Denied');
  });
});
