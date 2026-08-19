# Ayeixa FuelLite

> Fine-grained agent token tracking, zero-cost provider arbitrage, and failover router.

## Status: Pre-Release (v0.1.0-alpha)
*Note: Public npm registry publication is pending. To use or evaluate this package, clone and build locally.*

## Features
- **Deterministic Token Cost Estimation**: USD computation for Prompt, Completion, and Cache across multi-provider tiers (Gemini, Groq, Cerebras, Chutes).
- **Zero-Cost Arbitrage Router**: Ranks providers dynamically prioritizing free tier availability, lowest cost, and response health.
- **Budget Ceilings & Token Quotas**: Hard stop guards and threshold alarms per tenant, agent session, or time epoch.
- **Adaptive Failover Engine**: Transparent provider failover with exponential backoff on HTTP 429 / 503 errors and adaptive cooldowns.

## Installation & Local Build
```bash
# Clone the repository
git clone https://github.com/alpallovy/ayeixa-fuellite.git
cd ayeixa-fuellite

# Install dependencies and build
npm install
npm run build
npm test
```

## Quick Start
```typescript
import { CostEstimator, ProviderArbitrageRouter, TokenBudgetTracker, FailoverExecutor } from './src';

// 1. Estimate cost
const estimator = new CostEstimator();
const cost = estimator.calculateCost({
  provider: 'gemini-flash',
  inputTokens: 1500,
  outputTokens: 400,
  isFreeTier: true
});
console.log("USD Cost:", cost.totalCostUsd); // 0.0

// 2. Setup budget tracker
const tracker = new TokenBudgetTracker({ maxBudgetUsd: 10.0, alertThresholdRatio: 0.8 });
tracker.recordSpend("tenant-1", cost.totalCostUsd, 1900);
```

## Feedback & real-world use

If you try this project in a real workflow, share technical feedback — including negative results or integration problems — in [Discussions](https://github.com/alpallovy/ayeixa-fuellite/discussions/2). Participation is voluntary; no payment required. With explicit permission, useful experiences may become attributed or anonymized case studies.

## License
Distributed under the **MIT** License. See `LICENSE` for details.

## Engineering blog

- [FuelLite zero-cost provider routing](https://alpallovy.github.io/ayeixa-blog/blog/fuellite-zero-cost-provider-routing)
- [DEV Community intro](https://dev.to/alp_allovi_45214d2d8316a1/introducing-ayeixa-fuellite-free-tier-token-arbitrage-dynamic-failover-router-15og)

## Feedback

After local evaluation (`npm test`), open a [GitHub issue](https://github.com/alpallovy/ayeixa-fuellite/issues) with integration feedback.
