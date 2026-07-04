import { describe, it, expect } from 'vitest';
import { LanguageDetector } from '../src/detector';

describe('LanguageDetector', () => {
  const detector = new LanguageDetector();

  it('should resolve by extension', () => {
    expect(detector.detect('file.ts')).toBe('typescript');
    expect(detector.detect('file.tsx')).toBe('typescript');
    expect(detector.detect('file.py')).toBe('python');
    expect(detector.detect('file.md')).toBe('markdown');
    expect(detector.detect('file.json')).toBe('json');
    expect(detector.detect('file.unknown')).toBe('unknown');
  });

  it('should resolve by config file name', () => {
    expect(detector.detect('Cargo.toml')).toBe('rust');
    expect(detector.detect('package.json')).toBe('typescript');
    expect(detector.detect('tsconfig.json')).toBe('typescript');
    expect(detector.detect('pom.xml')).toBe('java');
    expect(detector.detect('requirements.txt')).toBe('python');
  });

  it('should resolve by shebang line', () => {
    const pythonContent = '#!/usr/bin/env python\nprint("hello")';
    expect(detector.detect('script', pythonContent)).toBe('python');

    const nodeContent = '#!/usr/bin/env node\nconsole.log("hello");';
    expect(detector.detect('script', nodeContent)).toBe('javascript');

    const bashContent = '#!/bin/bash\necho hello';
    expect(detector.detect('script', bashContent)).toBe('shell');
  });

  it('should prioritize shebang over extension', () => {
    const pythonContent = '#!/usr/bin/env python\nprint("hello")';
    expect(detector.detect('my-script', pythonContent)).toBe('python');
  });
});
