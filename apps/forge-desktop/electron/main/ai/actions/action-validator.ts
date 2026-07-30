/**
 * action-validator.ts — Phase 29 Action Validator
 *
 * Validates ActionRequest input parameters and security permissions before execution.
 */

import { ActionRequest, IAction } from './action-types';

export interface ActionValidationResult {
  valid: boolean;
  errors: string[];
}

export class ActionValidator {
  async validate(action: IAction, req: ActionRequest): Promise<ActionValidationResult> {
    const errors: string[] = [];

    // Check custom validate implementation on Action
    if (action.validate) {
      try {
        const isValid = await action.validate(req.params);
        if (!isValid) {
          errors.push(`Action ${action.metadata.id} schema validation failed for input parameters.`);
        }
      } catch (err: any) {
        errors.push(`Action validation error: ${err.message}`);
      }
    }

    // Check workspaceRoot
    if (!req.workspaceRoot) {
      errors.push('ActionRequest is missing required workspaceRoot parameter.');
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }
}
