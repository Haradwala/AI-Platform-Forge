/**
 * ui-action-provider.ts — Phase 29 UI & User Interaction Action Provider
 *
 * Implements normalized UI actions: BrowserPreview, AskApproval, ShowNotification.
 */
import { IAction, IActionProvider } from '../action-types';
export declare class UIActionProvider implements IActionProvider {
    readonly id = "provider.ui";
    readonly name = "UI Action Provider";
    getActions(): IAction[];
}
