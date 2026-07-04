import { IContextCompressor } from '../../interfaces/compression';
import { IBudgetPolicy } from '../../interfaces/budget';
import { ICandidateContext } from '@forge/shared';

export class StructuralCompressor implements IContextCompressor {
  readonly id = 'StructuralCompressor';

  async compress(candidate: ICandidateContext, policy: IBudgetPolicy): Promise<ICandidateContext> {
    if (!policy.shouldCompress(candidate) || policy.compressionLevel === 'none') {
      return candidate;
    }

    const compressedContent = candidate.content
      .split(/\r?\n/)
      .map((line) => line.trimEnd())
      .filter((line) => line.length > 0)
      .join('\n');

    return {
      ...candidate,
      content: compressedContent,
      estimatedTokens: Math.ceil(compressedContent.length / 4)
    };
  }
}
