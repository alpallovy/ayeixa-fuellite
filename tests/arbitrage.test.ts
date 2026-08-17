import { ProviderArbitrageRouter } from '../src/ProviderArbitrageRouter';

describe('ProviderArbitrageRouter', () => {
  it('prioritizes free tier providers first, then lowest cost', () => {
    const router = new ProviderArbitrageRouter();
    router.registerProvider({ providerId: 'paid-exp', modelName: 'exp', costPerMillionInputTokens: 5, costPerMillionOutputTokens: 15, isFreeTier: false, maxRpm: 10, currentErrorCount: 0 });
    router.registerProvider({ providerId: 'free-fast', modelName: 'free', costPerMillionInputTokens: 0, costPerMillionOutputTokens: 0, isFreeTier: true, maxRpm: 15, currentErrorCount: 0 });
    router.registerProvider({ providerId: 'paid-cheap', modelName: 'cheap', costPerMillionInputTokens: 0.5, costPerMillionOutputTokens: 0.5, isFreeTier: false, maxRpm: 30, currentErrorCount: 0 });

    const ranked = router.rankProviders();
    expect(ranked[0].providerId).toBe('free-fast');
    expect(ranked[1].providerId).toBe('paid-cheap');
    expect(ranked[2].providerId).toBe('paid-exp');
  });

  it('excludes providers in active cooldown', () => {
    const router = new ProviderArbitrageRouter();
    router.registerProvider({ providerId: 'p1', modelName: 'm1', costPerMillionInputTokens: 0, costPerMillionOutputTokens: 0, isFreeTier: true, maxRpm: 10, currentErrorCount: 0 });
    router.markFailure('p1', 10000);

    const ranked = router.rankProviders();
    expect(ranked.find(p => p.providerId === 'p1')).toBeUndefined();
  });
});
