import { IRetrievalProviderRegistry, IRetrievalProvider } from './interfaces/provider';

export class RetrievalProviderRegistry implements IRetrievalProviderRegistry {
  private providers = new Map<string, IRetrievalProvider>();

  register(provider: IRetrievalProvider): void {
    this.providers.set(provider.id, provider);
  }

  unregister(providerId: string): void {
    this.providers.delete(providerId);
  }

  getProvider(providerId: string): IRetrievalProvider | undefined {
    return this.providers.get(providerId);
  }

  listProviders(): IRetrievalProvider[] {
    return Array.from(this.providers.values());
  }
}
