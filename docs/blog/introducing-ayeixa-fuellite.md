# Slashing LLM Inference Costs with Dynamic Free-Tier Arbitrage & Failover

## 1. Introduction & Overview
Continuous autonomous agent execution loops consume substantial token volumes. In multi-tenant environments, unmonitored model calls quickly trigger rate-limit throttling (HTTP 429) or excessive API billing.

**Ayeixa FuelLite** (`@ayeixa/fuellite`) is an open-source TypeScript library for zero-cost multi-provider token arbitrage, quota tracking, and resilient failover.

- **GitHub Repository**: [https://github.com/alpallovy/ayeixa-fuellite](https://github.com/alpallovy/ayeixa-fuellite)
- **Status**: Pre-Release (`v0.1.0-alpha`)
- **License**: MIT
- **NPM Status**: Public registry publication is pending; evaluate and build locally.

---

## 2. Core Architecture
FuelLite provides four synchronized modules:

1. **CostEstimator**: Deterministic numeric cost estimation using token counts and configured rates, with reported USD values rounded to six decimal places.
2. **ProviderArbitrageRouter**: Ranks configured model providers, prioritizing providers configured as free-tier (`isFreeTier: true`) before falling back to lower-cost paid endpoints.
3. **TokenBudgetTracker**: Tracks cumulative tenant and session token budgets with hard-stop limits and threshold warning alarms.
4. **FailoverExecutor**: Transparently handles provider outages and rate limits with exponential backoff ($2^n \times \text{base}$) and cooldown recovery.

---

## 3. Implemented Capabilities & Test Verification
Verified with hermetic unit tests:
- **Cost Estimation**: Six-decimal USD calculation across token counts (`tests/cost.test.ts`).
- **Arbitrage Routing**: Prioritizing configured free-tier providers and lowest cost (`tests/arbitrage.test.ts`).
- **Budget Tracking**: Hard quota enforcement and spend recording (`tests/budget.test.ts`).
- **Failover Logic**: HTTP 429/503 retry backoff and provider hopping (`tests/failover.test.ts`).

Test Verification Receipt: **6/6 hermetic unit tests passing** (0 failures).

---

## 4. Local Installation & Quick Start
```bash
# Clone & build locally
git clone https://github.com/alpallovy/ayeixa-fuellite.git
cd ayeixa-fuellite
npm ci
npm run build
npm test
```

### Usage Example
```typescript
import { CostEstimator, ProviderArbitrageRouter, TokenBudgetTracker } from './src';

const estimator = new CostEstimator();
const cost = estimator.calculateCost({
  provider: 'gemini-flash',
  inputTokens: 1500,
  outputTokens: 400,
  isFreeTier: true
});
console.log("Total Cost (USD):", cost.totalCostUsd); // 0.0

const tracker = new TokenBudgetTracker({ maxBudgetUsd: 5.0 });
tracker.recordSpend("tenant-alpha", cost.totalCostUsd, 1900);
console.log("Remaining Budget:", tracker.getRemainingBudget("tenant-alpha"));
```

---

## 5. Limitations & Roadmap
- Pre-release `v0.1.0-alpha`.
- Provider rates are statically configured; dynamic live pricing synchronizers are planned on the roadmap.
- Public npm publication is pending.

---

## 6. Contributing
Contributions are warmly invited. See `CONTRIBUTING.md` and check open `good first issue` items in the repository.
- **License**: MIT
