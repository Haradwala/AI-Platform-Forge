/**
 * intelligence-engine.test.ts — Unit Test Suite for Engineering Intelligence Engine
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';
import { TypeScriptParser } from '../electron/main/intelligence/parser/parsers/typescript-parser';
import { RegexFallbackParser } from '../electron/main/intelligence/parser/parsers/regex-fallback-parser';
import { LanguageParserRegistry } from '../electron/main/intelligence/parser/language-parser-registry';
import { IntelligenceDatabase } from '../electron/main/intelligence/storage/intelligence-database';
import { RepositoryIndexCoordinator } from '../electron/main/intelligence/indexer/repository-index-coordinator';
import { KnowledgeGraphEngine } from '../electron/main/intelligence/graph/knowledge-graph-engine';
import { DefaultEmbeddingProvider } from '../electron/main/intelligence/search/embedding-provider';
import { SemanticSearchEngine } from '../electron/main/intelligence/search/semantic-search-engine';
import { TokenBudgetCalculator } from '../electron/main/intelligence/context/token-budget-calculator';
import { EngineeringMemoryStore } from '../electron/main/intelligence/memory/engineering-memory-store';
import { ContextAssemblyEngine } from '../electron/main/intelligence/context/context-assembly-engine';
import { AnalysisCacheService } from '../electron/main/intelligence/cache/analysis-cache-service';
import { EngineeringIntelligenceService } from '../electron/main/intelligence/services/engineering-intelligence-service';
import { IntelligenceApplicationService } from '../electron/main/application/intelligence/intelligence-application-service';

describe('Engineering Intelligence Engine', () => {
  const testDir = path.join(__dirname, 'temp_intelligence_test');
  let db: IntelligenceDatabase;
  let registry: LanguageParserRegistry;
  let coordinator: RepositoryIndexCoordinator;
  let graphEngine: KnowledgeGraphEngine;
  let embeddingProvider: DefaultEmbeddingProvider;
  let searchEngine: SemanticSearchEngine;
  let memoryStore: EngineeringMemoryStore;
  let contextEngine: ContextAssemblyEngine;
  let cacheService: AnalysisCacheService;
  let intelligenceService: EngineeringIntelligenceService;
  let appService: IntelligenceApplicationService;

  beforeEach(async () => {
    if (!fs.existsSync(testDir)) {
      fs.mkdirSync(testDir, { recursive: true });
    }

    // Write a dummy TypeScript file
    fs.writeFileSync(
      path.join(testDir, 'index.ts'),
      `export class UserService {\n  getUser() { return 'user'; }\n}`
    );

    db = new IntelligenceDatabase();
    await db.initialize(testDir);

    registry = new LanguageParserRegistry();
    coordinator = new RepositoryIndexCoordinator(db, registry);
    graphEngine = new KnowledgeGraphEngine(db);
    embeddingProvider = new DefaultEmbeddingProvider();
    searchEngine = new SemanticSearchEngine(db, graphEngine, embeddingProvider);
    memoryStore = new EngineeringMemoryStore(db);
    contextEngine = new ContextAssemblyEngine(searchEngine, memoryStore);
    cacheService = new AnalysisCacheService();
    intelligenceService = new EngineeringIntelligenceService(graphEngine, cacheService);
    appService = new IntelligenceApplicationService(coordinator, searchEngine, contextEngine, memoryStore, intelligenceService);
  });

  afterEach(() => {
    if (fs.existsSync(testDir)) {
      fs.rmSync(testDir, { recursive: true, force: true });
    }
  });

  it('TypeScriptParser extracts class and function nodes', async () => {
    const parser = new TypeScriptParser();
    const result = await parser.parseFile('index.ts', `export class Foo {}\nfunction bar() {}`, 'file1');
    expect(result.nodes.length).toBe(2);
    expect(result.nodes[0].name).toBe('Foo');
    expect(result.nodes[1].name).toBe('bar');
  });

  it('RepositoryIndexCoordinator scans workspace and indexes symbols', async () => {
    const job = await coordinator.startIndexing(testDir);
    expect(job.status).toBe('completed');
    expect(job.filesScanned).toBeGreaterThan(0);

    const symbols = await db.findSymbolsByName('UserService');
    expect(symbols.length).toBe(1);
    expect(symbols[0].name).toBe('UserService');
  });

  it('EmbeddingProvider generates vector embeddings', async () => {
    const embedding = await embeddingProvider.generateEmbedding('hello world');
    expect(embedding.length).toBe(128);
  });

  it('SemanticSearchEngine performs symbol resolution', async () => {
    await coordinator.startIndexing(testDir);
    const results = await searchEngine.searchSymbols('UserService');
    expect(results.length).toBeGreaterThan(0);
    expect(results[0].node.name).toBe('UserService');
  });

  it('EngineeringMemoryStore adds and lists ADRs', async () => {
    await memoryStore.addArchitecturalDecision({
      id: 'adr1',
      workspaceRoot: testDir,
      title: 'Use SQLite',
      decision: 'Use SQLite for repository intelligence database',
      rationale: 'Scales to 1M+ LOC with low memory overhead',
      status: 'accepted',
      createdAt: Date.now(),
    });

    const adrs = await memoryStore.getArchitecturalDecisions(testDir);
    expect(adrs.length).toBe(1);
    expect(adrs[0].title).toBe('Use SQLite');
  });

  it('ContextAssemblyEngine allocates token budget and ranks context', async () => {
    await coordinator.startIndexing(testDir);
    const assembled = await contextEngine.assembleContext({
      workspaceRoot: testDir,
      prompt: 'UserService',
      maxTokens: 4096,
    });
    expect(assembled.prompt).toBe('UserService');
    expect(assembled.tokenUsage.maxTokens).toBe(4096);
  });

  it('EngineeringIntelligenceService performs impact analysis', async () => {
    await coordinator.startIndexing(testDir);
    const report = await intelligenceService.analyzeImpact([path.join(testDir, 'index.ts')], testDir);
    expect(report.changedFiles.length).toBe(1);
    expect(report.riskScore).toBe('low');
  });
});
