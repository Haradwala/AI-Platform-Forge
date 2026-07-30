/**
 * expression-evaluator.ts — Conditional Expression & Variable Interpolation Engine
 *
 * Evaluates conditional expressions (`success()`, `failure()`, `always()`, `cancelled()`)
 * and interpolates `${{ inputs.foo }}`, `${{ variables.bar }}`, and `${{ env.BAZ }}`.
 */
export interface ExpressionContext {
    inputs?: Record<string, any>;
    variables?: Record<string, any>;
    env?: Record<string, string>;
    hasFailure?: boolean;
    isCancelled?: boolean;
    jobStatus?: string;
}
export declare class ExpressionEvaluator {
    /**
     * Evaluates a condition string against the provided context.
     */
    evaluateCondition(condition?: string, context?: ExpressionContext): boolean;
    /**
     * Interpolates template expressions in strings (e.g. "Hello ${{ inputs.name }}").
     */
    interpolate(template: string, context: ExpressionContext): string;
}
