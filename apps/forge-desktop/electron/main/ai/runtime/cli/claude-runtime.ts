/**
 * claude-runtime.ts
 *
 * Claude Code CLI Runtime implementation.
 */

import { BaseCLIRuntime } from './cli-runtime';
import type { ICLIManager } from '../../../container/service-interfaces';

export class ClaudeCodeRuntime extends BaseCLIRuntime {
  readonly id = 'claude-code-cli';
  readonly name = 'Claude Code CLI';
  readonly defaultExecutable = 'claude';
  readonly defaultArgs = ['-p'];

  constructor(cliManager: ICLIManager) {
    super(cliManager);
  }

  override async listAvailableModels(): Promise<string[]> {
    return ['claude-3-5-sonnet-20241022', 'claude-3-opus-20240229', 'claude-3-haiku-20240307'];
  }
}
