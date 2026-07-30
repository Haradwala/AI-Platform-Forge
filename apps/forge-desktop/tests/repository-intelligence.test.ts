import { describe, it, expect, vi } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';
import { WorkspaceDiscoveryService } from '../electron/main/platform/workspace-discovery';
import { RegexParser } from '../electron/main/platform/regex-parser';
import { SymbolIndexService } from '../electron/main/platform/symbol-index';
import { DependencyGraphService } from '../electron/main/platform/dependency-graph';
import { IncrementalIndexerService } from '../electron/main/platform/incremental-indexer';
import { RepositorySearchService } from '../electron/main/platform/repository-search';
import { RepositoryDiagnosticsService } from '../electron/main/platform/repository-diagnostics';
import { RepositoryEventService } from '../electron/main/platform/repository-events';
import { RepositoryIntelligenceEngine } from '../electron/main/platform/repository-intelligence';
import { IWorkspaceService } from '../electron/main/container/service-interfaces';

describe('Repository Intelligence Engine (RIE v2.0)', () => {
  
  describe('Workspace Discovery', () => {
    it('discovers language types and statistics from workspace paths', async () => {
      const discovery = new WorkspaceDiscoveryService();
      const manifest = await discovery.discover(__dirname);
      expect(manifest.name).toBe('tests');
      expect(manifest.rootPath).toBe(__dirname);
      expect(manifest.filesCount).toBeGreaterThan(0);
      expect(manifest.languages).toContain('TypeScript');
    });
  });

  describe('Regex Parser & Symbol Engine', () => {
    it('parses symbols, imports, and exports from typescript code', () => {
      const parser = new RegexParser();
      const code = `
        import { useState } from 'react';
        export class AuthenticationService {
          authenticateUser() {}
        }
      `;
      const parsed = parser.parse('auth.ts', code);
      expect(parsed.imports).toContain('react');
      expect(parsed.exports).toContain('AuthenticationService');
      
      const sym = parsed.symbols.find((s) => s.name === 'AuthenticationService');
      expect(sym).toBeDefined();
      expect(sym?.kind).toBe('class');
    });
  });

  describe('Dependency Graph', () => {
    it('tracks shortest dependency paths and circular loops', () => {
      const graph = new DependencyGraphService();
      graph.addImports('App.tsx', ['Database.ts']);
      graph.addImports('Database.ts', ['Config.ts']);
      
      const path = graph.findDependencyPath('App.tsx', 'Config.ts');
      expect(path).toEqual(['App.tsx', 'Database.ts', 'Config.ts']);
      
      // Introduce circular cycle
      graph.addImports('Config.ts', ['App.tsx']);
      const cycles = graph.findCircularDependencies();
      expect(cycles.length).toBeGreaterThan(0);
      expect(cycles[0]).toContain('App.tsx');
    });
  });

  describe('Incremental Indexer & Search', () => {
    it('indexes files on changes and executes queries', async () => {
      const parser = new RegexParser();
      const symbols = new SymbolIndexService();
      const graph = new DependencyGraphService();
      const events = new RepositoryEventService();
      const indexer = new IncrementalIndexerService(parser, symbols, graph, events);
      const search = new RepositorySearchService(symbols, graph);

      const filePath = path.join(__dirname, 'temp_test_file.ts');
      const code = `
        export class LoginService {
          login() {}
        }
      `;
      
      // Write temp file
      fs.writeFileSync(filePath, code, 'utf8');

      try {
        await indexer.indexFile(filePath);
        
        const matches = search.findSymbol('Login');
        expect(matches).toHaveLength(1);
        expect(matches[0].name).toBe('LoginService');
      } finally {
        fs.unlinkSync(filePath);
      }
    });
  });
});
