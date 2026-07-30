/**
 * gemini-runtime.ts
 *
 * Gemini CLI Runtime implementation.
 */

import { BaseCLIRuntime } from './cli-runtime';
import type { ICLIManager } from '../../../container/service-interfaces';

export class GeminiCLIRuntime extends BaseCLIRuntime {
  readonly id = 'gemini-cli';
  readonly name = 'Gemini CLI';
  readonly defaultExecutable = 'gemini';
  readonly defaultArgs = ['--prompt'];

  constructor(cliManager: ICLIManager) {
    super(cliManager);
  }

  override async listAvailableModels(): Promise<string[]> {
    return ['gemini-1.5-pro', 'gemini-1.5-flash', 'gemini-2.0-flash-exp'];
  }
}
