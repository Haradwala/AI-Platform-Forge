/**
 * action-middleware.ts — Phase 29 Action Middleware Pipeline Runner
 */

import { ActionRequest, ActionResult, IActionMiddleware } from '../action-types';

export class ActionMiddlewarePipeline {
  private middlewares: IActionMiddleware[] = [];

  use(middleware: IActionMiddleware): void {
    this.middlewares.push(middleware);
  }

  async run(req: ActionRequest, finalHandler: () => Promise<ActionResult>): Promise<ActionResult> {
    let index = -1;

    const dispatch = async (i: number): Promise<ActionResult> => {
      if (i <= index) {
        throw new Error('ActionMiddlewarePipeline: next() called multiple times');
      }
      index = i;
      if (i === this.middlewares.length) {
        return await finalHandler();
      }
      const middleware = this.middlewares[i];
      return await middleware.execute(req, () => dispatch(i + 1));
    };

    return await dispatch(0);
  }
}
