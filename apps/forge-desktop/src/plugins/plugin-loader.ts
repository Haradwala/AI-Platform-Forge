import { IPlugin } from './interfaces';

export class PluginLoader {
  /**
   * Validates if the object conforms to the IPlugin interface contract.
   */
  static isValidPlugin(plugin: unknown): plugin is IPlugin {
    if (!plugin || typeof plugin !== 'object') return false;
    const p = plugin as Record<string, unknown>;

    return (
      typeof p.id === 'string' &&
      typeof p.name === 'string' &&
      typeof p.version === 'string' &&
      typeof p.activate === 'function'
    );
  }
}
