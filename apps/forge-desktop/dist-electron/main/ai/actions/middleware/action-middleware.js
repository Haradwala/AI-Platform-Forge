"use strict";
/**
 * action-middleware.ts — Phase 29 Action Middleware Pipeline Runner
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActionMiddlewarePipeline = void 0;
class ActionMiddlewarePipeline {
    middlewares = [];
    use(middleware) {
        this.middlewares.push(middleware);
    }
    async run(req, finalHandler) {
        let index = -1;
        const dispatch = async (i) => {
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
exports.ActionMiddlewarePipeline = ActionMiddlewarePipeline;
//# sourceMappingURL=action-middleware.js.map