/**
 * goose-runtime.ts
 *
 * Goose CLI Runtime implementation.
 */

import { BaseCLIRuntime } from './cli-runtime';
import type { ICLIManager } from '../../../container/service-interfaces';

export class GooseCLIRuntime extends BaseCLIRuntime {
  readonly id = 'goose-cli';
  readonly name = 'Goose CLI Agent';
  readonly defaultExecutable = 'goose';
  readonly defaultArgs = ['run', '--text'];

  constructor(cliManager: ICLIManager) {
    super(cliManager);
  }

  override async listAvailableModels(): Promise<string[]> {
    return ['goose-default', 'claude-3-5-sonnet', 'databricks-dbrx'];
  }
}
