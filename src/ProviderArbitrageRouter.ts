import { ProviderRate } from './types';

export class ProviderArbitrageRouter {
  private providers: Map<string, ProviderRate> = new Map();

  public registerProvider(provider: ProviderRate): void {
    this.providers.set(provider.providerId, { ...provider });
  }

  public markFailure(providerId: string, cooldownDurationMs = 5000): void {
    const p = this.providers.get(providerId);
    if (p) {
      p.currentErrorCount += 1;
      p.cooldownUntilMs = Date.now() + cooldownDurationMs;
    }
  }

  public markSuccess(providerId: string): void {
    const p = this.providers.get(providerId);
    if (p) {
      p.currentErrorCount = Math.max(0, p.currentErrorCount - 1);
      p.cooldownUntilMs = undefined;
    }
  }

  public rankProviders(): ProviderRate[] {
    const now = Date.now();
    const available = Array.from(this.providers.values()).filter(p =>
      !p.cooldownUntilMs || p.cooldownUntilMs <= now
    );

    return available.sort((a, b) => {
      // 1. Free tier prioritized
      if (a.isFreeTier && !b.isFreeTier) return -1;
      if (!a.isFreeTier && b.isFreeTier) return 1;

      // 2. Lowest cost per million tokens
      const costA = a.costPerMillionInputTokens + a.costPerMillionOutputTokens;
      const costB = b.costPerMillionInputTokens + b.costPerMillionOutputTokens;
      if (costA !== costB) return costA - costB;

      // 3. Lowest recent error count
      return a.currentErrorCount - b.currentErrorCount;
    });
  }
}
