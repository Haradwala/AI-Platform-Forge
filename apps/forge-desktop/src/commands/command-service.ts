import { commandRegistry } from '../plugins/command-registry';

/**
 * CommandService — handles command execution in the renderer process.
 * Calls the handler from the centralized CommandRegistry.
 */
export class CommandService {
  /**
   * Executes a registered command by its ID, passing any additional arguments.
   */
  static execute(commandId: string, ...args: any[]): any {
    const cmd = commandRegistry.getById(commandId);
    if (!cmd) {
      throw new Error(`CommandRegistry: Command with ID "${commandId}" was not found.`);
    }

    try {
      return cmd.handler(...args);
    } catch (err) {
      console.error(`[CommandService] Error executing command "${commandId}":`, err);
      throw err;
    }
  }
}
