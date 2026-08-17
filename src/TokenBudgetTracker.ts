import { BudgetConfig, BudgetStatus } from './types';

export class TokenBudgetTracker {
  private tenantSpends: Map<string, { spentUsd: number; tokens: number }> = new Map();

  constructor(private config: BudgetConfig) {}

  public recordSpend(tenantId: string, costUsd: number, tokens: number): BudgetStatus {
    const current = this.tenantSpends.get(tenantId) || { spentUsd: 0, tokens: 0 };
    current.spentUsd = Number((current.spentUsd + costUsd).toFixed(6));
    current.tokens += tokens;
    this.tenantSpends.set(tenantId, current);

    return this.getStatus(tenantId);
  }

  public getStatus(tenantId: string): BudgetStatus {
    const current = this.tenantSpends.get(tenantId) || { spentUsd: 0, tokens: 0 };
    const isExhausted = current.spentUsd >= this.config.maxBudgetUsd;
    const isAlertTriggered = current.spentUsd >= (this.config.maxBudgetUsd * this.config.alertThresholdRatio);

    return {
      tenantId,
      totalSpentUsd: current.spentUsd,
      totalTokens: current.tokens,
      isExhausted,
      isAlertTriggered
    };
  }

  public canProceed(tenantId: string): boolean {
    return !this.getStatus(tenantId).isExhausted;
  }
}
