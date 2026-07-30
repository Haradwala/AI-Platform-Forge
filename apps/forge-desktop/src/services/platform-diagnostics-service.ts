import { useLayoutStore } from '../stores/layout-store';
import { useFocusStore } from '../stores/focus-store';
import { panelRegistry } from '../plugins/panel-registry';
import { commandRegistry } from '../plugins/command-registry';

export class PlatformDiagnosticsService {
  static collect(): Record<string, any> {
    const layoutState = useLayoutStore.getState();
    const focusState = useFocusStore.getState();

    const registeredPanels = panelRegistry.getAll().map((p) => ({
      id: p.id,
      title: p.title,
      preferredDock: p.preferredDock,
      capabilities: p.capabilities,
    }));

    const registeredCommands = commandRegistry.getAll().map((c) => ({
      id: c.id,
      title: c.title,
      category: c.category,
    }));

    return {
      timestamp: new Date().toISOString(),
      layout: {
        version: layoutState.layout.version,
        profile: layoutState.layout.profile,
        state: layoutState.layout,
      },
      focus: {
        currentFocus: focusState.currentFocus,
      },
      panels: {
        count: registeredPanels.length,
        items: registeredPanels,
      },
      commands: {
        count: registeredCommands.length,
        items: registeredCommands,
      },
      system: {
        memory: typeof process !== 'undefined' ? process.memoryUsage?.() : null,
        platform: typeof process !== 'undefined' ? process.platform : 'browser',
      },
    };
  }
}
export default PlatformDiagnosticsService;
