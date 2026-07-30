"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RecoveryPolicyEngine = void 0;
class RecoveryPolicyEngine {
    policies = {
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
    getPolicy(name) {
        return this.policies[name] || this.policies.balanced;
    }
}
exports.RecoveryPolicyEngine = RecoveryPolicyEngine;
//# sourceMappingURL=recovery-policy-engine.js.map