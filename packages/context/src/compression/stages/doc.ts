import { IContextCompressor } from '../../interfaces/compression';
import { IBudgetPolicy } from '../../interfaces/budget';
import { ICandidateContext } from '@forge/shared';

export class DocumentationCompressor implements IContextCompressor {
  readonly id = 'DocumentationCompressor';

  async compress(candidate: ICandidateContext, policy: IBudgetPolicy): Promise<ICandidateContext> {
    if (!policy.shouldCompress(candidate) || policy.compressionLevel === 'none') {
      return candidate;
    }

    const compressedContent = candidate.content.replace(/\/\*\*[\s\S]*?\*\//g, '');

    return {
      ...candidate,
      content: compressedContent,
      estimatedTokens: Math.ceil(compressedContent.length / 4)
    };
  }
}
