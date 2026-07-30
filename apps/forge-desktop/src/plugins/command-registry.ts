import { ICommandContribution } from './interfaces';

export class CommandRegistry {
  private readonly commands = new Map<string, ICommandContribution>();

  register(command: ICommandContribution): void {
    if (this.commands.has(command.id)) {
      throw new Error(`CommandRegistry: Command with ID "${command.id}" is already registered.`);
    }
    this.commands.set(command.id, command);
  }

  getById(id: string): ICommandContribution | null {
    return this.commands.get(id) ?? null;
  }

  getAll(): ICommandContribution[] {
    return Array.from(this.commands.values());
  }

  unregister(id: string): void {
    this.commands.delete(id);
  }

  clear(): void {
    this.commands.clear();
  }
}

export const commandRegistry = new CommandRegistry();
