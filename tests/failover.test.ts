import { ProviderArbitrageRouter } from '../src/ProviderArbitrageRouter';
import { FailoverExecutor } from '../src/FailoverExecutor';

describe('FailoverExecutor', () => {
  it('fails over to secondary provider when primary throws error', async () => {
    const router = new ProviderArbitrageRouter();
    router.registerProvider({ providerId: 'p1', modelName: 'm1', costPerMillionInputTokens: 0, costPerMillionOutputTokens: 0, isFreeTier: true, maxRpm: 10, currentErrorCount: 0 });
    router.registerProvider({ providerId: 'p2', modelName: 'm2', costPerMillionInputTokens: 1, costPerMillionOutputTokens: 1, isFreeTier: false, maxRpm: 10, currentErrorCount: 0 });

    const executor = new FailoverExecutor(router);

    const res = await executor.executeWithFailover(async (prov) => {
      if (prov.providerId === 'p1') throw new Error("Rate limit 429");
      return "Success from " + prov.providerId;
    });

    expect(res.providerUsed).toBe('p2');
    expect(res.result).toBe('Success from p2');
  });
});
