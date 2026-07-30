/**
 * git-application-service.ts — Application Service for Git Source Control Operations
 *
 * Encapsulates Git application use-cases, routing repository state changes
 * through the Action System (ActionExecutor).
 */

import { ActionExecutor } from '../../ai/actions/action-executor';
import { ActionResult } from '../../ai/actions/action-types';

export interface IGitApplicationService {
  getStatus(workspaceRoot: string): Promise<ActionResult>;
  commit(workspaceRoot: string, message: string): Promise<ActionResult>;
  checkout(workspaceRoot: string, branch: string): Promise<ActionResult>;
  getDiff(workspaceRoot: string): Promise<ActionResult>;
  pull(workspaceRoot: string): Promise<ActionResult>;
}

export class GitApplicationService implements IGitApplicationService {
  constructor(private readonly actionExecutor: ActionExecutor) {}

  async getStatus(workspaceRoot: string): Promise<ActionResult> {
    return this.actionExecutor.executeAction({
      id: `act_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      actionId: 'git.status',
      runtimeId: 'system',
      timestamp: Date.now(),
      workspaceRoot,
      params: {},
    });
  }

  async commit(workspaceRoot: string, message: string): Promise<ActionResult> {
    return this.actionExecutor.executeAction({
      id: `act_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      actionId: 'git.commit',
      runtimeId: 'system',
      timestamp: Date.now(),
      workspaceRoot,
      params: { message },
    });
  }

  async checkout(workspaceRoot: string, branch: string): Promise<ActionResult> {
    return this.actionExecutor.executeAction({
      id: `act_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      actionId: 'git.checkout',
      runtimeId: 'system',
      timestamp: Date.now(),
      workspaceRoot,
      params: { branch },
    });
  }

  async getDiff(workspaceRoot: string): Promise<ActionResult> {
    return this.actionExecutor.executeAction({
      id: `act_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      actionId: 'git.diff',
      runtimeId: 'system',
      timestamp: Date.now(),
      workspaceRoot,
      params: {},
    });
  }

  async pull(workspaceRoot: string): Promise<ActionResult> {
    return this.actionExecutor.executeAction({
      id: `act_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      actionId: 'git.pull',
      runtimeId: 'system',
      timestamp: Date.now(),
      workspaceRoot,
      params: {},
    });
  }
}
