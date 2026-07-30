import { PipelineContext } from './pipeline-context';
import type { IWorkspaceService, IDesktopLogger } from '../../container/service-interfaces';
export declare class PipelineRecorder {
    private readonly workspaceService;
    private readonly logger;
    constructor(workspaceService: IWorkspaceService, logger: IDesktopLogger);
    record(context: PipelineContext): Promise<string | null>;
}
