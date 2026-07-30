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

export class ExpressionEvaluator {
  /**
   * Evaluates a condition string against the provided context.
   */
  evaluateCondition(condition?: string, context: ExpressionContext = {}): boolean {
    if (!condition || condition.trim() === '') {
      // Default: execute if no previous failure
      return !context.hasFailure && !context.isCancelled;
    }

    const clean = condition.replace(/\$\{\{\s*/g, '').replace(/\s*\}\}/g, '').trim();

    if (clean === 'success()') {
      return !context.hasFailure && !context.isCancelled;
    }
    if (clean === 'failure()') {
      return !!context.hasFailure && !context.isCancelled;
    }
    if (clean === 'always()') {
      return true;
    }
    if (clean === 'cancelled()') {
      return !!context.isCancelled;
    }

    // Evaluate simple comparison expressions like "outcome.step1.status == 'COMPLETED'"
    if (clean.includes('==')) {
      const [left, right] = clean.split('==').map((s) => s.trim().replace(/^['"]|['"]$/g, ''));
      const leftVal = this.interpolate(left, context);
      return leftVal === right;
    }

    return !context.hasFailure && !context.isCancelled;
  }

  /**
   * Interpolates template expressions in strings (e.g. "Hello ${{ inputs.name }}").
   */
  interpolate(template: string, context: ExpressionContext): string {
    if (!template || typeof template !== 'string') return template;

    return template.replace(/\$\{\{\s*([\w.]+)\s*\}\}/g, (_, path) => {
      const parts = path.split('.');
      let val: any = context;
      for (const part of parts) {
        if (val && typeof val === 'object') {
          val = val[part];
        } else {
          val = undefined;
          break;
        }
      }
      return val !== undefined ? String(val) : '';
    });
  }
}
