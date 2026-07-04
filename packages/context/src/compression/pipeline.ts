import { IContextCompressor } from '../interfaces/compression';
import { IBudgetPolicy } from '../interfaces/budget';
import { ICandidateContext } from '@forge/shared';
import { StructuralCompressor } from './stages/structural';
import { CodeCompressor } from './stages/code';
import { DocumentationCompressor } from './stages/doc';

export class CompressionPipeline {
  private compressors: IContextCompressor[] = [];

  constructor() {
    this.compressors.push(new StructuralCompressor());
    this.compressors.push(new CodeCompressor());
    this.compressors.push(new DocumentationCompressor());
  }

  registerCompressor(compressor: IContextCompressor): void {
    this.compressors.push(compressor);
  }

  async execute(candidate: ICandidateContext, policy: IBudgetPolicy): Promise<ICandidateContext> {
    let current = candidate;
    for (const compressor of this.compressors) {
      current = await compressor.compress(current, policy);
    }
    return current;
  }
}
