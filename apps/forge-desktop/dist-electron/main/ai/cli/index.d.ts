/**
 * index.ts — Phase 19 Generic CLI Runtime
 *
 * Barrel export for generic CLI runtime, adapters, sessions, discovery, capabilities, and errors.
 * Preserves backward compatibility for legacy CLIManager exports.
 */
export * from './cli-types';
export * from './cli-session';
export * from './cli-process';
export * from './cli-stream';
export * from './cli-manager';
export * from './cli-errors';
export * from './cli-capabilities';
export * from './cli-adapter';
export * from './cli-discovery';
export * from './cli-runtime';
export * from './sdk';
