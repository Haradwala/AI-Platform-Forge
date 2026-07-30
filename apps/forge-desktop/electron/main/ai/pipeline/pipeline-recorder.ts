import * as fs from 'fs';
import * as path from 'path';
import { PipelineContext } from './pipeline-context';
import type { IWorkspaceService, IDesktopLogger } from '../../container/service-interfaces';

export class PipelineRecorder {
  constructor(
    private readonly workspaceService: IWorkspaceService,
    private readonly logger: IDesktopLogger
  ) {}

  async record(context: PipelineContext): Promise<string | null> {
    const root = this.workspaceService.getRootPath();
    if (!root) {
      this.logger.warn('[PipelineRecorder] No workspace root available. Skipping record write.');
      return null;
    }

    try {
      const now = new Date();
      const year = now.getFullYear().toString();
      const month = (now.getMonth() + 1).toString().padStart(2, '0');
      const runsDir = path.join(root, '.forge', 'pipeline', 'runs', year, month);

      await fs.promises.mkdir(runsDir, { recursive: true });

      const filename = `run-${context.id}.json`;
      const fullPath = path.join(runsDir, filename);

      await fs.promises.writeFile(fullPath, JSON.stringify(context, null, 2), 'utf-8');
      this.logger.info(`[PipelineRecorder] Saved pipeline execution record to: ${fullPath}`);
      return fullPath;
    } catch (err: any) {
      this.logger.error('[PipelineRecorder] Failed to write pipeline log record:', err);
      return null;
    }
  }
}
