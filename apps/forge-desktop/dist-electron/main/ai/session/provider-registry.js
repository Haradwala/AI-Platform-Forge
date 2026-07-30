"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProviderRegistry = void 0;
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
var runtime_manager_1 = require("../runtime/runtime-manager");
Object.defineProperty(exports, "ProviderRegistry", { enumerable: true, get: function () { return runtime_manager_1.RuntimeManager; } });
//# sourceMappingURL=provider-registry.js.map