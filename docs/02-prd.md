# PRD: ListingLint (one page)

**Owner:** Christopher Jones Mante Magalona · **Version:** 1.0 (MVP) · **Status:** Live

### 1. Problem and goal
Reviewers clean up messy used-equipment listings by hand, slowly and inconsistently. **Goal:** in under 30 seconds, turn one pasted listing into structured fields, a publish or fix decision made by tested rules, and a seller message.

### 2. Target users
**Primary:** listing reviewers and operations staff. **Secondary:** sellers.

### 3. Features and acceptance criteria
| # | Feature | Acceptance criteria (testable) |
|---|---|---|
| F1 | Paste and check a listing | 20 to 4,000 characters accepted; anything else returns AI-400 with a field message |
| F2 | AI extraction | Returns all listing fields and a short summary; unstated fields are null; output failing the schema returns AI-502 |
| F3 | Rule checks | Missing make, model, year or country: error. Year outside 1950 to next year: error. Over 5,000 hours a year: warning. Price of zero or less, or unsupported currency: error. Price below 50% or above 150% of the category band: warning |
| F4 | Duplicate detection | Same serial, or same make, model and year with hours within 2%, is an error naming the existing listing |
| F5 | Decision and score | Any error: Blocked; else any warning: Needs review; else Ready. Score = 100 minus 25 per error, 10 per warning, 2 per info (minimum 0) |
| F6 | Message and title | Message lists only error and warning questions, numbered; title built in code as "Year Make Model Category" |
| F7 | Safety | Listing text cannot change the status; off-topic text is rejected; the key never reaches the browser |

### 4. Success metrics
At least 90% field accuracy; all seeded issues caught; CI green; responses under 10 seconds.

### 5. Scope and non-goals
**In scope:** single listing check, mixed-language input, sample data, web UI, monitoring, CI/CD. **Out of scope (v1):** accounts, saved history, bulk upload, images, live rates, real price data.

### 6. Constraints, risks and dependencies
**Depends on:** OpenAI-compatible API with tool calling, Vercel, GitHub. **Constraints:** made-up data; key only in environment variables. **Risks:** wrong extraction (human review), prompt injection (code decides).
