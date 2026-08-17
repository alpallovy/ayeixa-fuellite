import { CostEstimator } from '../src/CostEstimator';

describe('CostEstimator', () => {
  const estimator = new CostEstimator();

  it('calculates zero USD for free tier usage', () => {
    const cost = estimator.calculateCost({
      provider: 'gemini-1.5-flash',
      inputTokens: 10000,
      outputTokens: 2000
    });
    expect(cost.totalCostUsd).toBe(0);
  });

  it('calculates exact USD for paid providers', () => {
    const cost = estimator.calculateCost({
      provider: 'groq-llama-3',
      inputTokens: 1_000_000,
      outputTokens: 1_000_000
    });
    expect(cost.totalCostUsd).toBe(1.38);
  });
});
