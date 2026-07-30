/**
 * provider-registry.ts — Compatibility shim.
 *
 * TODO(Phase 2): Remove this shim once all consumers have been migrated
 * to import RuntimeManager directly from 'ai/runtime'.
 *
 * The canonical implementation is RuntimeManager in ai/runtime/runtime-manager.ts.
 * This re-export preserves the legacy import path used by:
 *  - tests/ai-foundation.test.ts
 *  - modules/ai.module.ts (historical import; replaced in DI registration)
 */
export { RuntimeManager as ProviderRegistry } from '../runtime/runtime-manager';
