import type { RecoveryPolicy } from './recovery-types';
export declare class RecoveryPolicyEngine {
    private readonly policies;
    getPolicy(name: string): RecoveryPolicy;
}
