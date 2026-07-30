import { PipelineContext } from './pipeline-context';
import { IAiPipelineStage } from './pipeline-stage';
import type { IDesktopEventBus } from '../../container/service-interfaces';
export declare class PipelineExecutor {
    private readonly eventBus;
    constructor(eventBus: IDesktopEventBus);
    execute(initialContext: PipelineContext, stages: IAiPipelineStage[]): Promise<PipelineContext>;
}
