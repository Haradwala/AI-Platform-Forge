import { useEffect } from 'react';
import { commandRegistry } from '../plugins/command-registry';
import { ICommandContribution } from '../plugins/interfaces';

/**
 * useCommand — React hook to temporarily register a command in the CommandRegistry.
 *
 * Automatically registers the command on mount and cleans it up on unmount.
 */
export function useCommand(command: ICommandContribution): void {
  useEffect(() => {
    commandRegistry.register(command);
    return () => {
      commandRegistry.unregister(command.id);
    };
  }, [command.id, command.title, command.category, command.shortcut]);
}
