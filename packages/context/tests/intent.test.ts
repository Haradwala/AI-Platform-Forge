import { describe, it, expect } from 'vitest';
import { IntentAnalyzer } from '../src/intent/intent-analyzer';

describe('IntentAnalyzer', () => {
  const analyzer = new IntentAnalyzer();

  it('should categorize explain requests', async () => {
    const result = await analyzer.analyze('Please explain how does MyClass operate?');
    expect(result.type).toBe('explain');
    expect(result.entities).toContain('MyClass');
  });

  it('should categorize debug requests', async () => {
    const result = await analyzer.analyze('How to fix this debug crash index out of bounds error?');
    expect(result.type).toBe('debug');
  });

  it('should default to search if no matches', async () => {
    const result = await analyzer.analyze('Retrieve all declarations.');
    expect(result.type).toBe('search');
  });
});
