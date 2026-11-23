# GitHub issue to create for v2

**Title:** v2: Shared rate limiting and bulk CSV checks

**Body:**

## Problem
The current rate limiter (`src/lib/rate-limit.ts`) keeps counts in memory, so on Vercel each serverless instance has its own counter and the limit is only a soft guard. In the cheap test, a QA tester asked to check many listings at once and said a team would pay about US$100 per year for bulk checking (`docs/01-idea-validation.md`, Step 6).

## Proposal
1. Replace the in-memory limiter with a shared store (for example Upstash Redis via `@upstash/ratelimit`), keeping the same `allow(key)` interface so the route does not change.
2. Add a CSV upload: one listing per row, checked with limited concurrency, results downloadable as CSV.
3. Add an evaluation script that runs 50+ labelled sample listings through the AI and reports field accuracy, to catch regressions when the model or prompt changes.

## Acceptance criteria
- Two parallel instances share one limit (integration test with a mock store).
- A 20-row CSV returns 20 results with status and score.
- `npm run eval` prints per-field accuracy and fails below a set threshold.

**Labels:** enhancement, v2
