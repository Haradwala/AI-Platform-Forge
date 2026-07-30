/**
 * code-intelligence.test.ts
 *
 * Unit test suite for Phase 9 Code Intelligence Engine.
 * Covers:
 *  - AST parsing (classes, interfaces, functions, methods, calls, JSX)
 *  - Global symbol index lookup
 *  - Reference search & dependency graph
 *  - Call graph & async chains
 *  - Incremental file updates & removals
 *  - AbortSignal cancellation
 *  - Large repository scan performance (100+ files)
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { CodeIntelligenceEngine } from '../electron/main/ai/code-intelligence/code-intelligence-engine';
import { ASTParser } from '../electron/main/ai/code-intelligence/ast-parser';

describe('CodeIntelligenceEngine', () => {
  let engine: CodeIntelligenceEngine;
  let parser: ASTParser;

  beforeEach(() => {
    engine = new CodeIntelligenceEngine();
    parser = new ASTParser();
  });

  it('parses TypeScript AST structures correctly', () => {
    const code = `
      import { useState } from 'react';
      import type { User } from './types';

      export interface IAuthService {
        login(user: User): Promise<boolean>;
      }

      export class AuthService implements IAuthService {
        async login(user: User): Promise<boolean> {
          return true;
        }
      }

      export async function fetchUser(): Promise<User> {
        const auth = new AuthService();
        return auth.login({ id: '1' });
      }

      export function UserCard() {
        const [state, setState] = useState(null);
        return <div className="card">User</div>;
      }
    `;

    const parsed = parser.parse('src/auth.tsx', code);

    expect(parsed.imports.length).toBe(2);
    expect(parsed.interfaces[0].name).toBe('IAuthService');
    expect(parsed.classes[0].name).toBe('AuthService');
    expect(parsed.classes[0].implements).toContain('IAuthService');
    expect(parsed.functions[0].name).toBe('fetchUser');
    expect(parsed.functions[0].isAsync).toBe(true);
    expect(parsed.jsxComponents.length).toBeGreaterThan(0);
    expect(parsed.calls.length).toBeGreaterThan(0);
  });

  it('indexes workspace files, symbols, dependencies, and call graphs', async () => {
    const file1 = {
      path: 'src/services/user-service.ts',
      content: `
        export interface IUser { id: string; }
        export class UserService {
          async getUser(): Promise<IUser> {
            return { id: '1' };
          }
        }
      `,
    };

    const file2 = {
      path: 'src/controllers/user-controller.ts',
      content: `
        import { UserService } from '../services/user-service';
        export class UserController {
          private service = new UserService();
          async handle() {
            return this.service.getUser();
          }
        }
      `,
    };

    const stats = await engine.scanWorkspace([file1, file2]);

    expect(stats.totalFiles).toBe(2);
    expect(stats.classesCount).toBe(2);

    const userClass = engine.symbol('UserService');
    expect(userClass.length).toBe(1);
    expect(userClass[0].kind).toBe('class');

    const callers = engine.search().callers('getUser');
    expect(callers.length).toBeGreaterThan(0);

    const fileImports = engine.dependencyGraph().getFileImports('src/controllers/user-controller.ts');
    expect(fileImports).toContain('../services/user-service');
  });

  it('supports incremental updates and file removals cleanly', async () => {
    await engine.scanWorkspace([
      { path: 'src/a.ts', content: 'export class ComponentA {}' },
    ]);

    expect(engine.symbol('ComponentA').length).toBe(1);

    // Incremental update
    engine.updateFile('src/a.ts', 'export class ComponentAUpdated {}');
    expect(engine.symbol('ComponentA').length).toBe(0);
    expect(engine.symbol('ComponentAUpdated').length).toBe(1);

    // Removal
    engine.removeFile('src/a.ts');
    expect(engine.symbol('ComponentAUpdated').length).toBe(0);
  });

  it('cancels workspace scan when AbortSignal is aborted', async () => {
    const controller = new AbortController();
    controller.abort();

    await expect(
      engine.scanWorkspace(
        [{ path: 'src/index.ts', content: 'console.log(1);' }],
        controller.signal
      )
    ).rejects.toThrow('cancelled by AbortSignal');
  });

  it('handles large repository static analysis under high performance constraints', async () => {
    const files: Array<{ path: string; content: string }> = [];
    for (let i = 0; i < 120; i++) {
      files.push({
        path: `src/generated/module_${i}.ts`,
        content: `
          import { Helper_${(i + 1) % 120} } from './module_${(i + 1) % 120}';
          export class Helper_${i} {
            async execute_${i}() {
              return ${(i + 1) % 120};
            }
          }
        `,
      });
    }

    const start = Date.now();
    const stats = await engine.scanWorkspace(files);
    const duration = Date.now() - start;

    expect(stats.totalFiles).toBe(120);
    expect(stats.classesCount).toBe(120);
    expect(duration).toBeLessThan(5000); // 120 TS files parsed in under 5s
  });
});
