"use strict";
/**
 * index.ts — Phase 20 CLI Adapter SDK & Registry
 *
 * Barrel export for CLI Adapter SDK, manifest, permissions, validator, loader,
 * discovery, diagnostics, and registry.
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
__exportStar(require("./adapter-manifest"), exports);
__exportStar(require("./adapter-permissions"), exports);
__exportStar(require("./adapter-validator"), exports);
__exportStar(require("./adapter-loader"), exports);
__exportStar(require("./adapter-discovery"), exports);
__exportStar(require("./adapter-diagnostics"), exports);
__exportStar(require("./adapter-registry"), exports);
__exportStar(require("./adapter-sdk"), exports);
//# sourceMappingURL=index.js.map