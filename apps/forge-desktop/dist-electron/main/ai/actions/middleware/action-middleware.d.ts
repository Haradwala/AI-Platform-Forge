/**
 * action-middleware.ts — Phase 29 Action Middleware Pipeline Runner
 */
import { ActionRequest, ActionResult, IActionMiddleware } from '../action-types';
export declare class ActionMiddlewarePipeline {
    private middlewares;
    use(middleware: IActionMiddleware): void;
    run(req: ActionRequest, finalHandler: () => Promise<ActionResult>): Promise<ActionResult>;
}
