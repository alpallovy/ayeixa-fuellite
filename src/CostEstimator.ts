import { ProviderRate, TokenUsageRecord, CostCalculation } from './types';

export class CostEstimator {
  private rates: Map<string, ProviderRate> = new Map();

  constructor() {
    this.registerDefaultRates();
  }

  private registerDefaultRates(): void {
    this.registerRate({
      providerId: 'gemini-1.5-flash',
      modelName: 'gemini-1.5-flash',
      costPerMillionInputTokens: 0.075,
      costPerMillionOutputTokens: 0.30,
      isFreeTier: true,
      maxRpm: 15,
      currentErrorCount: 0
    });
    this.registerRate({
      providerId: 'groq-llama-3',
      modelName: 'llama-3-70b',
      costPerMillionInputTokens: 0.59,
      costPerMillionOutputTokens: 0.79,
      isFreeTier: false,
      maxRpm: 30,
      currentErrorCount: 0
    });
    this.registerRate({
      providerId: 'cerebras-llama-3',
      modelName: 'llama3.1-8b',
      costPerMillionInputTokens: 0.10,
      costPerMillionOutputTokens: 0.10,
      isFreeTier: true,
      maxRpm: 30,
      currentErrorCount: 0
    });
  }

  public registerRate(rate: ProviderRate): void {
    this.rates.set(rate.providerId, { ...rate });
  }

  public calculateCost(usage: TokenUsageRecord): CostCalculation {
    const rate = this.rates.get(usage.provider);
    if (!rate) {
      throw new Error(`Unknown provider rate '${usage.provider}'.`);
    }

    if (rate.isFreeTier || usage.isFreeTier) {
      return {
        provider: usage.provider,
        inputCostUsd: 0,
        outputCostUsd: 0,
        totalCostUsd: 0
      };
    }

    const inputCostUsd = (usage.inputTokens / 1_000_000) * rate.costPerMillionInputTokens;
    const outputCostUsd = (usage.outputTokens / 1_000_000) * rate.costPerMillionOutputTokens;
    const totalCostUsd = Number((inputCostUsd + outputCostUsd).toFixed(6));

    return {
      provider: usage.provider,
      inputCostUsd: Number(inputCostUsd.toFixed(6)),
      outputCostUsd: Number(outputCostUsd.toFixed(6)),
      totalCostUsd
    };
  }
}
