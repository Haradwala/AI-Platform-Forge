/**
 * aider-runtime.ts
 *
 * Aider CLI Runtime implementation.
 */

import { BaseCLIRuntime } from './cli-runtime';
import type { ICLIManager } from '../../../container/service-interfaces';

export class AiderCLIRuntime extends BaseCLIRuntime {
  readonly id = 'aider-cli';
  readonly name = 'Aider CLI';
  readonly defaultExecutable = 'aider';
  readonly defaultArgs = ['--message'];

  constructor(cliManager: ICLIManager) {
    super(cliManager);
  }

  override async listAvailableModels(): Promise<string[]> {
    return ['aider-auto', 'claude-3-5-sonnet', 'gpt-4o'];
  }
}
