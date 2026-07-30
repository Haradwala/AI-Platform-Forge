/**
 * terminal-application-service.ts — Application Service for Terminal & Command Operations
 *
 * Encapsulates terminal execution application use-cases, routing command invocations
 * through the Action System (ActionExecutor) to enforce audit logging and policy checks.
 */

import { ActionExecutor } from '../../ai/actions/action-executor';
import { ActionResult } from '../../ai/actions/action-types';

export interface ITerminalApplicationService {
  runCommand(workspaceRoot: string, command: string): Promise<ActionResult>;
  runTests(workspaceRoot: string, testCommand?: string): Promise<ActionResult>;
  runBuild(workspaceRoot: string, buildCommand?: string): Promise<ActionResult>;
  runLint(workspaceRoot: string, lintCommand?: string): Promise<ActionResult>;
}

export class TerminalApplicationService implements ITerminalApplicationService {
  constructor(private readonly actionExecutor: ActionExecutor) {}

  async runCommand(workspaceRoot: string, command: string): Promise<ActionResult> {
    return this.actionExecutor.executeAction({
      id: `act_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      actionId: 'term.run_command',
      runtimeId: 'system',
      timestamp: Date.now(),
      workspaceRoot,
      params: { command },
    });
  }

  async runTests(workspaceRoot: string, testCommand?: string): Promise<ActionResult> {
    return this.actionExecutor.executeAction({
      id: `act_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      actionId: 'term.run_tests',
      runtimeId: 'system',
      timestamp: Date.now(),
      workspaceRoot,
      params: { testCommand },
    });
  }

  async runBuild(workspaceRoot: string, buildCommand?: string): Promise<ActionResult> {
    return this.actionExecutor.executeAction({
      id: `act_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      actionId: 'term.run_build',
      runtimeId: 'system',
      timestamp: Date.now(),
      workspaceRoot,
      params: { buildCommand },
    });
  }

  async runLint(workspaceRoot: string, lintCommand?: string): Promise<ActionResult> {
    return this.actionExecutor.executeAction({
      id: `act_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      actionId: 'term.run_lint',
      runtimeId: 'system',
      timestamp: Date.now(),
      workspaceRoot,
      params: { lintCommand },
    });
  }
}
