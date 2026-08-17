export interface ProviderRate {
  providerId: string;
  modelName: string;
  costPerMillionInputTokens: number;
  costPerMillionOutputTokens: number;
  isFreeTier: boolean;
  maxRpm: number;
  currentErrorCount: number;
  cooldownUntilMs?: number;
}

export interface TokenUsageRecord {
  provider: string;
  inputTokens: number;
  outputTokens: number;
  isFreeTier?: boolean;
}

export interface CostCalculation {
  provider: string;
  inputCostUsd: number;
  outputCostUsd: number;
  totalCostUsd: number;
}

export interface BudgetConfig {
  maxBudgetUsd: number;
  alertThresholdRatio: number;
}

export interface BudgetStatus {
  tenantId: string;
  totalSpentUsd: number;
  totalTokens: number;
  isExhausted: boolean;
  isAlertTriggered: boolean;
}
