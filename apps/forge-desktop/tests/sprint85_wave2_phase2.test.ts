import { describe, it, expect } from 'vitest';
import { ContextCompressor } from '../electron/main/ai/context/context-compressor';
import { ContextBudget } from '../electron/main/ai/context/context-budget';
import { FileContentFormatter } from '../electron/main/ai/response/formatters/prompt-formatter-strategy';

describe('Sprint 85 Wave 2 Phase 2 — Intelligent Context Compression', () => {
  const compressor = new ContextCompressor();

  describe('1. ContextCompressor JSON Key Extraction', () => {
    const samplePackageJson = JSON.stringify(
      {
        name: 'forge',
        version: '0.1.0',
        private: true,
        scripts: { dev: 'vite', build: 'tsc' },
        dependencies: { react: '^18.0.0' },
      },
      null,
      2
    );

    it('extracts "version" block when requested in goal', () => {
      const res = compressor.compressFileContent(samplePackageJson, 'What is the version in package.json?', 'package.json');
      expect(res).toContain('"version": "0.1.0"');
      expect(res).not.toContain('"scripts"');
      expect(res).not.toContain('"dependencies"');
    });

    it('extracts "scripts" block when requested in goal', () => {
      const res = compressor.compressFileContent(samplePackageJson, 'Show package.json scripts', 'package.json');
      expect(res).toContain('"scripts"');
      expect(res).not.toContain('"version"');
    });

    it('extractJsonKey direct API returns formatted JSON key', () => {
      const res = compressor.extractJsonKey(samplePackageJson, 'version');
      expect(res).toBe('{\n  "version": "0.1.0"\n}');
    });
  });

  describe('2. ContextCompressor Imports Extraction', () => {
    const sampleTsCode = `
import React from 'react';
import { useState, useEffect } from 'react';
import type { IContainer } from './container';
const fs = require('fs');

export function App() {
  const [state, setState] = useState(null);
  return <div>App</div>;
}
`;

    it('extracts only import lines when goal asks for imports', () => {
      const res = compressor.compressFileContent(sampleTsCode, 'Show the imports from App.tsx', 'App.tsx');
      expect(res).toContain("import React from 'react';");
      expect(res).toContain("const fs = require('fs');");
      expect(res).not.toContain('export function App()');
    });

    it('extractImports direct API works correctly', () => {
      const imports = compressor.extractImports(sampleTsCode);
      expect(imports).toContain("import React from 'react';");
      expect(imports).not.toContain('return <div>App</div>;');
    });
  });

  describe('3. ContextCompressor Targeted Function / Symbol Extraction', () => {
    const sampleCode = `
export function openFile(path: string) {
  console.log('Opening file at', path);
  return true;
}

export function closeFile() {
  console.log('Closing file');
  return false;
}
`;

    it('extracts openFile function block when goal mentions openFile', () => {
      const res = compressor.compressFileContent(sampleCode, 'Explain openFile', 'editor.ts');
      expect(res).toContain('export function openFile(path: string)');
      expect(res).toContain("console.log('Opening file at', path);");
      expect(res).not.toContain('function closeFile()');
    });

    it('extractFunction direct API returns function block', () => {
      const block = compressor.extractFunction(sampleCode, 'closeFile');
      expect(block).toContain('export function closeFile()');
      expect(block).not.toContain('openFile');
    });
  });

  describe('4. Large Content Summarization', () => {
    const largeContent = Array.from({ length: 100 }, (_, i) => `Line ${i + 1}: const data_${i} = ${i};`).join('\n');

    it('summarizes content over 4000 characters by taking head 40 and tail 20 lines', () => {
      const contentOver4k = largeContent + '\n' + 'x'.repeat(4000);
      const res = compressor.compressFileContent(contentOver4k, 'General request', 'largeFile.ts');
      expect(res).toContain('Line 1:');
      expect(res).toContain('Line 40:');
      expect(res).toContain('lines truncated for context efficiency');
    });

    it('summarizeLargeContent direct API works correctly', () => {
      const summary = compressor.summarizeLargeContent(largeContent + '\n' + 'y'.repeat(4000));
      expect(summary).toContain('Line 1:');
      expect(summary).toContain('... [');
    });
  });

  describe('5. ContextBudget Integration', () => {
    it('uses ContextCompressor before truncating oversized items in enforceBudget', () => {
      const budget = new ContextBudget(compressor);
      const largePackageJson = JSON.stringify(
        {
          name: 'forge',
          version: '0.1.0',
          scripts: { test: 'vitest' },
          extraData: 'x'.repeat(15000),
        },
        null,
        2
      );

      const items = [
        {
          id: '1',
          source: 'file_content',
          path: 'package.json',
          content: largePackageJson,
          score: 100,
          rankReasons: [],
        },
      ];

      const result = budget.enforceBudget(items, 1000, 'What is the version?');
      expect(result.accepted).toHaveLength(1);
      expect(result.accepted[0].content).toContain('"version": "0.1.0"');
      expect(result.accepted[0].content).not.toContain('extraData');
    });
  });

  describe('6. FileContentFormatter Integration', () => {
    it('formats FileContentFact using ContextCompressor', () => {
      const formatter = new FileContentFormatter(compressor);
      const fact = {
        kind: 'file_content' as const,
        path: 'package.json',
        content: JSON.stringify({ name: 'forge', version: '0.1.0', heavy: 'z'.repeat(5000) }),
      };

      const section = formatter.format(fact, 'What is the version?');
      expect(section.content).toContain('"version": "0.1.0"');
      expect(section.content).not.toContain('heavy');
    });
  });
});
