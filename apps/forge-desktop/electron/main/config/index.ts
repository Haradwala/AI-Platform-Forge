/**
 * index.ts — public API of the Forge Configuration layer.
 */

export type { ProviderConfig, ForgeConfig } from './configuration-schema';
export { createDefaultConfig } from './configuration-schema';
export type { ValidationResult } from './configuration-validator';
export { validateConfig } from './configuration-validator';
export { ConfigurationStore } from './configuration-store';
export { ConfigurationLoader, type IFileSystem } from './configuration-loader';
export type { IConfigurationService } from './configuration-service';
export { ConfigurationService } from './configuration-service';
