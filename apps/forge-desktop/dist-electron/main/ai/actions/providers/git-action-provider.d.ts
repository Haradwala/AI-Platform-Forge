/**
 * git-action-provider.ts — Phase 29 Git Action Provider
 *
 * Implements normalized Git actions: GitStatus, GitDiff, GitCommit, GitCheckout.
 */
import { IAction, IActionProvider } from '../action-types';
export declare class GitActionProvider implements IActionProvider {
    readonly id = "provider.git";
    readonly name = "Git Action Provider";
    getActions(): IAction[];
}
