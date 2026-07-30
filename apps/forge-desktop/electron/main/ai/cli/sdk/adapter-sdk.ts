/**
 * adapter-sdk.ts — Phase 20 CLI Adapter SDK & Registry
 *
 * Official Forge CLI Adapter SDK for constructing, validating, and registering CLI adapters.
 */

import type { CLIAdapter } from '../cli-adapter';
import type { AdapterManifest } from './adapter-manifest';
import type { CLICapabilities } from '../cli-capabilities';
import { createCapabilities } from '../cli-capabilities';
import { AdapterValidator } from './adapter-validator';
import { AdapterError } from '../cli-errors';

export interface AdapterBuilderOptions {
  manifest: AdapterManifest;
  detectFn: () => Promise<boolean>;
  commandFn: () => string;
  argumentsFn: (prompt: string, options?: Record<string, unknown>) => string[];
  environmentFn?: (options?: Record<string, unknown>) => Record<string, string>;
  workingDirectoryFn?: (options?: Record<string, unknown>) => string;
}

export class AdapterSDK {
  /**
   * Helper utility to build a fully compliant CLIAdapter instance from a manifest and execution handlers.
   */
  static createAdapter(options: AdapterBuilderOptions): CLIAdapter {
    const report = AdapterValidator.validate(options.manifest);
    if (!report.valid) {
      throw new AdapterError(`Failed to create adapter "${options.manifest.id}":\n${report.errors.join('\n')}`);
    }

    const caps: CLICapabilities = createCapabilities(options.manifest.capabilities);

    return {
      id: options.manifest.id,
      name: options.manifest.name,
      version: options.manifest.version,

      detect: () => options.detectFn(),
      command: () => options.commandFn(),
      arguments: (prompt, opts) => options.argumentsFn(prompt, opts),
      environment: (opts) => (options.environmentFn ? options.environmentFn(opts) : {}),
      workingDirectory: (opts) =>
        options.workingDirectoryFn ? options.workingDirectoryFn(opts) : process.cwd(),

      supportsStreaming: () => caps.streaming,
      supportsApproval: () => caps.approval,
      supportsTools: () => caps.tools,
      supportsImages: () => caps.images,
      supportsMCP: () => caps.mcp,
      supportsResume: () => caps.resume,
      getCapabilities: () => caps,

      parseOutput: (chunk: string) => [
        {
          type: 'token',
          payload: { text: chunk },
          timestamp: Date.now(),
        },
      ],
      parseProgress: () => null,
      parseErrors: (chunk: string) => (chunk.includes('ERR') ? chunk : null),
      parseToolCalls: () => [],
    };
  }
}
