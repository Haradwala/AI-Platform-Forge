/**
 * workspace-application-service.ts — Application Service for Workspace Operations
 *
 * Encapsulates workspace filesystem application use-cases, routing all mutations
 * through the Action System (ActionExecutor) to enforce permission validation,
 * audit logging, and undo/redo capabilities.
 */

import { ActionExecutor } from '../../ai/actions/action-executor';
import { ActionResult } from '../../ai/actions/action-types';
import type { IWorkspaceService } from '../../container/service-interfaces';

export interface IWorkspaceApplicationService {
  readFile(workspaceRoot: string, filePath: string): Promise<string>;
  writeFile(workspaceRoot: string, filePath: string, content: string): Promise<ActionResult>;
  createFile(workspaceRoot: string, filePath: string): Promise<ActionResult>;
  createFolder(workspaceRoot: string, folderPath: string): Promise<ActionResult>;
  renameEntry(workspaceRoot: string, oldPath: string, newPath: string): Promise<ActionResult>;
  deleteEntry(workspaceRoot: string, filePath: string): Promise<ActionResult>;
}

export class WorkspaceApplicationService implements IWorkspaceApplicationService {
  constructor(
    private readonly actionExecutor: ActionExecutor,
    private readonly workspaceService?: IWorkspaceService
  ) {}

  async readFile(workspaceRoot: string, filePath: string): Promise<string> {
    const res = await this.actionExecutor.executeAction({
      id: `act_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      actionId: 'fs.read_file',
      runtimeId: 'system',
      timestamp: Date.now(),
      workspaceRoot,
      params: { filePath },
    });
    if (res.status === 'COMPLETED' && res.data?.content !== undefined) {
      return res.data.content;
    }
    if (this.workspaceService) {
      return this.workspaceService.readFile(filePath);
    }
    throw new Error(res.error || `Failed to read file: ${filePath}`);
  }

  async writeFile(workspaceRoot: string, filePath: string, content: string): Promise<ActionResult> {
    return this.actionExecutor.executeAction({
      id: `act_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      actionId: 'fs.write_file',
      runtimeId: 'system',
      timestamp: Date.now(),
      workspaceRoot,
      params: { filePath, content },
    });
  }

  async createFile(workspaceRoot: string, filePath: string): Promise<ActionResult> {
    return this.actionExecutor.executeAction({
      id: `act_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      actionId: 'fs.write_file',
      runtimeId: 'system',
      timestamp: Date.now(),
      workspaceRoot,
      params: { filePath, content: '' },
    });
  }

  async createFolder(workspaceRoot: string, folderPath: string): Promise<ActionResult> {
    return this.actionExecutor.executeAction({
      id: `act_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      actionId: 'fs.create_folder',
      runtimeId: 'system',
      timestamp: Date.now(),
      workspaceRoot,
      params: { folderPath },
    });
  }

  async renameEntry(workspaceRoot: string, oldPath: string, newPath: string): Promise<ActionResult> {
    return this.actionExecutor.executeAction({
      id: `act_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      actionId: 'fs.rename_file',
      runtimeId: 'system',
      timestamp: Date.now(),
      workspaceRoot,
      params: { oldPath, newPath },
    });
  }

  async deleteEntry(workspaceRoot: string, filePath: string): Promise<ActionResult> {
    return this.actionExecutor.executeAction({
      id: `act_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      actionId: 'fs.delete_file',
      runtimeId: 'system',
      timestamp: Date.now(),
      workspaceRoot,
      params: { filePath },
    });
  }
}
