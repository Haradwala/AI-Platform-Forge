import { describe, it, expect, vi, beforeEach } from 'vitest';
import { commandRegistry } from '../src/plugins/command-registry';
import { CommandService } from '../src/commands/command-service';

describe('CommandRegistry & CommandService', () => {
  beforeEach(() => {
    commandRegistry.clear();
  });

  it('registers and executes command handlers', () => {
    const handler = vi.fn().mockReturnValue('result');
    commandRegistry.register({
      id: 'cmd1',
      title: 'Command 1',
      handler,
    });

    const val = CommandService.execute('cmd1', 'arg1', 'arg2');
    expect(val).toBe('result');
    expect(handler).toHaveBeenCalledWith('arg1', 'arg2');
  });

  it('throws error when command is not found', () => {
    expect(() => CommandService.execute('nonexistent')).toThrow(
      'CommandRegistry: Command with ID "nonexistent" was not found.'
    );
  });

  it('throws when duplicate command IDs are registered', () => {
    commandRegistry.register({ id: 'cmd1', title: 'C1', handler: () => {} });
    expect(() =>
      commandRegistry.register({ id: 'cmd1', title: 'C1 Dup', handler: () => {} })
    ).toThrow('already registered');
  });

  it('unregisters commands correctly', () => {
    commandRegistry.register({ id: 'cmd1', title: 'C1', handler: () => 'ok' });
    expect(commandRegistry.getById('cmd1')).not.toBeNull();

    commandRegistry.unregister('cmd1');
    expect(commandRegistry.getById('cmd1')).toBeNull();
  });
});
