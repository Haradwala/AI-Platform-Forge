/**
 * cli-errors.ts — Phase 19 Generic CLI Runtime
 *
 * Custom error hierarchy for CLI runtime operations, discovery, launching, adapters, and stream parsing.
 */

export class CLIError extends Error {
  constructor(message: string, public readonly code?: string) {
    super(message);
    this.name = 'CLIError';
  }
}

export class DiscoveryError extends CLIError {
  constructor(message: string, public readonly executablePath?: string) {
    super(message, 'DISCOVERY_ERROR');
    this.name = 'DiscoveryError';
  }
}

export class LaunchError extends CLIError {
  constructor(message: string, public readonly command?: string) {
    super(message, 'LAUNCH_ERROR');
    this.name = 'LaunchError';
  }
}

export class AdapterError extends CLIError {
  constructor(message: string, public readonly adapterId?: string) {
    super(message, 'ADAPTER_ERROR');
    this.name = 'AdapterError';
  }
}

export class ParsingError extends CLIError {
  constructor(message: string, public readonly rawChunk?: string) {
    super(message, 'PARSING_ERROR');
    this.name = 'ParsingError';
  }
}
