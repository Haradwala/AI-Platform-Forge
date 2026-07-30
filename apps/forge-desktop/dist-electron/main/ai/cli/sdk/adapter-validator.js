"use strict";
/**
 * adapter-validator.ts — Phase 20 CLI Adapter SDK & Registry
 *
 * Validates adapter manifests, entry point availability, runtime compatibility, and binaries.
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
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdapterValidator = void 0;
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const adapter_permissions_1 = require("./adapter-permissions");
class AdapterValidator {
    /**
     * Validates a CLI adapter manifest and installation directory.
     */
    static validate(manifest, adapterDir) {
        const errors = [];
        const warnings = [];
        // 1. Manifest field checks
        if (!manifest.id || typeof manifest.id !== 'string') {
            errors.push('Manifest missing required field: "id"');
        }
        if (!manifest.name || typeof manifest.name !== 'string') {
            errors.push('Manifest missing required field: "name"');
        }
        if (!manifest.version || typeof manifest.version !== 'string') {
            errors.push('Manifest missing required field: "version"');
        }
        if (!manifest.runtimeVersion || typeof manifest.runtimeVersion !== 'string') {
            errors.push('Manifest missing required field: "runtimeVersion"');
        }
        if (!manifest.entry || typeof manifest.entry !== 'string') {
            errors.push('Manifest missing required field: "entry"');
        }
        // 2. Permission checks
        if (manifest.permissions && Array.isArray(manifest.permissions)) {
            const permCheck = adapter_permissions_1.PermissionChecker.validatePermissions(manifest.permissions, adapter_permissions_1.ALL_ADAPTER_PERMISSIONS);
            if (!permCheck.valid) {
                errors.push(`Manifest contains invalid permissions: ${permCheck.missing.join(', ')}`);
            }
        }
        else {
            warnings.push('Manifest does not declare explicit permissions list.');
        }
        // 3. Entry point file check
        if (adapterDir && manifest.entry) {
            const entryPath = path.resolve(adapterDir, manifest.entry);
            if (!fs.existsSync(entryPath)) {
                errors.push(`Adapter entry point file not found: "${entryPath}"`);
            }
        }
        // 4. Required binaries check
        if (manifest.requiredBinaries && Array.isArray(manifest.requiredBinaries)) {
            for (const bin of manifest.requiredBinaries) {
                if (typeof bin !== 'string') {
                    errors.push('Invalid binary entry in "requiredBinaries"');
                }
            }
        }
        return {
            valid: errors.length === 0,
            errors,
            warnings,
        };
    }
}
exports.AdapterValidator = AdapterValidator;
//# sourceMappingURL=adapter-validator.js.map