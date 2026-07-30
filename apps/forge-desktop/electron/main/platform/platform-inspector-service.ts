import * as fs from 'fs';
import * as path from 'path';
import { IDesktopContainer } from '../container/interfaces';
import { T } from '../container/tokens';
import { IWorkspaceService, IDesktopLogger } from '../container/service-interfaces';
import { Permission, ForgeExtensionManifest } from '@forge/shared';
import { ipcMain } from 'electron';
import { RuntimeKernel } from './runtime-kernel';

export class PlatformInspectorService {
  constructor(
    private readonly container: IDesktopContainer,
    private readonly workspaceService: IWorkspaceService,
    private readonly logger: IDesktopLogger
  ) {}

  generateDiagnostics(manifests: ForgeExtensionManifest[] = []): void {
    const rootPath = this.workspaceService.getRootPath();
    if (!rootPath) {
      this.logger.warn('[PlatformInspectorService] No active workspace. Skipping architecture documentation output.');
      return;
    }

    const archDir = path.join(rootPath, '.forge', 'architecture');
    try {
      if (!fs.existsSync(archDir)) {
        fs.mkdirSync(archDir, { recursive: true });
      }

      // 1. platform.json
      const platformJson = {
        forgeVersion: '1.0.0',
        sdkVersion: '1.0.0',
        apiVersion: '1.0.0',
        layoutVersion: '1.0.0',
        workspaceVersion: '1.0.0',
        runtimeVersion: process.versions.node,
        extensions: manifests.map((m) => m.id),
        providers: ['ollama', 'openai'],
        features: ['ai.chat', 'ai.planning', 'dock.floating-windows'],
      };
      fs.writeFileSync(path.join(archDir, 'platform.json'), JSON.stringify(platformJson, null, 2));

      // 2. plugins.json
      fs.writeFileSync(path.join(archDir, 'plugins.json'), JSON.stringify(manifests, null, 2));

      // 3. panels.json
      const panels = manifests.flatMap((m) => m.contributes?.panels || []);
      fs.writeFileSync(path.join(archDir, 'panels.json'), JSON.stringify(panels, null, 2));

      // 4. commands.json
      const commands = manifests.flatMap((m) => m.contributes?.commands || []);
      fs.writeFileSync(path.join(archDir, 'commands.json'), JSON.stringify(commands, null, 2));

      // 5. services.json
      const services = [
        { id: 'IDesktopLogger', version: '1.0.0', status: 'healthy' },
        { id: 'IDesktopEventBus', version: '1.0.0', status: 'healthy' },
        { id: 'IWindowService', version: '1.0.0', status: 'healthy' },
        { id: 'IWorkspaceService', version: '1.0.0', status: 'healthy' },
        { id: 'ISessionManager', version: '1.0.0', status: 'healthy' },
      ];
      fs.writeFileSync(path.join(archDir, 'services.json'), JSON.stringify(services, null, 2));

      // 6. events.json
      const events = [
        'dock:opened',
        'dock:closed',
        'dock:moved',
        'dock:resized',
        'dock:panel-activated',
        'focus:changed',
        'workspace:opened',
        'workspace:closed',
        'session:restored',
      ];
      fs.writeFileSync(path.join(archDir, 'events.json'), JSON.stringify(events, null, 2));

      // 7. providers.json
      fs.writeFileSync(path.join(archDir, 'providers.json'), JSON.stringify(['ollama', 'openai'], null, 2));

      // 8. permissions.json
      fs.writeFileSync(path.join(archDir, 'permissions.json'), JSON.stringify(Object.values(Permission), null, 2));

      // 9. features.json
      fs.writeFileSync(path.join(archDir, 'features.json'), JSON.stringify(['ai.chat', 'ai.planning', 'dock.floating-windows'], null, 2));

      // 10. runtime.json
      const runtime = {
        os: process.platform,
        arch: process.arch,
        node: process.versions.node,
        electron: process.versions.electron,
        chrome: process.versions.chrome,
      };
      fs.writeFileSync(path.join(archDir, 'runtime.json'), JSON.stringify(runtime, null, 2));

      // 11. dependency-graph.json
      const depGraph = {
        nodes: services.map((s) => ({ id: s.id })),
        links: [],
      };
      fs.writeFileSync(path.join(archDir, 'dependency-graph.json'), JSON.stringify(depGraph, null, 2));

      // 12. ipc-map.json
      const ipcHandlers = ipcMain.eventNames().map((name) => String(name));
      fs.writeFileSync(path.join(archDir, 'ipc-map.json'), JSON.stringify(ipcHandlers, null, 2));

      this.logger.info(`[PlatformInspectorService] Saved active architecture documentation maps inside: ${archDir}`);
    } catch (err) {
      this.logger.error('[PlatformInspectorService] Failed to write architecture documentation files:', err);
    }
  }

  generateRuntimeDiagnostics(kernel: RuntimeKernel): void {
    const rootPath = this.workspaceService.getRootPath();
    if (!rootPath) return;

    const runtimeDir = path.join(rootPath, '.forge', 'runtime');
    try {
      if (!fs.existsSync(runtimeDir)) {
        fs.mkdirSync(runtimeDir, { recursive: true });
      }

      const services = kernel.getServices();

      // 1. kernel.json
      fs.writeFileSync(path.join(runtimeDir, 'kernel.json'), JSON.stringify(kernel.diagnostics(), null, 2));

      // 2. scheduler.json
      const scheduler = services.find((s) => s.id === 'BackgroundScheduler');
      fs.writeFileSync(path.join(runtimeDir, 'scheduler.json'), JSON.stringify(scheduler ? scheduler.metrics() : {}, null, 2));

      // 3. workers.json
      fs.writeFileSync(path.join(runtimeDir, 'workers.json'), JSON.stringify(['Filesystem', 'Indexing', 'AI', 'Git', 'Diagnostics'], null, 2));

      // 4. registry.json
      fs.writeFileSync(path.join(runtimeDir, 'registry.json'), JSON.stringify(services.map((s) => s.id), null, 2));

      // 5. metrics.json
      const metricsMap = services.reduce((acc, s) => ({ ...acc, [s.id]: s.metrics() }), {});
      fs.writeFileSync(path.join(runtimeDir, 'metrics.json'), JSON.stringify(metricsMap, null, 2));

      // 6. health.json
      const health = services.reduce((acc, s) => ({ ...acc, [s.id]: s.health }), {});
      fs.writeFileSync(path.join(runtimeDir, 'health.json'), JSON.stringify(health, null, 2));

      // 7. resources.json
      const resources = services.find((s) => s.id === 'ResourceManager');
      fs.writeFileSync(path.join(runtimeDir, 'resources.json'), JSON.stringify(resources ? resources.metrics() : {}, null, 2));

      // 8. traces.json
      const observability = services.find((s) => s.id === 'Observability');
      fs.writeFileSync(path.join(runtimeDir, 'traces.json'), JSON.stringify(observability ? observability.metrics() : {}, null, 2));

      this.logger.info(`[PlatformInspectorService] Saved active runtime diagnostics files inside: ${runtimeDir}`);
    } catch (err) {
      this.logger.error('[PlatformInspectorService] Failed to write runtime diagnostics files:', err);
    }
  }
}
