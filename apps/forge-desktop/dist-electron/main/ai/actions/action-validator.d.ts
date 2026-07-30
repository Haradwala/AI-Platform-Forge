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
export declare class ActionValidator {
    validate(action: IAction, req: ActionRequest): Promise<ActionValidationResult>;
}
