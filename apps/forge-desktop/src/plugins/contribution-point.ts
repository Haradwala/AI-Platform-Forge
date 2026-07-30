import { IPanelContribution, ICommandContribution } from './interfaces';
import { panelRegistry } from './panel-registry';
import { commandRegistry } from './command-registry';

/**
 * ContributionPoint — handles the registration of different contributions.
 */
export class ContributionPoint {
  static registerPanel(panel: IPanelContribution): void {
    panelRegistry.register(panel);
  }

  static registerCommand(command: ICommandContribution): void {
    commandRegistry.register(command);
  }
}
