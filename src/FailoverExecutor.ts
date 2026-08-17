import { ProviderArbitrageRouter } from './ProviderArbitrageRouter';
import { ProviderRate } from './types';

export class FailoverExecutor {
  constructor(private router: ProviderArbitrageRouter) {}

  public async executeWithFailover<T>(
    operation: (provider: ProviderRate) => Promise<T>,
    maxAttempts = 3
  ): Promise<{ result: T; providerUsed: string }> {
    const ranked = this.router.rankProviders();
    if (ranked.length === 0) {
      throw new Error("No active or healthy providers available in pool.");
    }

    const errors: string[] = [];

    for (let i = 0; i < Math.min(ranked.length, maxAttempts); i++) {
      const provider = ranked[i];
      try {
        const result = await operation(provider);
        this.router.markSuccess(provider.providerId);
        return { result, providerUsed: provider.providerId };
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : String(err);
        this.router.markFailure(provider.providerId);
        errors.push(`[${provider.providerId}]: ${msg}`);
      }
    }

    throw new Error(`All provider failover attempts exhausted. Errors: ${errors.join('; ')}`);
  }
}
