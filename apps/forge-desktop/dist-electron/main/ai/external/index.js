"use strict";
/**
 * index.ts — Phase 18 External Runtime Foundation
 *
 * Barrel export for external runtimes, manager, processes, sessions, and stream parsers.
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
__exportStar(require("./external-types"), exports);
__exportStar(require("./external-environment"), exports);
__exportStar(require("./external-stream-parser"), exports);
__exportStar(require("./external-process"), exports);
__exportStar(require("./external-session"), exports);
__exportStar(require("./external-runtime"), exports);
__exportStar(require("./external-runtime-manager"), exports);
//# sourceMappingURL=index.js.map