"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PipelineExecutor = void 0;
const pipeline_context_1 = require("./pipeline-context");
class PipelineExecutor {
    eventBus;
    constructor(eventBus) {
        this.eventBus = eventBus;
    }
    async execute(initialContext, stages) {
        let context = initialContext;
        this.eventBus.emit('ai:event', {
            type: 'PIPELINE_STARTED',
            payload: {
                id: context.id,
                prompt: context.prompt,
                timestamp: context.timestamp,
            },
        });
        for (const stage of stages) {
            const isApplicable = stage.shouldExecute(context);
            const stageStart = new Date().toISOString();
            const startTime = Date.now();
            this.eventBus.emit('ai:event', {
                type: 'STAGE_STARTED',
                payload: {
                    id: context.id,
                    stageName: stage.name,
                    phase: stage.phase,
                    timestamp: stageStart,
                },
            });
            if (!isApplicable) {
                const durationMs = Date.now() - startTime;
                const entry = {
                    stageName: stage.name,
                    phase: stage.phase,
                    status: 'skipped',
                    timestamp: stageStart,
                    durationMs,
                };
                context = pipeline_context_1.PipelineContextHelper.addTimeline(context, entry);
                this.eventBus.emit('ai:event', {
                    type: 'STAGE_COMPLETED',
                    payload: {
                        id: context.id,
                        stageName: stage.name,
                        phase: stage.phase,
                        status: 'skipped',
                        durationMs,
                    },
                });
                continue;
            }
            try {
                const result = await stage.execute(context);
                const durationMs = Date.now() - startTime;
                const entry = {
                    stageName: stage.name,
                    phase: stage.phase,
                    status: result.status,
                    timestamp: stageStart,
                    durationMs,
                };
                context = pipeline_context_1.PipelineContextHelper.addTimeline(result.nextContext, entry);
                this.eventBus.emit('ai:event', {
                    type: 'STAGE_COMPLETED',
                    payload: {
                        id: context.id,
                        stageName: stage.name,
                        phase: stage.phase,
                        status: result.status,
                        durationMs,
                    },
                });
            }
            catch (err) {
                const durationMs = Date.now() - startTime;
                const entry = {
                    stageName: stage.name,
                    phase: stage.phase,
                    status: 'failed',
                    timestamp: stageStart,
                    durationMs,
                };
                context = pipeline_context_1.PipelineContextHelper.addTimeline(context, entry);
                this.eventBus.emit('ai:event', {
                    type: 'STAGE_COMPLETED',
                    payload: {
                        id: context.id,
                        stageName: stage.name,
                        phase: stage.phase,
                        status: 'failed',
                        error: err.message,
                        durationMs,
                    },
                });
                this.eventBus.emit('ai:event', {
                    type: 'PIPELINE_COMPLETED',
                    payload: {
                        id: context.id,
                        status: 'failed',
                        error: err.message,
                        timeline: context.timeline,
                    },
                });
                throw err;
            }
        }
        this.eventBus.emit('ai:event', {
            type: 'PIPELINE_COMPLETED',
            payload: {
                id: context.id,
                status: 'completed',
                timeline: context.timeline,
            },
        });
        return context;
    }
}
exports.PipelineExecutor = PipelineExecutor;
//# sourceMappingURL=pipeline-executor.js.map