/**
 * codex-runtime.ts
 *
 * Codex CLI Runtime implementation.
 */

import { BaseCLIRuntime } from './cli-runtime';
import type { ICLIManager } from '../../../container/service-interfaces';

export class CodexCLIRuntime extends BaseCLIRuntime {
  readonly id = 'codex-cli';
  readonly name = 'Codex CLI';
  readonly defaultExecutable = 'codex';
  readonly defaultArgs = ['--query'];

  constructor(cliManager: ICLIManager) {
    super(cliManager);
  }

  override async listAvailableModels(): Promise<string[]> {
    return ['gpt-4o', 'gpt-4o-mini', 'o1-preview', 'o3-mini'];
  }
}
