"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ArchitectureValidator = void 0;
const tokens_1 = require("../container/tokens");
const electron_1 = require("electron");
const shared_1 = require("@forge/shared");
class ArchitectureValidator {
    static validate(container, manifests = []) {
        const errors = [];
        const warnings = [];
        // 1. DI container validation
        const containerResult = container.validate();
        if (!containerResult.valid) {
            console.error('[ArchVal Error]', containerResult.errors);
            containerResult.errors.forEach((e) => errors.push(`DI Container error: ${e.name} - ${e.message}`));
        }
        containerResult.warnings.forEach((w) => warnings.push(`DI Container warning: ${w.name} - ${w.message}`));
        // 2. Validate essential services exist (core desktop + core AI services)
        const essentialTokens = [
            tokens_1.T.IDesktopLogger,
            tokens_1.T.IDesktopEventBus,
            tokens_1.T.IIpcRouter,
            tokens_1.T.IWindowService,
            tokens_1.T.IWorkspaceService,
            tokens_1.T.ISessionManager,
            tokens_1.T.IRuntimeManager,
            tokens_1.T.IToolRegistry,
            tokens_1.T.IAiKernel,
            tokens_1.T.IExecutionOrchestrator,
            tokens_1.T.IExecutionEngine,
            tokens_1.T.IPlanner,
        ];
        for (const token of essentialTokens) {
            try {
                if (!container.resolve(token)) {
                    errors.push(`Missing essential service: ${String(token)}`);
                }
            }
            catch (err) {
                errors.push(`Failed to resolve token ${String(token)}: ${err instanceof Error ? err.message : String(err)}`);
            }
        }
        // 3. Duplicate IPC channels validation
        const registeredChannels = new Set();
        try {
            if (electron_1.ipcMain && typeof electron_1.ipcMain.eventNames === 'function') {
                const ipcNames = electron_1.ipcMain.eventNames();
                for (const name of ipcNames) {
                    const channel = String(name);
                    if (registeredChannels.has(channel)) {
                        errors.push(`Duplicate IPC Channel Handler detected: ${channel}`);
                    }
                    registeredChannels.add(channel);
                }
            }
        }
        catch (err) {
            // Safely ignore missing export errors in unit test mock environments
        }
        // 4. Validate extension manifest settings and permissions
        const seenIds = new Set();
        const seenCommands = new Set();
        const seenPanels = new Set();
        for (const manifest of manifests) {
            if (seenIds.has(manifest.id)) {
                errors.push(`Duplicate Extension ID: ${manifest.id}`);
            }
            seenIds.add(manifest.id);
            if (manifest.manifestVersion !== 1) {
                errors.push(`Extension "${manifest.id}" uses unsupported manifestVersion: ${manifest.manifestVersion}`);
            }
            // Check SDK limits compatibility
            if (manifest.minimumSdkVersion && manifest.minimumSdkVersion > '1.0.0') {
                errors.push(`Extension "${manifest.id}" requires minimum SDK version ${manifest.minimumSdkVersion} (Current: 1.0.0)`);
            }
            // Permissions check
            if (manifest.permissions) {
                for (const p of manifest.permissions) {
                    if (!Object.values(shared_1.Permission).includes(p)) {
                        errors.push(`Extension "${manifest.id}" requests invalid permission: "${p}"`);
                    }
                }
            }
            // Contributed commands & panels duplicates
            if (manifest.contributes) {
                if (manifest.contributes.commands) {
                    for (const cmd of manifest.contributes.commands) {
                        if (seenCommands.has(cmd.id)) {
                            errors.push(`Duplicate Command contribution ID: ${cmd.id}`);
                        }
                        seenCommands.add(cmd.id);
                    }
                }
                if (manifest.contributes.panels) {
                    for (const pnl of manifest.contributes.panels) {
                        if (seenPanels.has(pnl.id)) {
                            errors.push(`Duplicate Panel contribution ID: ${pnl.id}`);
                        }
                        seenPanels.add(pnl.id);
                    }
                }
            }
        }
        return {
            success: errors.length === 0,
            timestamp: new Date().toISOString(),
            errors,
            warnings,
        };
    }
}
exports.ArchitectureValidator = ArchitectureValidator;
//# sourceMappingURL=architecture-validator.js.map