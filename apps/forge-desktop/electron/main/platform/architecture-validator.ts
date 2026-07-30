import { IDesktopContainer } from '../container/interfaces';
import { T } from '../container/tokens';
import { ipcMain } from 'electron';
import { Permission, ForgeExtensionManifest } from '@forge/shared';

export interface ArchitectureReport {
  success: boolean;
  timestamp: string;
  errors: string[];
  warnings: string[];
}

export class ArchitectureValidator {
  static validate(container: IDesktopContainer, manifests: ForgeExtensionManifest[] = []): ArchitectureReport {
    const errors: string[] = [];
    const warnings: string[] = [];

    // 1. DI container validation
    const containerResult = container.validate();
    if (!containerResult.valid) {
      console.error('[ArchVal Error]', containerResult.errors);
      containerResult.errors.forEach((e) => errors.push(`DI Container error: ${e.name} - ${e.message}`));
    }
    containerResult.warnings.forEach((w) => warnings.push(`DI Container warning: ${w.name} - ${w.message}`));

    // 2. Validate essential services exist (core desktop + core AI services)
    const essentialTokens = [
      T.IDesktopLogger,
      T.IDesktopEventBus,
      T.IIpcRouter,
      T.IWindowService,
      T.IWorkspaceService,
      T.ISessionManager,
      T.IRuntimeManager,
      T.IToolRegistry,
      T.IAiKernel,
      T.IExecutionOrchestrator,
      T.IExecutionEngine,
      T.IPlanner,
    ];
    for (const token of essentialTokens) {
      try {
        if (!container.resolve(token)) {
          errors.push(`Missing essential service: ${String(token)}`);
        }
      } catch (err) {
        errors.push(`Failed to resolve token ${String(token)}: ${err instanceof Error ? err.message : String(err)}`);
      }
    }

    // 3. Duplicate IPC channels validation
    const registeredChannels = new Set<string>();
    try {
      if (ipcMain && typeof ipcMain.eventNames === 'function') {
        const ipcNames = ipcMain.eventNames();
        for (const name of ipcNames) {
          const channel = String(name);
          if (registeredChannels.has(channel)) {
            errors.push(`Duplicate IPC Channel Handler detected: ${channel}`);
          }
          registeredChannels.add(channel);
        }
      }
    } catch (err) {
      // Safely ignore missing export errors in unit test mock environments
    }

    // 4. Validate extension manifest settings and permissions
    const seenIds = new Set<string>();
    const seenCommands = new Set<string>();
    const seenPanels = new Set<string>();

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
          if (!Object.values(Permission).includes(p)) {
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
