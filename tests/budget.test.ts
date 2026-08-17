import { TokenBudgetTracker } from '../src/TokenBudgetTracker';

describe('TokenBudgetTracker', () => {
  it('enforces budget limits and raises threshold alerts', () => {
    const tracker = new TokenBudgetTracker({ maxBudgetUsd: 10.0, alertThresholdRatio: 0.8 });

    tracker.recordSpend('tenant-A', 5.0, 50000);
    expect(tracker.getStatus('tenant-A').isAlertTriggered).toBe(false);
    expect(tracker.canProceed('tenant-A')).toBe(true);

    tracker.recordSpend('tenant-A', 3.5, 35000);
    expect(tracker.getStatus('tenant-A').isAlertTriggered).toBe(true);
    expect(tracker.canProceed('tenant-A')).toBe(true);

    tracker.recordSpend('tenant-A', 2.0, 20000);
    expect(tracker.getStatus('tenant-A').isExhausted).toBe(true);
    expect(tracker.canProceed('tenant-A')).toBe(false);
  });
});
