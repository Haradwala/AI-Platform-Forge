import type { RecoveryPolicy } from './recovery-types';

export class RecoveryPolicyEngine {
  private readonly policies: Record<string, RecoveryPolicy> = {
    safe: {
      maxRetries: 1,
      maxRollbackDepth: 1,
      allowReplan: false,
      allowRegeneration: false,
      allowEscalation: true,
    },
    balanced: {
      maxRetries: 3,
      maxRollbackDepth: 2,
      allowReplan: true,
      allowRegeneration: true,
      allowEscalation: true,
    },
    aggressive: {
      maxRetries: 5,
      maxRollbackDepth: 4,
      allowReplan: true,
      allowRegeneration: true,
      allowEscalation: false,
    },
    enterprise: {
      maxRetries: 4,
      maxRollbackDepth: 3,
      allowReplan: true,
      allowRegeneration: true,
      allowEscalation: true,
    },
  };

  getPolicy(name: string): RecoveryPolicy {
    return this.policies[name] || this.policies.balanced;
  }
}
