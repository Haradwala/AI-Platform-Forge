import { IContextCompressor } from '../../interfaces/compression';
import { IBudgetPolicy } from '../../interfaces/budget';
import { ICandidateContext } from '@forge/shared';

export class CodeCompressor implements IContextCompressor {
  readonly id = 'CodeCompressor';

  async compress(candidate: ICandidateContext, policy: IBudgetPolicy): Promise<ICandidateContext> {
    if (!policy.shouldCompress(candidate) || policy.compressionLevel !== 'aggressive') {
      return candidate;
    }

    const compressedContent = candidate.content.replace(
      /(function\s+[a-zA-Z0-9_]+\s*\([^)]*\)\s*(:\s*[a-zA-Z0-9_<>[\]]+)?\s*)\{[^}]*\}/g,
      '$1{ /* elided */ }'
    );

    return {
      ...candidate,
      content: compressedContent,
      estimatedTokens: Math.ceil(compressedContent.length / 4)
    };
  }
}
